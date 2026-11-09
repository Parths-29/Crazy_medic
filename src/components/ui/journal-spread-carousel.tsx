"use client";

import * as React from "react";

export type JournalPrint = {
  src: string;
  alt?: string;
  x: number;
  y: number;
  w: number;
  rotate?: number;
  caption?: string;
  tape?: boolean;
};

export type JournalNote = {
  x: number;
  y: number;
  w: number;
  title?: string;
  body?: string;
  rotate?: number;
  style?: "card" | "ink";
};

export type JournalSpread = {
  id?: string;
  label?: string;
  image?: string;
  alt?: string;
  imagePosition?: string;
  paper?: string;
  prints?: JournalPrint[];
  notes?: JournalNote[];
};

export type JournalAction = "more" | "share" | "delete" | "add";

export interface JournalSpreadCarouselProps {
  spreads: JournalSpread[];
  title?: string;
  meta?: string;
  height?: string;
  initialIndex?: number;
  autoPlay?: number | false;
  onIndexChange?: (index: number) => void;
  onAction?: (action: JournalAction, index: number) => void;
  className?: string;
}

const OPEN = 5;
const SIDE = 80;
const FOLD = 174;

export function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

export function spreadAspect(stageW: number, stageH: number): number {
  return stageW < 640 && stageH > stageW ? 0.86 : 1.25;
}

export function spreadWidth(stageW: number, stageH: number): number {
  if (stageW <= 0 || stageH <= 0) return 0;
  const narrow = stageW < 640;
  return Math.round(Math.min(stageW * (narrow ? 0.88 : 0.58), stageH * 0.9 * spreadAspect(stageW, stageH), 980));
}

export function poseFor(p: number, w: number) {
  const d = Math.abs(p);
  const a = d < 1 ? d : 1;
  const s = p < 0 ? -1 : 1;
  const out = d > 1 ? d - 1 : 0;
  const x = s * (a * (w * 0.5 + w * 0.03) + out * w * 0.055);
  const z = -(a * w * 0.42 + out * w * 0.06);
  const fold = a * a;
  const left = p > 0 ? OPEN + (FOLD - OPEN) * fold : OPEN + (SIDE - OPEN) * a;
  const right = p < 0 ? -(OPEN + (FOLD - OPEN) * fold) : -(OPEN + (SIDE - OPEN) * a);
  const shade = (deg: number) => clamp((Math.abs(deg) - OPEN) / 95, 0, 0.62);
  return {
    x,
    z,
    left,
    right,
    shadeLeft: shade(left),
    shadeRight: shade(right),
    opacity: clamp(7.2 - d, 0, 1),
    hidden: d > 7.2,
  };
}

export function settle(pos: number, velocity: number, n: number): number {
  return clamp(Math.round(pos + clamp(velocity * 0.18, -1.5, 1.5)), 0, Math.max(0, n - 1));
}

