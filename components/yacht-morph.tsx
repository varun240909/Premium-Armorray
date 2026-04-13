"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState, useCallback } from "react";

const FRAME_START = 2000;
const FRAME_END = 2383;
const TOTAL_FRAMES = FRAME_END - FRAME_START + 1;
const PRIMARY_OVERLAY_END_FRAME = 2191;
const SECONDARY_FRAME_START = PRIMARY_OVERLAY_END_FRAME + 1;
const PRIMARY_SCROLL_SHARE = 0.56;
const PRIMARY_FRAME_COUNT = PRIMARY_OVERLAY_END_FRAME - FRAME_START + 1;
const SECONDARY_FRAME_COUNT = FRAME_END - SECONDARY_FRAME_START + 1;

function frameProgress(frame: number) {
  return (frame - FRAME_START) / (TOTAL_FRAMES - 1);
}

function progressToFrame(progress: number) {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  if (clampedProgress >= 1) {
    return FRAME_END;
  }

  if (progress <= PRIMARY_SCROLL_SHARE) {
    const normalizedPrimary = Math.min(
      Math.max(clampedProgress / PRIMARY_SCROLL_SHARE, 0),
      0.999999
    );
    return FRAME_START + Math.floor(normalizedPrimary * PRIMARY_FRAME_COUNT);
  }

  const normalizedSecondary = Math.min(
    Math.max((clampedProgress - PRIMARY_SCROLL_SHARE) / (1 - PRIMARY_SCROLL_SHARE), 0),
    0.999999
  );
  return SECONDARY_FRAME_START + Math.floor(normalizedSecondary * SECONDARY_FRAME_COUNT);
}

function framePath(index: number) {
  const frameNumber = FRAME_START + index;
  const extension = frameNumber <= PRIMARY_OVERLAY_END_FRAME ? "jpg" : "png";
  return `/sequence-2/sequence-${frameNumber}.${extension}`;
}

interface TextOverlay {
  label?: string;
  heading: string;
  sub?: string;
  position: "left" | "right";
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
}

const TEXT_OVERLAYS: TextOverlay[] = [
  {
    label: "HYBRID ARCHITECTURE",
    heading: "Cloud + Local.\nComplete Control.",
    position: "left",
    inStart: 0.0,
    inEnd: frameProgress(2010),
    outStart: frameProgress(2180),
    outEnd: frameProgress(PRIMARY_OVERLAY_END_FRAME),
  },
  {
    heading: "Enterprise-Grade\nDiagnostics.",
    sub: "View on any device, anywhere, instantly.",
    position: "right",
    inStart: frameProgress(2192),
    inEnd: frameProgress(2240),
    outStart: frameProgress(2285),
    outEnd: frameProgress(2315),
  },
  {
    label: "VENDOR NEUTRAL",
    heading: "Universal Data.\nVendor Freedom.",
    sub: "Seamless integration with any DICOM source.",
    position: "left",
    inStart: frameProgress(2310),
    inEnd: frameProgress(2340),
    outStart: frameProgress(2360),
    outEnd: frameProgress(FRAME_END),
  },
];

const STATS_LEFT = [
  { label: "Concurrent Users", value: "Unlimited" },
  { label: "Data Integrity", value: "99.9% SLA" },
  { label: "Global Deploy", value: "105+" },
];
const STATS_RIGHT = [
  { label: "Image Processing", value: "Real-time" },
  { label: "Critical Alerts", value: "24/7 SMS/Email" },
  { label: "Support", value: "24/7 Free" },
];

function AnimatedStatValue({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const numericTarget = Number(match[1]);
    const suffix = match[2];
    const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
    const duration = 1400;
    const start = performance.now();

    let raf = 0;
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = numericTarget * eased;
      const formatted =
        decimals > 0 ? current.toFixed(decimals) : Math.round(current).toString();
      setDisplayValue(`${formatted}${suffix}`);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <motion.span
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {displayValue}
    </motion.span>
  );
}

function getOpacity(progress: number, overlay: TextOverlay): number {
  const fadeIn = Math.min(
    Math.max((progress - overlay.inStart) / (overlay.inEnd - overlay.inStart || 0.01), 0),
    1
  );
  const fadeOut = Math.min(
    Math.max((overlay.outEnd - progress) / (overlay.outEnd - overlay.outStart || 0.01), 0),
    1
  );
  return Math.min(fadeIn, fadeOut);
}

