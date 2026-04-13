"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";

const FRAME_START = 1;
const FRAME_END = 192;
const TOTAL_FRAMES = FRAME_END - FRAME_START + 1;

function frameSrc(index: number): string {
  const frameNumber = String(FRAME_START + index).padStart(3, "0");
  return `/sequence-1/ezgif-frame-${frameNumber}.jpg`;
}

interface TextOverlay {
  line1?: string;
  sub?: string;
  cta?: string;
  inStart: number;
  inEnd: number;
  outStart: number;
  outEnd: number;
}

const TEXT_OVERLAYS: TextOverlay[] = [
  {
    sub: "Experience the trinity of precision",
    inStart: 0.32,
    inEnd: 0.40,
    outStart: 0.55,
    outEnd: 0.62,
  },
  {
    line1: "Data, Detail,\nand Diagnosis.",
    sub: "Hybrid PACS impacting millions across 100+ countries",
    cta: "Contact Us",
    inStart: 0.64,
    inEnd: 0.72,
    outStart: 0.92,
    outEnd: 1.0,
  },
];

function getOpacity(progress: number, o: TextOverlay): number {
  const fadeIn = Math.min(Math.max((progress - o.inStart) / ((o.inEnd - o.inStart) || 0.01), 0), 1);
  const fadeOut = Math.min(Math.max((o.outEnd - progress) / ((o.outEnd - o.outStart) || 0.01), 0), 1);
  return Math.min(fadeIn, fadeOut);
}

export default function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [progress, setProgress] = useState(0);
  const [dimensions, setDimensions] = useState({ w: 0, h: 0 });
  const loadedCountRef = useRef(0);
  const [loadPercent, setLoadPercent] = useState(0);
  const [ready, setReady] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let mounted = true;
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = frameSrc(i);
      img.onload = () => {
        if (!mounted) return;
        loadedCountRef.current++;
        setLoadPercent(Math.round((loadedCountRef.current / TOTAL_FRAMES) * 100));
        if (loadedCountRef.current >= TOTAL_FRAMES) setReady(true);
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollable = containerRef.current.scrollHeight - window.innerHeight;
      setProgress(Math.min(Math.max(-rect.top / scrollable, 0), 1));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const update = () => setDimensions({ w: window.innerWidth, h: window.innerHeight });
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

    const dpr = Math.min(window.devicePixelRatio, 2);
    const dw = canvas.width / dpr;
    const dh = canvas.height / dpr;

    const idx = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1)), TOTAL_FRAMES - 1);
    const img = imagesRef.current[idx];

    if (img && img.complete && img.naturalWidth > 0) {
      ctx.clearRect(0, 0, dw, dh);
      const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight);
      const sw = img.naturalWidth * scale;
      const sh = img.naturalHeight * scale;
      ctx.drawImage(img, (dw - sw) / 2, (dh - sh) / 2, sw, sh);
    }

    /* Smooth text-driven overlay: use max text opacity as intensity (no flickering) */
    const maxTextOpacity = Math.max(...TEXT_OVERLAYS.map((o) => getOpacity(progress, o)));

    if (maxTextOpacity > 0) {
      /* Soft overall tint that follows text intensity */
      ctx.fillStyle = `rgba(0,0,0,${0.25 * maxTextOpacity})`;
      ctx.fillRect(0, 0, dw, dh);

      /* Bottom fade that follows text intensity */
      const grad = ctx.createLinearGradient(0, dh * 0.7, 0, dh);
      grad.addColorStop(0, `rgba(5,5,5,0)`);
      grad.addColorStop(1, `rgba(5,5,5,${0.85 * maxTextOpacity})`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, dw, dh);
    }


  }, [progress]);

  useEffect(() => {
    const loop = () => {
      drawFrame();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawFrame]);

  return (
    <section ref={containerRef} className="relative h-[500vh]" id="hero">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          style={{ width: dimensions.w, height: dimensions.h }}
        />

        {/* Loading state */}
        {!ready && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]">
            <div className="relative h-px w-40 overflow-hidden bg-white/[0.06]">
              <div
                className="absolute inset-y-0 left-0 bg-white/40 transition-all duration-300"
                style={{ width: `${loadPercent}%` }}
              />
            </div>
            <span className="mt-5 text-[10px] font-medium tabular-nums tracking-[0.5em] text-white/25">
              {loadPercent}
            </span>
          </div>
        )}

        {/* Text overlays */}
        {TEXT_OVERLAYS.map((overlay, i) => {
          const opacity = getOpacity(progress, overlay);
          if (opacity <= 0) return null;

          return (
            <div
              key={i}
              className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6"
              style={{
                opacity,
                transform: `translateY(${(1 - opacity) * 15}px)`,
              }}
            >
              {overlay.line1 && (
                <h1
                  className="text-center font-bold leading-[0.88] text-white"
                  style={{
                    fontSize: "clamp(4rem, 14vw, 12rem)",
                    letterSpacing: "0.08em",
                  }}
                >
                  {overlay.line1}
                </h1>
              )}
              {overlay.sub && (
                <p
                  className="mt-6 text-center text-xl font-medium tracking-[0.12em] text-white md:text-3xl"
                >
                  {overlay.sub}
                </p>
              )}
              {overlay.cta && (
                <motion.a
                  href="#charter"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-12 border border-white/30 px-14 py-4 text-[11px] font-semibold tracking-[0.4em] uppercase text-white transition-all duration-500 hover:bg-white hover:text-[#050505]"
                >
                  {overlay.cta}
                </motion.a>
              )}
            </div>
          );
        })}

        {/* Scroll indicator */}
        {progress < 0.04 && ready && (
          <div className="absolute inset-x-0 bottom-12 z-10 flex flex-col items-center">
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-3"
            >
              <span className="text-[9px] font-semibold tracking-[0.5em] uppercase text-white/40">
                Scroll
              </span>
              <div className="h-7 w-px bg-gradient-to-b from-white/40 to-transparent" />
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
