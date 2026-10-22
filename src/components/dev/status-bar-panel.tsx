"use client";

// TEMPORARY: controls and live readout for <StatusBarTest>. Options are saved
// for this tab and the page reloads, so the inline script applies them before
// first paint.

import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "vh-sbt";
const DETECT = [
  ["load", "Load"],
  ["off", "Off"],
  ["load-late", "1s after load"],
  ["scroll-late", "After scroll"],
] as const;
const PADS = [0, 20, 47, 54, 59, 62];

type Options = { detect: (typeof DETECT)[number][0]; band: boolean; pad: number };

// Timing (from load vs after scrolling) × the solid band above the header.
const PRESETS: [string, string, Options][] = [
  ["A", "Live now", { detect: "load", band: false, pad: 0 }],
  ["B", "Your last test", { detect: "scroll-late", band: true, pad: 0 }],
  ["C", "B without band", { detect: "scroll-late", band: false, pad: 0 }],
  ["D", "A with band", { detect: "load", band: true, pad: 0 }],
];

const enabled = () => document.documentElement.dataset.sbt !== undefined;

export function StatusBarPanel() {
  const on = useSyncExternalStore(() => () => {}, enabled, () => false);
  return on ? <Panel /> : null;
}

function readOptions(): Options {
  try {
    return { detect: "load", band: false, pad: 0, ...JSON.parse(sessionStorage.getItem(KEY) ?? "{}") };
  } catch {
    return { detect: "load", band: false, pad: 0 };
  }
}

function apply(next: Options) {
  sessionStorage.setItem(KEY, JSON.stringify(next));
  // Start the reloaded page at the top, like a fresh visit (see the inline script).
  sessionStorage.setItem(`${KEY}-top`, "1");
  location.reload();
}

function Panel() {
  const [o] = useState(readOptions);
  const [open, setOpen] = useState(true);
  const [stats, setStats] = useState<[string, string][]>([]);

  useEffect(() => {
    const root = document.documentElement;
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)";
    document.body.append(probe);

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = document.querySelector("#site > header")?.getBoundingClientRect();
      root.toggleAttribute("data-sbt-stuck", !!rect && rect.top <= 0.5 && scrollY > 100);
      const ps = getComputedStyle(probe);
      const vv = visualViewport;
      const r = (n: number | undefined) => (n === undefined ? "–" : String(Math.round(n * 10) / 10));
      setStats([
        ["grain z / detect", `${getComputedStyle(document.body, "::after").zIndex} / ${root.dataset.sbtDetect}`],
        ["env top / bottom", `${ps.paddingTop} / ${ps.paddingBottom}`],
        ["header top / h", `${r(rect?.top)} / ${r(rect?.height)}`],
        ["innerH / clientH", `${innerHeight} / ${root.clientHeight}`],
        ["vv h / offTop", `${r(vv?.height)} / ${r(vv?.offsetTop)}`],
        ["screen h", String(screen.height)],
        ["scrollY", r(scrollY)],
        ["iOS", navigator.userAgent.match(/OS (\d+[_\d]*)/)?.[1]?.replace(/_/g, ".") ?? "–"],
      ]);
    };
    const schedule = () => (frame ||= requestAnimationFrame(update));
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    visualViewport?.addEventListener("resize", schedule);
    visualViewport?.addEventListener("scroll", schedule);
    // The late-detect script flips an attribute without a scroll event.
    const watch = new MutationObserver(schedule);
    watch.observe(root, { attributeFilter: ["data-sbt-detect"] });
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      visualViewport?.removeEventListener("resize", schedule);
      visualViewport?.removeEventListener("scroll", schedule);
      watch.disconnect();
      probe.remove();
    };
  }, []);

  const btn = (active: boolean) =>
    `rounded border px-2 py-1 ${active ? "border-gold-300 bg-gold-400 text-ink-950" : "border-ink-500 text-cream"}`;
  const same = (p: Options) => p.detect === o.detect && p.band === o.band && p.pad === o.pad;

  return (
    <div className="fixed top-[28%] left-2 z-[500] w-64 rounded-lg border border-gold-400/50 bg-black/90 p-2.5 font-mono text-[10px] leading-snug text-cream shadow-2xl">
      <div className="flex items-center justify-between gap-2">
        <b className="text-gold-200">Status-bar test 2</b>
        <button type="button" className={btn(false)} onClick={() => setOpen((v) => !v)}>
          {open ? "–" : "+"}
        </button>
      </div>
      {open && (
        <>
          <div className="mt-2 grid grid-cols-2 gap-1">
            {PRESETS.map(([id, label, preset]) => (
              <button key={id} type="button" className={btn(same(preset))} onClick={() => apply(preset)}>
                {id} · {label}
              </button>
            ))}
          </div>
          <div className="mt-2 grid gap-1.5 border-t border-ink-500 pt-2">
            <div>
              Header detection
              <div className="mt-1 flex flex-wrap gap-1">
                {DETECT.map(([value, label]) => (
                  <button key={value} type="button" className={btn(o.detect === value)} onClick={() => apply({ ...o, detect: value })}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              Band above header
              <button type="button" className={btn(o.band)} onClick={() => apply({ ...o, band: !o.band })}>
                {o.band ? "ON" : "OFF"}
              </button>
            </div>
            <div>
              Stuck header top pad
              <div className="mt-1 flex flex-wrap gap-1">
                {PADS.map((p) => (
                  <button key={p} type="button" className={btn(o.pad === p)} onClick={() => apply({ ...o, pad: p })}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <dl className="mt-2 grid gap-0.5 border-t border-ink-500 pt-2">
            {stats.map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <dt className="text-mist">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </>
      )}
    </div>
  );
}
