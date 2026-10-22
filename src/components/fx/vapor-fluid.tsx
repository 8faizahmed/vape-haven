"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

// Real-time fluid simulation (stable-fluids: advection, vorticity, pressure
// projection) rendered as warm vapour. The cursor injects velocity and dye, the
// dye rises and dissipates, and faint ambient wisps keep it alive on touch
// devices. Composited with mix-blend-mode: screen, so only the vapour shows.

// Tuned for soft, translucent vapour: little dye, gentle curl and a quick fade,
// so trails read as wisps rather than a fog over the video.
const CONFIG = {
  simResolution: 128,
  dyeResolution: 1024,
  // Display-only opacity: thins the look without weakening the buoyant motion.
  intensity: 0.6,
  densityDissipation: 1.15,
  velocityDissipation: 0.7,
  pressure: 0.8,
  pressureIterations: 20,
  curl: 12,
  splatRadius: 0.004,
  splatForce: 3800,
  buoyancy: 140,
  ambientEvery: 2.4,
};

const VERT = `#version 300 es
precision highp float;
in vec2 aPosition;
uniform vec2 texelSize;
out vec2 vUv, vL, vR, vT, vB;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0);
  vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y);
  vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const frag = (body: string) => `#version 300 es
precision highp float;
precision highp sampler2D;
in vec2 vUv, vL, vR, vT, vB;
out vec4 fragColor;
${body}`;

const SHADERS = {
  clear: frag(`uniform sampler2D uTexture; uniform float value;
void main() { fragColor = value * texture(uTexture, vUv); }`),

  splat: frag(`uniform sampler2D uTarget; uniform float aspectRatio; uniform vec3 color; uniform vec2 point; uniform float radius;
void main() {
  vec2 p = vUv - point;
  p.x *= aspectRatio;
  vec3 s = exp(-dot(p, p) / radius) * color;
  fragColor = vec4(texture(uTarget, vUv).xyz + s, 1.0);
}`),

  advection: frag(`uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main() {
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  fragColor = texture(uSource, coord) / (1.0 + dissipation * dt);
}`),

  divergence: frag(`uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).x;
  float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y;
  float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x;
  if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y;
  if (vB.y < 0.0) B = -C.y;
  fragColor = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`),

  curl: frag(`uniform sampler2D uVelocity;
void main() {
  float L = texture(uVelocity, vL).y;
  float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x;
  float B = texture(uVelocity, vB).x;
  fragColor = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`),

  vorticity: frag(`uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main() {
  float L = texture(uCurl, vL).x;
  float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x;
  float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001;
  force *= curl * C;
  force.y *= -1.0;
  vec2 velocity = texture(uVelocity, vUv).xy + force * dt;
  fragColor = vec4(clamp(velocity, -1000.0, 1000.0), 0.0, 1.0);
}`),

  buoyancy: frag(`uniform sampler2D uVelocity; uniform sampler2D uDye; uniform float buoyancy; uniform float dt;
void main() {
  vec2 v = texture(uVelocity, vUv).xy;
  float density = dot(texture(uDye, vUv).rgb, vec3(0.3333));
  v.y += buoyancy * density * dt;
  fragColor = vec4(v, 0.0, 1.0);
}`),

  pressure: frag(`uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  float divergence = texture(uDivergence, vUv).x;
  fragColor = vec4((L + R + B + T - divergence) * 0.25, 0.0, 0.0, 1.0);
}`),

  gradient: frag(`uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main() {
  float L = texture(uPressure, vL).x;
  float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x;
  float B = texture(uPressure, vB).x;
  vec2 velocity = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  fragColor = vec4(velocity, 0.0, 1.0);
}`),

  // A wide 5-tap blur (texelSize is set to a few dye texels) keeps edges soft
  // and hides fine marbling; tone mapping keeps highlights creamy.
  display: frag(`uniform sampler2D uTexture; uniform float intensity;