export default function YachtMorph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const lastReadyFrameRef = useRef(FRAME_START);
  const loadedCountRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const [loadProgress, setLoadProgress] = useState(0);
  const currentFrame = progressToFrame(progress);
  const currentFrameProgress = frameProgress(currentFrame);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let loaded = 0;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = framePath(i);
      img.onload = img.onerror = () => {
        loaded++;
        loadedCountRef.current = loaded;
        if (loaded % 10 === 0 || loaded === TOTAL_FRAMES) {
          setLoadProgress(loaded / TOTAL_FRAMES);
        }
      };
      imgs.push(img);
    }
    framesRef.current = imgs;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollH = containerRef.current.scrollHeight - window.innerHeight;
      setProgress(Math.min(Math.max(-rect.top / scrollH, 0), 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () =>
      setDimensions({ w: window.innerWidth, h: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio, 2);
    canvas.width = dimensions.w * dpr;
    canvas.height = dimensions.h * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);
  }, [dimensions]);

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = dimensions.w;
    const h = dimensions.h;
    if (w === 0 || h === 0) return;

    const currentIndex = currentFrame - FRAME_START;
    let frameIndex = currentIndex;
    let img = framesRef.current[frameIndex];

    // Keep showing the last decoded frame while heavy PNG frames finish loading.
    if (!img || img.naturalWidth === 0) {
      const fallbackIndex = lastReadyFrameRef.current - FRAME_START;
      img = framesRef.current[fallbackIndex];
      frameIndex = fallbackIndex;
    }

    if (!img || img.naturalWidth === 0) return;
    lastReadyFrameRef.current = FRAME_START + frameIndex;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const imgRatio = iw / ih;
    const canvasRatio = w / h;
    let dw: number, dh: number, dx: number, dy: number;
    if (canvasRatio > imgRatio) {
      dw = w;
      dh = w / imgRatio;
      dx = 0;
      dy = (h - dh) / 2;
    } else {
      dh = h;
      dw = h * imgRatio;
      dx = (w - dw) / 2;
      dy = 0;
    }
    ctx.drawImage(img, dx, dy, dw, dh);

    /* Vignette */
    const vg = ctx.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.8);
    vg.addColorStop(0, "rgba(5,5,5,0)");
    vg.addColorStop(1, "rgba(5,5,5,0.5)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }, [currentFrame, dimensions]);

  useEffect(() => {
    let raf: number;
    const loop = () => {
      drawFrame();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [drawFrame]);

  const statsOpacity = Math.min(
    Math.max((currentFrameProgress - frameProgress(2340)) / 0.08, 0),
    1
  );

  return (
    <section ref={containerRef} className="relative h-[500vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ width: dimensions.w, height: dimensions.h }}
        />

        {/* Loading indicator */}
        {loadProgress < 1 && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#050505]">
            <div className="flex flex-col items-center gap-4">
              <div className="h-px w-48 bg-white/10">
                <div
                  className="h-full bg-white/50 transition-all duration-300"
                  style={{ width: `${loadProgress * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-medium tracking-[0.4em] uppercase text-white/30">
                Loading
              </span>
            </div>
          </div>
        )}

        {/* Text overlays -- positioned LEFT or RIGHT away from the yacht center */}
        {TEXT_OVERLAYS.map((overlay, i) => {
          const opacity = getOpacity(currentFrameProgress, overlay);
          if (opacity <= 0) return null;
          const isLeft = overlay.position === "left";

          return (
            <div
              key={i}
              className={`absolute top-0 bottom-0 z-[5] flex flex-col justify-center ${
                isLeft
                  ? "left-0 items-start pl-8 text-left md:pl-16 lg:pl-24"
                  : "right-0 items-end pr-8 text-right md:pr-16 lg:pr-24"
              }`}
              style={{
                opacity,
                transform: `translateY(${(1 - opacity) * 30}px)`,
                maxWidth: "40%",
              }}
            >
              {overlay.label && (
                <span
                  className="mb-3 text-[10px] font-semibold tracking-[0.4em] uppercase text-white/40"
                  style={{ textShadow: "0 2px 30px rgba(0,0,0,1)" }}
                >
                  {overlay.label}
                </span>
              )}
              <h2
                className="whitespace-pre-line text-2xl font-semibold leading-[1.1] tracking-tight text-white sm:text-3xl md:text-5xl"
                style={{ textShadow: "0 4px 60px rgba(0,0,0,1), 0 2px 12px rgba(0,0,0,0.9)" }}
              >
                {overlay.heading}
              </h2>
              {overlay.sub && (
                <p
                  className="mt-3 text-xs font-medium text-white/50 sm:text-sm md:text-base"
                  style={{ textShadow: "0 2px 20px rgba(0,0,0,1)" }}
                >
                  {overlay.sub}
                </p>
              )}
            </div>
          );
        })}

        {/* Stats -- split LEFT and RIGHT columns at the bottom */}
        {statsOpacity > 0 && (
          <>
            <div
              className="absolute bottom-12 left-8 z-[5] flex flex-col gap-5 md:bottom-16 md:left-16 lg:left-24"
              style={{
                opacity: statsOpacity,
                transform: `translateY(${(1 - statsOpacity) * 20}px)`,
              }}
            >
              {STATS_LEFT.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group flex cursor-default flex-col"
                  style={{
                    opacity: Math.min(Math.max((statsOpacity - i * 0.1) / 0.4, 0), 1),
                  }}
                >
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-2xl font-semibold tabular-nums text-white md:text-3xl"
                    style={{ textShadow: "0 2px 30px rgba(0,0,0,1)" }}
                  >
                    <AnimatedStatValue value={stat.value} />
                  </motion.span>
                  <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 transition-colors duration-300 group-hover:text-white/45">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>

            <div
              className="absolute bottom-12 right-8 z-[5] flex flex-col items-end gap-5 md:bottom-16 md:right-16 lg:right-24"
              style={{
                opacity: statsOpacity,
                transform: `translateY(${(1 - statsOpacity) * 20}px)`,
              }}
            >
              {STATS_RIGHT.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.985 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="group flex cursor-default flex-col items-end"
                  style={{
                    opacity: Math.min(Math.max((statsOpacity - i * 0.1) / 0.4, 0), 1),
                  }}
                >
                  <motion.span
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-2xl font-semibold tabular-nums text-white md:text-3xl"
                    style={{ textShadow: "0 2px 30px rgba(0,0,0,1)" }}
                  >
                    <AnimatedStatValue value={stat.value} />
                  </motion.span>
                  <span className="text-[9px] font-semibold tracking-[0.3em] uppercase text-white/30 transition-colors duration-300 group-hover:text-white/45">
                    {stat.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
