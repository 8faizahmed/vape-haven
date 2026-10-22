// Generates looping background videos with Google Veo 3.1.
//
//   npm run videos                         generate any video that doesn't exist yet
//   npm run videos -- hero-boutique        only the named video(s)
//   npm run videos -- --force              re-encode from the saved Veo originals
//   npm run videos -- --regenerate         request brand-new clips from Veo (costs credits)
//
// Image-to-video clips start from a still in assets/originals/ (run `npm run images`
// first). Each clip is turned into a seamless forward-then-reverse loop, audio is
// stripped, and desktop/mobile MP4s plus a poster frame are written to public/videos/.

import { execFile } from "node:child_process";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";
import ffmpegPath from "ffmpeg-static";
import sharp from "sharp";

const run = promisify(execFile);
const API = "https://generativelanguage.googleapis.com/v1beta";
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.VEO_MODEL ?? "veo-3.1-generate-preview";
const ROOT = path.resolve(import.meta.dirname, "..");

const NEGATIVE =
  "people, person, hands, faces, text, letters, logos, watermark, morphing, warping, melting, distortion, flicker, camera shake, cartoon";

const videos = [
  {
    name: "hero-boutique",
    image: "assets/originals/scenes/hero-boutique.jpg",
    prompt:
      "Slow, steady, cinematic dolly push-in through an empty, upscale black and gold boutique toward the illuminated display shelves. Warm LED shelf lighting glows softly; gentle reflections glide across the polished dark floor and the black marble counter. The architecture and products stay perfectly rigid and stable. Smooth gimbal motion, luxurious pacing.",
    widths: { desktop: 1280, mobile: 854 },
  },
  {
    name: "vapor",
    prompt:
      "Slow-motion macro footage of soft white vapour clouds billowing and curling against a pure black background, backlit by warm golden light so the edges glow amber and gold. Elegant, silky, continuous flowing motion. Most of the frame is black negative space. No objects.",
    widths: { desktop: 1280, mobile: 854 },
    posterAt: 4,
  },
  {
    name: "spotlight-device",
    image: "assets/originals/scenes/spotlight-device.jpg",
    prompt:
      "The camera slowly and smoothly arcs a few degrees around the gold device standing on the black marble plinth. Highlights glide slowly across the brushed metal, delicate wisps of vapour drift and curl in the darkness behind it. The device itself stays perfectly still, rigid and undistorted. Premium product commercial, very slow motion.",
    widths: { desktop: 1280, mobile: 854 },
  },
];

if (!API_KEY) {
  console.error("Missing GEMINI_API_KEY. Add it to .env.local and run via `npm run videos`.");
  process.exit(1);
}

const args = process.argv.slice(2);
const force = args.includes("--force");
const only = args.filter((a) => !a.startsWith("--"));
const exists = (p) => access(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(url, init) {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", "x-goog-api-key": API_KEY, ...init?.headers },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body?.error?.message ?? `${res.status} ${res.statusText}`);
  return body;
}

async function generate(video) {
  const instance = { prompt: video.prompt };
  if (video.image) {
    // Veo expects a 16:9 frame; keep the upload small.
    const jpeg = await sharp(path.join(ROOT, video.image))
      .resize(1920, 1080, { fit: "cover" })
      .jpeg({ quality: 90 })
      .toBuffer();
    instance.image = { bytesBase64Encoded: jpeg.toString("base64"), mimeType: "image/jpeg" };
  }

  const op = await api(`${API}/models/${MODEL}:predictLongRunning`, {
    method: "POST",
    body: JSON.stringify({
      instances: [instance],
      // 1080p currently fails on the preview model; 720p is plenty for dimmed backgrounds.
      parameters: { aspectRatio: "16:9", resolution: "720p", durationSeconds: 8, negativePrompt: NEGATIVE },
    }),
  });

  for (let i = 0; i < 90; i++) {
    await sleep(10_000);
    const status = await api(`${API}/${op.name}`);
    if (!status.done) continue;
    if (status.error) throw new Error(status.error.message);
    const sample = status.response?.generateVideoResponse?.generatedSamples?.[0];
    const uri = sample?.video?.uri;
    if (!uri) {
      const reason = status.response?.generateVideoResponse?.raiMediaFilteredReasons?.join("; ");
      throw new Error(reason ?? `No video returned: ${JSON.stringify(status.response).slice(0, 300)}`);
    }
    const file = await fetch(uri, { headers: { "x-goog-api-key": API_KEY }, redirect: "follow" });
    if (!file.ok) throw new Error(`Download failed: ${file.status}`);
    return Buffer.from(await file.arrayBuffer());
  }
  throw new Error("Timed out waiting for Veo");
}

async function encode(input, output, width) {
  await run(ffmpegPath, [
    "-y",
    "-i", input,
    "-filter_complex",
    `[0:v]scale=${width}:-2:flags=lanczos,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,format=yuv420p[v]`,
    "-map", "[v]",
    "-an",
    "-c:v", "libx264",
    "-preset", "slow",
    "-crf", width > 1000 ? "25" : "27",
    "-movflags", "+faststart",
    output,
  ]);
}

async function processVideo(video) {
  const raw = path.join(ROOT, "assets/originals/videos", `${video.name}.mp4`);
  const outDir = path.join(ROOT, "public/videos");
  const desktop = path.join(outDir, `${video.name}.mp4`);

  if (!force && (await exists(desktop))) {
    console.log(`• skip   ${video.name} (exists)`);
    return;
  }

  await mkdir(path.dirname(raw), { recursive: true });
  await mkdir(outDir, { recursive: true });

  if (args.includes("--regenerate") || !(await exists(raw))) {
    const started = Date.now();
    console.log(`… veo    ${video.name}`);
    let buffer;
    for (let attempt = 1; !buffer; attempt++) {
      try {
        buffer = await generate(video);
      } catch (err) {
        if (attempt >= 3) throw err;
        console.log(`  retry  ${video.name} (${err.message})`);
        await sleep(30_000);
      }
    }
    await writeFile(raw, buffer);
    console.log(`✓ veo    ${video.name} (${((Date.now() - started) / 1000).toFixed(0)}s)`);
  }

  await encode(raw, desktop, video.widths.desktop);
  await encode(raw, path.join(outDir, `${video.name}-mobile.mp4`), video.widths.mobile);

  const frame = path.join(ROOT, "assets/originals/videos", `${video.name}-poster.png`);
  await run(ffmpegPath, ["-y", "-ss", String(video.posterAt ?? 0), "-i", raw, "-frames:v", "1", frame]);
  await sharp(await readFile(frame))
    .resize({ width: video.widths.desktop })
    .webp({ quality: 80 })
    .toFile(path.join(outDir, `${video.name}-poster.webp`));
  console.log(`✓ encode ${video.name}`);
}

const queue = videos.filter((v) => only.length === 0 || only.includes(v.name));
console.log(`Generating ${queue.length} video(s) with ${MODEL}…`);
// Sequential: parallel jobs fail more often on the preview model.
const failures = [];
for (const video of queue) {
  try {
    await processVideo(video);
  } catch (err) {
    failures.push(err);
    console.error(`✗ ${video.name}: ${err.message}`);
  }
}
process.exit(failures.length ? 1 : 0);