export function durationFor(steps: number): number {
  return steps <= 0 ? 0 : Math.round(560 * Math.sqrt(Math.min(steps, 12)));
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

const CSS = `
.jsc-root{position:relative;width:100%;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden;
background:radial-gradient(120% 80% at 50% 35%,#0F2B3C 0%,#091D29 65%,#05121A 100%);color:#f4f2ee;
font-family:ui-rounded,'SF Pro Rounded',system-ui,-apple-system,sans-serif;outline:none;user-select:none;-webkit-user-select:none;container-type:inline-size;border-radius:1.25rem;}
.jsc-top{position:relative;padding:max(14px,1.6cqi) max(14px,1.8cqi) 0;display:flex;justify-content:space-between;align-items:flex-start}
.jsc-group{display:flex;gap:max(8px,.8cqi)}
.jsc-chip{display:grid;place-items:center;width:clamp(34px,3.4cqi,44px);height:clamp(34px,3.4cqi,44px);border-radius:50%;border:0;padding:0;cursor:pointer;
color:#f4f2ee;background:rgba(255,255,255,.08);box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);transition:all .2s}
.jsc-chip:hover{background:rgba(255,255,255,.2)}
.jsc-chip[aria-pressed=true]{background:rgba(62,207,180,.25);box-shadow:inset 0 0 0 1.5px #3ECFB4}
.jsc-chip svg{width:46%;height:46%}
.jsc-head{position:absolute;left:50%;top:max(24px,3cqi);transform:translateX(-50%);text-align:center;white-space:nowrap;pointer-events:none}
.jsc-title{margin:0;font-weight:700;font-size:clamp(18px,2.2cqi,30px);letter-spacing:-.01em;line-height:1.1;color:#FFFFFF}
.jsc-meta{display:inline-flex;align-items:center;gap:.45em;margin-top:.4em;font-size:clamp(11px,1cqi,13px);font-weight:600;opacity:.85;color:#3ECFB4}
.jsc-meta svg{width:1.15em;height:1.15em}
.jsc-stage{position:relative;margin-top:clamp(48px,5cqi,80px);touch-action:pan-y;cursor:grab}
.jsc-stage[data-drag]{cursor:grabbing}
.jsc-floor{position:absolute;left:50%;top:50%;width:calc(var(--jsc-w) * 1.55);height:calc(var(--jsc-h) * .62);transform:translate(-50%,calc(var(--jsc-h) * .2));
background:#050C12;opacity:.7;filter:blur(calc(var(--jsc-w) * .03));border-radius:calc(var(--jsc-w) * .04);pointer-events:none}
.jsc-view{position:absolute;inset:0;perspective:calc(var(--jsc-w) * 2.3);perspective-origin:50% 46%}
.jsc-scene{position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d}
.jsc-item{position:absolute;left:0;top:0;transform-style:preserve-3d;visibility:hidden}
.jsc-page{position:absolute;top:calc(var(--jsc-h) * -.5);width:calc(var(--jsc-w) * .5);height:var(--jsc-h);overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;
background:#FAF9F6;box-shadow:0 1px 0 rgba(255,255,255,.35) inset}
.jsc-page[data-side=l]{left:calc(var(--jsc-w) * -.5);transform-origin:100% 50%;border-radius:calc(var(--jsc-w) * .034) 0 0 calc(var(--jsc-w) * .034)}
.jsc-page[data-side=r]{left:0;transform-origin:0 50%;border-radius:0 calc(var(--jsc-w) * .034) calc(var(--jsc-w) * .034) 0}
.jsc-sheet{position:absolute;top:0;width:var(--jsc-w);height:var(--jsc-h);pointer-events:none}
.jsc-page[data-side=l]>.jsc-sheet{left:0}
.jsc-page[data-side=r]>.jsc-sheet{left:calc(var(--jsc-w) * -.5)}
.jsc-bg{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block}
.jsc-gutter{position:absolute;inset:0}
.jsc-page[data-side=l] .jsc-gutter{background:linear-gradient(90deg,rgba(255,255,255,0) 82%,rgba(20,18,30,.08) 93%,rgba(20,18,30,.26))}
.jsc-page[data-side=r] .jsc-gutter{background:linear-gradient(270deg,rgba(255,255,255,0) 82%,rgba(20,18,30,.08) 93%,rgba(20,18,30,.26))}
.jsc-shade{position:absolute;inset:0;background:#0F2B3C;opacity:var(--jsc-s,0)}
.jsc-print{position:absolute;margin:0;background:#ffffff;padding:3.5% 3.5% 0;box-shadow:0 .4em 1em rgba(15,43,60,.3),0 .1em .2em rgba(15,43,60,.15);font-size:calc(var(--jsc-w) * .01)}
.jsc-print img{display:block;width:100%;height:auto;max-width:none;aspect-ratio:4/5;object-fit:cover}
.jsc-print figcaption{font-weight:600;color:#0F2B3C;text-align:center;font-size:calc(var(--jsc-w) * .024);line-height:1;padding:.32em 0 .4em}
.jsc-note{position:absolute;font-weight:600;line-height:1.05;color:#0F2B3C}
.jsc-note[data-style=card]{background:#FFF7ED;padding:.65em .8em;box-shadow:0 .3em .8em rgba(0,0,0,.15);border-radius:4px;border-left:3px solid #E8443A}
.jsc-note[data-style=ink]{color:#E8443A;text-shadow:0 1px 2px rgba(255,255,255,.9)}
.jsc-note b{display:block;font-weight:700;font-size:calc(var(--jsc-w) * .036);margin-bottom:.1em}
.jsc-note span{display:block;font-size:calc(var(--jsc-w) * .025);color:#5A7184}
.jsc-bar{display:flex;justify-content:center;gap:clamp(12px,1.4cqi,20px);padding:clamp(14px,1.8cqi,24px) 0 clamp(16px,2cqi,30px);position:relative;z-index:2}
.jsc-btn{display:grid;place-items:center;width:clamp(38px,3.4cqi,48px);height:clamp(38px,3.4cqi,48px);border-radius:50%;border:0;padding:0;cursor:pointer;color:#0F2B3C;background:#FFFFFF;
box-shadow:0 4px 14px rgba(0,0,0,.25);transition:transform .2s cubic-bezier(.2,.7,.2,1)}
.jsc-btn:hover{transform:translateY(-2px);background:#3ECFB4;color:#FFFFFF}
.jsc-btn:active{transform:scale(.94)}
.jsc-btn svg{width:44%;height:44%}
.jsc-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}
@media (prefers-reduced-motion:reduce){.jsc-btn,.jsc-chip{transition:none}}
`;

const ICON = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round", viewBox: "0 0 24 24", "aria-hidden": true } as const;

function Icon({ name }: { name: string }) {
  switch (name) {
    case "book":
      return (
        <svg {...ICON}>
          <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
        </svg>
      );
    case "lock":
      return (
        <svg {...ICON}>
          <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
      );
    case "prev":
      return (
        <svg {...ICON}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case "next":
      return (
        <svg {...ICON}>
          <path d="m9 18 6-6-6-6" />
        </svg>
      );
    default:
      return (
        <svg {...ICON}>
          <path d="M12 5v14M5 12h14" />
        </svg>
      );
  }
}

function Sheet({ spread }: { spread: JournalSpread }) {
  return (
    <div className="jsc-sheet" style={{ background: spread.paper || "#FAF9F6" }}>
      {spread.image ? (
        <img className="jsc-bg" src={spread.image} alt="" draggable={false} decoding="async" style={{ maxWidth: "none", objectPosition: spread.imagePosition }} />
      ) : null}
      {spread.prints?.map((p, k) => (
        <figure
          key={k}
          className="jsc-print"
          style={{ left: p.x + "%", top: p.y + "%", width: p.w + "%", transform: "rotate(" + (p.rotate ?? 0) + "deg)" }}
        >
          <img src={p.src} alt="" draggable={false} decoding="async" style={{ maxWidth: "none" }} />
          {p.caption ? <figcaption>{p.caption}</figcaption> : null}
        </figure>
      ))}
      {spread.notes?.map((t, k) => (
        <div
          key={k}
          className="jsc-note"
          data-style={t.style ?? "card"}
          style={{ left: t.x + "%", top: t.y + "%", width: t.w + "%", transform: "rotate(" + (t.rotate ?? 0) + "deg)" }}
        >
          {t.title ? <b>{t.title}</b> : null}
          {t.body ? <span>{t.body}</span> : null}
        </div>
      ))}
    </div>
  );
}

export default function JournalSpreadCarousel({
  spreads,
  title = "Study Notes Preview",
  meta,
  height = "420px",
  initialIndex = 0,
  autoPlay = 3200,
  onIndexChange,
  className,
}: JournalSpreadCarouselProps) {
  const n = spreads.length;
  const start = clamp(Math.round(initialIndex), 0, Math.max(0, n - 1));
  const [index, setIndex] = React.useState(start);
  const [reduced, setReduced] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const stageRef = React.useRef<HTMLDivElement | null>(null);
  const items = React.useRef<(HTMLDivElement | null)[]>([]);
  const pages = React.useRef<(HTMLDivElement | null)[]>([]);
  const width = React.useRef(0);
  const pos = React.useRef(start);
  const target = React.useRef(start);
  const tween = React.useRef<null | { from: number; to: number; t0: number; dur: number; ease: (t: number) => number }>(null);
  const raf = React.useRef(0);
  const drag = React.useRef<null | { id: number; x: number; from: number; lastX: number; lastT: number; v: number; moved: boolean }>(null);
  const touched = React.useRef(false);
  const reducedRef = React.useRef(false);
  const onIndexRef = React.useRef(onIndexChange);
  onIndexRef.current = onIndexChange;

  const paint = React.useCallback(() => {
    const w = width.current;
    if (!w) return;
    for (let i = 0; i < items.current.length; i++) {
      const el = items.current[i];
      if (!el) continue;
      const q = poseFor(i - pos.current, w);
      if (q.hidden) {
        el.style.visibility = "hidden";
        continue;
      }
      el.style.visibility = "visible";
      el.style.opacity = String(q.opacity);
      el.style.transform = "translate3d(" + q.x.toFixed(2) + "px,0," + q.z.toFixed(2) + "px)";
      const l = pages.current[i * 2];
      const r = pages.current[i * 2 + 1];
      if (l) {
        l.style.transform = "rotateY(" + q.left.toFixed(2) + "deg)";
        l.style.setProperty("--jsc-s", q.shadeLeft.toFixed(3));
      }
      if (r) {
        r.style.transform = "rotateY(" + q.right.toFixed(2) + "deg)";
        r.style.setProperty("--jsc-s", q.shadeRight.toFixed(3));
      }
    }
  }, []);

  const frame = React.useCallback(
    (t: number) => {
      raf.current = 0;
      const tw = tween.current;
      if (tw) {
        const k = tw.dur > 0 ? clamp((t - tw.t0) / tw.dur, 0, 1) : 1;
        pos.current = tw.from + (tw.to - tw.from) * tw.ease(k);
        if (k >= 1) tween.current = null;
      }
      paint();
      if (tween.current) raf.current = requestAnimationFrame(frame);
    },
    [paint]
  );

  const kick = React.useCallback(() => {
    if (!raf.current) raf.current = requestAnimationFrame(frame);
  }, [frame]);

  const go = React.useCallback(
    (to: number, ease = easeInOut) => {
      const next = clamp(to, 0, Math.max(0, n - 1));
      if (next !== target.current) {
        target.current = next;
        setIndex(next);
        onIndexRef.current?.(next);
      }
      const dur = reducedRef.current ? 0 : durationFor(Math.abs(next - pos.current));
      tween.current = { from: pos.current, to: next, t0: performance.now(), dur, ease };
      kick();
    },
    [n, kick]
  );

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => {
      reducedRef.current = mq.matches;
      setReduced(mq.matches);
    };
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  React.useEffect(() => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width: sw, height: sh } = entry.contentRect;
      const w = spreadWidth(sw, sh);
      width.current = w;
      root.style.setProperty("--jsc-w", w + "px");
      root.style.setProperty("--jsc-h", Math.round(w / spreadAspect(sw, sh)) + "px");
      paint();
    });
    ro.observe(stage);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf.current);
      raf.current = 0;
    };
  }, [paint]);

  React.useEffect(() => {
    if (pos.current > n - 1) go(n - 1);
    else paint();
  }, [n, go, paint]);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!autoPlay || reduced || n < 2 || !root) return;
    let visible = true;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(root);
    const id = window.setInterval(() => {
      if (touched.current || !visible || document.hidden || drag.current) return;
      go(target.current >= n - 1 ? 0 : target.current + 1);
    }, autoPlay);
    return () => {
      window.clearInterval(id);
      io.disconnect();
    };
  }, [autoPlay, reduced, n, go]);

  const stop = () => {
    touched.current = true;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || n < 1) return;
    stop();
    tween.current = null;
    drag.current = { id: e.pointerId, x: e.clientX, from: pos.current, lastX: e.clientX, lastT: e.timeStamp, v: 0, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    const w = width.current;
    if (!d || d.id !== e.pointerId || !w) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      setDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    }
    if (!d.moved) return;
    const dt = Math.max(1, e.timeStamp - d.lastT);
    d.v = d.v * 0.6 + (-(e.clientX - d.lastX) / (w * 0.42) / (dt / 1000)) * 0.4;
    d.lastX = e.clientX;
    d.lastT = e.timeStamp;
    pos.current = clamp(d.from - dx / (w * 0.42), -0.3, n - 0.7);
    kick();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (d.moved) {
      go(settle(pos.current, d.v, n), easeOut);
      return;
    }
    const hit = (e.target as HTMLElement).closest("[data-i]");
    const i = hit ? Number(hit.getAttribute("data-i")) : target.current;
    go(i);
  };

  const current = spreads[index];
  const pagesLabel = meta ?? `${index + 1} of ${n} Spreads`;

  return (
    <div
      ref={rootRef}
      className={"jsc-root" + (className ? " " + className : "")}
      style={{ height }}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={title}
    >
      <style>{CSS}</style>
      <div className="jsc-top">
        <div className="jsc-group">
          <button type="button" className="jsc-chip" aria-pressed="true" aria-label="Spread view">
            <Icon name="book" />
          </button>
        </div>
        <div className="jsc-head">
          <h2 className="jsc-title">{title}</h2>
          <div className="jsc-meta">
            <Icon name="lock" />
            {pagesLabel}
          </div>
        </div>
        <div className="jsc-group">
          <div className="px-2 py-1 text-xs font-medium text-emerald-400 bg-emerald-950/60 rounded-full border border-emerald-500/30">
            Watermarked Preview
          </div>
        </div>
      </div>

      <div
        ref={stageRef}
        className="jsc-stage"
        data-drag={dragging ? "" : undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div className="jsc-floor" aria-hidden="true" />
        <div className="jsc-view">
          <div className="jsc-scene">
            {spreads.map((s, i) => (
              <div
                key={s.id ?? i}
                ref={(el) => {
                  items.current[i] = el;
                }}
                className="jsc-item"
                data-i={i}
                role="group"
                aria-roledescription="spread"
                aria-label={(s.label ?? "Spread " + (i + 1)) + ", " + (i + 1) + " of " + n}
                aria-hidden={i !== index}
              >
                {s.alt ? <span className="jsc-sr">{s.alt}</span> : null}
                {(["l", "r"] as const).map((side, k) => (
                  <div
                    key={side}
                    ref={(el) => {
                      pages.current[i * 2 + k] = el;
                    }}
                    className="jsc-page"
                    data-side={side}
                  >
                    <Sheet spread={s} />
                    <div className="jsc-gutter" />
                    <div className="jsc-shade" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="jsc-bar">
        <button
          type="button"
          className="jsc-btn"
          aria-label="Previous spread"
          onClick={() => {
            stop();
            go(index - 1);
          }}
          disabled={index <= 0}
        >
          <Icon name="prev" />
        </button>
        <button
          type="button"
          className="jsc-btn"
          aria-label="Next spread"
          onClick={() => {
            stop();
            go(index + 1);
          }}
          disabled={index >= n - 1}
        >
          <Icon name="next" />
        </button>
      </div>

      <p className="jsc-sr" aria-live="polite">
        {current ? (current.label ?? "Spread " + (index + 1)) + ", " + (index + 1) + " of " + n : ""}
      </p>
    </div>
  );
}