void main() {
  vec3 c = texture(uTexture, vUv).rgb * 0.4
    + (texture(uTexture, vL).rgb + texture(uTexture, vR).rgb + texture(uTexture, vT).rgb + texture(uTexture, vB).rgb) * 0.15;
  c = 1.0 - exp(-c * 1.35);
  fragColor = vec4(c * intensity, 1.0);
}`),
};

type GL = WebGL2RenderingContext;

type FBO = {
  texture: WebGLTexture;
  fbo: WebGLFramebuffer;
  width: number;
  height: number;
  texel: [number, number];
  attach: (unit: number) => number;
};
type DoubleFBO = { read: FBO; write: FBO; swap: () => void };

function createProgram(gl: GL, fragment: string) {
  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? "shader");
    return shader;
  };
  const program = gl.createProgram()!;
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment));
  gl.bindAttribLocation(program, 0, "aPosition");
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? "link");

  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(program, i)!.name;
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return {
    bind: () => gl.useProgram(program),
    u: (name: string) => uniforms[name] ?? null,
  };
}

export default function VaporFluid({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // A fresh canvas per mount. Cleanup loses the context, and a canvas whose
    // context is lost never yields a live one again — it paints opaque white,
    // which screen-blends the whole hero to white. Strict Mode and route
    // caching (<Activity>) both re-run this effect on the same DOM, so the
    // canvas can't live in JSX.
    const canvas = document.createElement("canvas");
    canvas.className = "block size-full";
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl || !(gl.getExtension("EXT_color_buffer_float") || gl.getExtension("EXT_color_buffer_half_float"))) return;

    const touch = !matchMedia("(pointer: fine)").matches;
    const dyeResolution = touch ? 512 : CONFIG.dyeResolution;
    const pressureIterations = touch ? 12 : CONFIG.pressureIterations;

    let programs: Record<keyof typeof SHADERS, ReturnType<typeof createProgram>>;
    try {
      programs = Object.fromEntries(
        Object.entries(SHADERS).map(([k, src]) => [k, createProgram(gl, src)]),
      ) as typeof programs;
    } catch {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      return;
    }
    host.appendChild(canvas);

    // Full-screen quad.
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const blit = (target: FBO | null) => {
      if (target) {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    let allocated: FBO[] = [];
    const createFBO = (w: number, h: number, internal: number, format: number): FBO => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, internal, w, h, 0, format, gl.HALF_FLOAT, null);
      const fbo = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const target: FBO = {
        texture,
        fbo,
        width: w,
        height: h,
        texel: [1 / w, 1 / h],
        attach(unit) {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, texture);
          return unit;
        },
      };
      allocated.push(target);
      return target;
    };
    const createDouble = (w: number, h: number, internal: number, format: number): DoubleFBO => {
      const d = { read: createFBO(w, h, internal, format), write: createFBO(w, h, internal, format) } as DoubleFBO;
      d.swap = () => ([d.read, d.write] = [d.write, d.read]);
      return d;
    };

    const resolution = (res: number) => {
      let aspect = gl.drawingBufferWidth / gl.drawingBufferHeight;
      if (aspect < 1) aspect = 1 / aspect;
      const min = Math.round(res);
      const max = Math.round(res * aspect);
      return gl.drawingBufferWidth > gl.drawingBufferHeight ? [max, min] : [min, max];
    };

    let dye: DoubleFBO, velocity: DoubleFBO, pressure: DoubleFBO, divergence: FBO, curl: FBO;
    const initFramebuffers = () => {
      allocated.forEach((t) => {
        gl.deleteTexture(t.texture);
        gl.deleteFramebuffer(t.fbo);
      });
      allocated = [];
      const [sw, sh] = resolution(CONFIG.simResolution);
      const [dw, dh] = resolution(dyeResolution);
      dye = createDouble(dw, dh, gl.RGBA16F, gl.RGBA);
      velocity = createDouble(sw, sh, gl.RG16F, gl.RG);
      pressure = createDouble(sw, sh, gl.R16F, gl.RED);
      divergence = createFBO(sw, sh, gl.R16F, gl.RED);
      curl = createFBO(sw, sh, gl.R16F, gl.RED);
    };

    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * Math.min(devicePixelRatio, 1.5)));
      const h = Math.max(1, Math.round(canvas.clientHeight * Math.min(devicePixelRatio, 1.5)));
      if (canvas.width === w && canvas.height === h && dye) return;
      canvas.width = w;
      canvas.height = h;
      initFramebuffers();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const aspect = () => canvas.width / canvas.height;

    const splat = (x: number, y: number, dx: number, dy: number, color: [number, number, number]) => {
      const p = programs.splat;
      p.bind();
      gl.uniform1i(p.u("uTarget"), velocity.read.attach(0));
      gl.uniform1f(p.u("aspectRatio"), aspect());
      gl.uniform2f(p.u("point"), x, y);
      gl.uniform3f(p.u("color"), dx, dy, 0);
      gl.uniform1f(p.u("radius"), CONFIG.splatRadius * Math.max(1, aspect()));
      blit(velocity.write);
      velocity.swap();
      gl.uniform1i(p.u("uTarget"), dye.read.attach(0));
      gl.uniform3f(p.u("color"), ...color);
      blit(dye.write);
      dye.swap();
    };

    // Creamy champagne vapour with a warm gold cast, never saturated.
    const vapour = (strength: number): [number, number, number] => {
      const t = Math.random();
      return [strength, strength * (0.84 + 0.08 * t), strength * (0.64 + 0.12 * t)];
    };

    const step = (dt: number) => {
      gl.disable(gl.BLEND);
      const simTexel = velocity.read.texel;

      let p = programs.curl;
      p.bind();
      gl.uniform2f(p.u("texelSize"), ...simTexel);
      gl.uniform1i(p.u("uVelocity"), velocity.read.attach(0));
      blit(curl);

      p = programs.vorticity;
      p.bind();
      gl.uniform2f(p.u("texelSize"), ...simTexel);
      gl.uniform1i(p.u("uVelocity"), velocity.read.attach(0));
      gl.uniform1i(p.u("uCurl"), curl.attach(1));
      gl.uniform1f(p.u("curl"), CONFIG.curl);
      gl.uniform1f(p.u("dt"), dt);
      blit(velocity.write);
      velocity.swap();

      p = programs.buoyancy;
      p.bind();
      gl.uniform2f(p.u("texelSize"), ...simTexel);
      gl.uniform1i(p.u("uVelocity"), velocity.read.attach(0));
      gl.uniform1i(p.u("uDye"), dye.read.attach(1));
      gl.uniform1f(p.u("buoyancy"), CONFIG.buoyancy);
      gl.uniform1f(p.u("dt"), dt);
      blit(velocity.write);
      velocity.swap();

      p = programs.divergence;
      p.bind();
      gl.uniform2f(p.u("texelSize"), ...simTexel);
      gl.uniform1i(p.u("uVelocity"), velocity.read.attach(0));
      blit(divergence);

      p = programs.clear;
      p.bind();
      gl.uniform1i(p.u("uTexture"), pressure.read.attach(0));
      gl.uniform1f(p.u("value"), CONFIG.pressure);
      blit(pressure.write);
      pressure.swap();

      p = programs.pressure;
      p.bind();
      gl.uniform2f(p.u("texelSize"), ...simTexel);
      gl.uniform1i(p.u("uDivergence"), divergence.attach(0));
      for (let i = 0; i < pressureIterations; i++) {
        gl.uniform1i(p.u("uPressure"), pressure.read.attach(1));
        blit(pressure.write);
        pressure.swap();
      }

      p = programs.gradient;
      p.bind();
      gl.uniform2f(p.u("texelSize"), ...simTexel);
      gl.uniform1i(p.u("uPressure"), pressure.read.attach(0));
      gl.uniform1i(p.u("uVelocity"), velocity.read.attach(1));
      blit(velocity.write);
      velocity.swap();

      p = programs.advection;
      p.bind();
      gl.uniform2f(p.u("texelSize"), ...simTexel);
      const v = velocity.read.attach(0);
      gl.uniform1i(p.u("uVelocity"), v);
      gl.uniform1i(p.u("uSource"), v);
      gl.uniform1f(p.u("dt"), dt);
      gl.uniform1f(p.u("dissipation"), CONFIG.velocityDissipation);
      blit(velocity.write);
      velocity.swap();

      gl.uniform1i(p.u("uVelocity"), velocity.read.attach(0));
      gl.uniform1i(p.u("uSource"), dye.read.attach(1));
      gl.uniform1f(p.u("dissipation"), CONFIG.densityDissipation);
      blit(dye.write);
      dye.swap();
    };

    const render = () => {
      const p = programs.display;
      p.bind();
      gl.uniform2f(p.u("texelSize"), dye.read.texel[0] * 3, dye.read.texel[1] * 3);
      gl.uniform1f(p.u("intensity"), CONFIG.intensity);
      gl.uniform1i(p.u("uTexture"), dye.read.attach(0));
      blit(null);
    };

    // Pointer → splats. The canvas ignores pointer events, so listen on window.
    const pointer = { x: 0, y: 0, dx: 0, dy: 0, moved: false, inside: false, lastMove: 0 };
    let activeTouch: number | null = null;
    const section = host.closest("section");
    const resetPointer = () => {
      activeTouch = null;
      pointer.dx = pointer.dy = 0;
      pointer.moved = pointer.inside = false;
    };
    const position = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      return { x, y, inside: x >= 0 && x <= 1 && y >= 0 && y <= 1, aspect: rect.width / rect.height };
    };
    const onDown = (e: PointerEvent) => {
      if (e.pointerType === "mouse" || !e.isPrimary || activeTouch !== null) return;
      if (!(e.target instanceof Element) || !section?.contains(e.target) || e.target.closest("a, button, input, select, textarea, [role='dialog']")) return;
      const point = position(e);
      if (!point?.inside) return;
      // Each contact starts a new trail; never connect it to the previous finger.
      resetPointer();
      activeTouch = e.pointerId;
      pointer.x = point.x;
      pointer.y = point.y;
      pointer.inside = pointer.moved = true;
      pointer.dy = 0.025;
      pointer.lastMove = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerId !== activeTouch) return;
      const point = position(e);
      if (!point) return;
      if (point.inside && pointer.inside) {
        // Bound each movement so dropped frames or browser scrolling can't create a blast.
        const clamp = (value: number) => Math.max(-0.06, Math.min(0.06, value));
        pointer.dx = clamp(pointer.dx + (point.x - pointer.x) * Math.min(point.aspect, 1));
        pointer.dy = clamp(pointer.dy + (point.y - pointer.y) / Math.max(point.aspect, 1));
        pointer.moved = true;
        pointer.lastMove = performance.now();
      }
      pointer.x = point.x;
      pointer.y = point.y;
      pointer.inside = point.inside;
    };
    const onEnd = (e: PointerEvent) => {
      if (e.pointerId === activeTouch) {
        activeTouch = null;
        pointer.inside = false;
      }
    };
    // Passive listeners preserve native scrolling, links, and browser gestures.
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onEnd, { passive: true });
    window.addEventListener("pointercancel", onEnd, { passive: true });
    window.addEventListener("blur", resetPointer);

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) resetPointer();
    });
    io.observe(canvas);

    let raf = 0;
    let last = performance.now();
    let ambientClock = 1.2;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 1 / 60);
      last = now;
      if (!visible || document.hidden) return;
      resize();

      if (pointer.moved) {
        pointer.moved = false;
        const speed = Math.hypot(pointer.dx, pointer.dy);
        splat(
          pointer.x,
          pointer.y,
          pointer.dx * CONFIG.splatForce,
          pointer.dy * CONFIG.splatForce,
          vapour(Math.min(0.07, 0.022 + speed * 0.9)),
        );
        pointer.dx = pointer.dy = 0;
      }

      // Faint wisps drifting up from the lower right when nobody is interacting.
      ambientClock -= dt;
      if (ambientClock <= 0 && now - pointer.lastMove > 2500) {
        ambientClock = CONFIG.ambientEvery * (0.7 + Math.random() * 0.6);
        const x = 0.55 + Math.random() * 0.4;
        splat(x, 0.02, (Math.random() - 0.5) * 120, 220 + Math.random() * 180, vapour(0.042));
      }

      step(dt);
      render();
    };
    raf = requestAnimationFrame(frame);

    // If the GPU drops the context (driver reset, too many contexts), take the
    // canvas out rather than leave a white sheet over the video.
    const onLost = () => {
      cancelAnimationFrame(raf);
      canvas.remove();
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      window.removeEventListener("blur", resetPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      canvas.remove();
    };
  }, []);

  return <div ref={ref} aria-hidden className={cn("pointer-events-none mix-blend-screen", className)} />;
}
