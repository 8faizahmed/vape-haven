"use client";

// TEMPORARY on-device test panel for the iOS Safari status-bar strip. Open any
// page with ?viewport-debug (?viewport-debug=off to hide). Shows what Safari
// reports while scrolling and toggles the candidate fixes live. Remove once the
// strip is solved.

import { useEffect, useState, useSyncExternalStore } from "react";

const KEY = "vh-viewport-debug";
const PADS = ["0", "env", "47", "54", "59", "62"] as const;

type Toggles = { detect: boolean; cover: boolean; pad: (typeof PADS)[number]; band: boolean };
const DEFAULTS: Toggles = { detect: false, cover: true, pad: "0", band: false };

function enabled() {
  const param = new URLSearchParams(location.search).get("viewport-debug");
  if (param === "off") sessionStorage.removeItem(KEY);
  else if (param !== null) sessionStorage.setItem(KEY, "1");
  return sessionStorage.getItem(KEY) === "1";
}

export function ViewportDebug() {
  const on = useSyncExternalStore(() => () => {}, enabled, () => false);
  return on ? <Panel /> : null;
}

function readToggles(): Toggles {
  try {
    return { ...DEFAULTS, ...JSON.parse(sessionStorage.getItem(`${KEY}-toggles`) ?? "{}") };
  } catch {
    return DEFAULTS;
  }
}

function Panel() {
  const [t, setT] = useState<Toggles>(readToggles);
  const [open, setOpen] = useState(true);
  const [stats, setStats] = useState<[string, string][]>([]);

  // Apply the toggles.
  useEffect(() => {
    sessionStorage.setItem(`${KEY}-toggles`, JSON.stringify(t));
    const root = document.documentElement;
    root.toggleAttribute("data-dbg-detect", t.detect);
    root.style.setProperty("--dbg-pad", t.pad === "env" ? "env(safe-area-inset-top)" : `${t.pad}px`);
    const meta = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
    if (meta) {
      const base = meta.content.replace(/,\s*viewport-fit=\w+/, "");
      meta.content = t.cover ? `${base}, viewport-fit=cover` : base;
    }
  }, [t]);

  // Live readout, stuck-header padding and the script-positioned band.
  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)";
    const band = document.createElement("div");
    band.style.cssText = "position:absolute;left:0;right:0;z-index:39;pointer-events:none;background:#0a0a0a;display:none";
    document.body.append(probe, band);

    let frame = 0;
    const update = () => {
      frame = 0;
      const header = document.querySelector("header");
      const rect = header?.getBoundingClientRect();
      const stuck = !!rect && rect.top <= 0.5 && scrollY > 100;
      document.documentElement.toggleAttribute("data-dbg-stuck", stuck && t.pad !== "0");

      const showBand = t.band && scrollY > 150;
      band.style.display = showBand ? "block" : "none";
      if (showBand) {
        band.style.top = `${scrollY - 400}px`;
        band.style.height = "428px";
      }

      const ps = getComputedStyle(probe);
      const vv = visualViewport;
      const r = (n: number | undefined) => (n === undefined ? "–" : String(Math.round(n * 10) / 10));
      setStats([
        ["env top / bottom", `${ps.paddingTop} / ${ps.paddingBottom}`],
        ["innerH / clientH", `${innerHeight} / ${document.documentElement.clientHeight}`],
        ["vv h / offTop", `${r(vv?.height)} / ${r(vv?.offsetTop)}`],
        ["screen h / avail", `${screen.height} / ${screen.availHeight}`],
        ["header top / h", `${r(rect?.top)} / ${r(rect?.height)}`],
        ["scrollY", r(scrollY)],
        ["standalone", matchMedia("(display-mode: standalone)").matches ? "yes" : "no"],
        ["iOS", navigator.userAgent.match(/OS (\d+[_\d]*)/)?.[1]?.replace(/_/g, ".") ?? "–"],
      ]);
    };
    const schedule = () => (frame ||= requestAnimationFrame(update));
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    visualViewport?.addEventListener("resize", schedule);
    visualViewport?.addEventListener("scroll", schedule);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      visualViewport?.removeEventListener("resize", schedule);
      visualViewport?.removeEventListener("scroll", schedule);
      probe.remove();
      band.remove();
    };
  }, [t]);

  const set = (patch: Partial<Toggles>) => setT((v) => ({ ...v, ...patch }));
  const btn = (active: boolean) =>
    `rounded border px-2 py-1 ${active ? "border-gold-300 bg-gold-400 text-ink-950" : "border-ink-500 text-cream"}`;

  return (
    <>
      <style>{`
        html[data-dbg-detect] body::after { z-index: 30 !important; }
        html[data-dbg-stuck] .site-header {
          padding-top: var(--dbg-pad) !important;
          margin-bottom: calc(-1 * var(--dbg-pad)) !important;
        }
      `}</style>
      <div className="fixed top-[28%] left-2 z-[500] w-60 rounded-lg border border-gold-400/50 bg-black/90 p-2.5 font-mono text-[10px] leading-snug text-cream shadow-2xl">
        <div className="flex items-center justify-between">
          <b className="text-gold-200">Status-bar test</b>
          <button type="button" className={btn(false)} onClick={() => setOpen((o) => !o)}>
            {open ? "–" : "+"}
          </button>
        </div>
        {open && (
          <>
            <div className="mt-2 grid gap-1.5">
              <Row label="1 Safari sees header">
                <button type="button" className={btn(t.detect)} onClick={() => set({ detect: !t.detect })}>
                  {t.detect ? "ON" : "OFF"}
                </button>
              </Row>
              <Row label="2 viewport-fit=cover">
                <button type="button" className={btn(t.cover)} onClick={() => set({ cover: !t.cover })}>
                  {t.cover ? "ON" : "OFF"}
                </button>
              </Row>
              <div>
                3 Stuck header top pad
                <div className="mt-1 flex flex-wrap gap-1">
                  {PADS.map((p) => (
                    <button key={p} type="button" className={btn(t.pad === p)} onClick={() => set({ pad: p })}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <Row label="4 Script band">
                <button type="button" className={btn(t.band)} onClick={() => set({ band: !t.band })}>
                  {t.band ? "ON" : "OFF"}
                </button>
              </Row>
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
    </>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      {label}
      {children}
    </div>
  );
}
