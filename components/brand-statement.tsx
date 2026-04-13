"use client";

import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";

/* Animated counter for stats */
function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setVal(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* Staggered letter reveal for headlines */
function RevealText({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const words = text.split(" ");
  let charIndex = 0;

  return (
    <span ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => {
        const wordStart = charIndex;
        charIndex += word.length + 1; // +1 for the space

        return (
          <span key={wi} style={{ display: "inline-block", whiteSpace: "nowrap" }}>
            {word.split("").map((char, ci) => (
              <motion.span
                key={ci}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: delay + (wordStart + ci) * 0.025,
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
            {/* Render space after each word except the last */}
            {wi < words.length - 1 && (
              <span style={{ display: "inline-block", whiteSpace: "pre" }}> </span>
            )}
          </span>
        );
      })}
    </span>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function BrandStatement() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imgScale = useTransform(scrollYProgress, [0, 0.5], [1.15, 1]);
  const imgOpacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#050505] px-6 pt-8 pb-20 md:px-12 md:pt-12 md:pb-32"
    >
      {/* Top blend from hero */}
      <div className="absolute inset-x-0 -top-32 h-32 bg-gradient-to-b from-transparent to-[#050505]" />

      <div className="mx-auto max-w-7xl">
        {/* Full-width cinematic image with text overlaid */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative mb-20 aspect-[4/3] w-full overflow-hidden sm:aspect-[16/9] md:aspect-[21/9] md:mb-28"
        >
          <motion.div style={{ scale: imgScale, opacity: imgOpacity }} className="absolute inset-0">
            <Image
              src="/images/radiology-reading-room.png"
              alt="Luxury yacht interior salon"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </motion.div>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 to-transparent" />

          {/* Overlaid heading */}
          <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 md:p-12 lg:p-16">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-3 hidden text-[11px] font-semibold tracking-[0.5em] uppercase text-white/50 sm:block"
            >
              The Platform
            </motion.span>
            <h2 className="max-w-3xl text-xl font-bold leading-[1.1] tracking-tight text-white sm:text-3xl md:text-5xl lg:text-6xl">
              <RevealText text="Important Details Matter." delay={0.4} />
              <br />
              <span className="text-white/40">
                <RevealText text="Premium Hybrid PACS for  enterprise radiology." delay={0.8} />
              </span>
            </h2>
          </div>
        </motion.div>

        {/* Bottom content: two columns */}
        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-20">
          {/* Left: body text */}
          <div>
            <motion.p
              {...fadeUp}
              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
              className="mb-6 text-lg leading-relaxed text-white/60 md:text-xl"
            >
              Armorray&apos;s hybrid PACS combines cloud flexibility with local archive
              security. Enterprise-grade diagnostics, accessible from any device,
              trusted by radiologists and medical centers worldwide.
            </motion.p>

            <motion.p
              {...fadeUp}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="text-lg leading-relaxed text-white/60 md:text-xl"
            >
              From real-time image sharing to vendor-neutral archiving,
              we eliminate workflow friction. Your data. Your rules. Your platform.
            </motion.p>
          </div>

          {/* Right: animated stats */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
            className="grid grid-cols-3 gap-8 border-t border-white/[0.08] pt-10"
          >
            {[
              { value: 37, suffix: "M+", label: "Lives Impacted" },
              { value: 105, suffix: "+", label: "Countries" },
              { value: 99.9, suffix: "%", label: "Uptime SLA" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="group flex cursor-default flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors duration-300 hover:border-white/[0.14] hover:bg-white/[0.04]"
              >
                <motion.span
                  whileHover={{ scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="text-3xl font-bold tabular-nums text-white md:text-4xl"
                >
                  <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                </motion.span>
                <span className="mt-2 text-[10px] font-bold tracking-[0.3em] uppercase text-white/25 transition-colors duration-300 group-hover:text-white/45">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
