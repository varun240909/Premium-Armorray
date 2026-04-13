"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const DESTINATIONS = [
  { label: "Radiology Centers" },
  { label: "Hospitals" },
  { label: "Diagnostic Labs" },
  { label: "Telemedicine" },
  { label: "Clinics" },
];

const PARTNER_LOGOS = [
  { src: "/Slider/logo-transparent.png", x: "-25%", y: "-30%", delay: 0 },
  { src: "/Slider/logo.png", x: "28%", y: "-25%", delay: 0.2 },
  { src: "/Slider/Thyrocare_new_Logo2022.png", x: "-32%", y: "15%", delay: 0.4 },
  { src: "/Slider/pulse-logo-342x138.png", x: "30%", y: "20%", delay: 0.6 },
  { src: "/Slider/Manipal_Hospitals.png", x: "0%", y: "40%", delay: 0.8 },
];

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function Globe() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onCanPlay = () => setVideoReady(true);
    video.addEventListener("canplay", onCanPlay);
    video.play().catch(() => { });
    return () => video.removeEventListener("canplay", onCanPlay);
  }, []);

  return (
    <section
      id="destinations"
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        src="/Globe Animation Prompt.mp4"
        autoPlay
        loop
        muted
        playsInline
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${videoReady ? "opacity-100" : "opacity-0"
          }`}
      />

      {/* Overlays */}
      <div className="absolute inset-0 bg-[#0D1318]/70" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0D1318] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />

      {/* Floating Logos Container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {PARTNER_LOGOS.map((logo, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 0.8, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              duration: 1.5,
              delay: logo.delay,
              ease: "easeOut",
            }}
            animate={{
              y: [0, -20, 0],
            }}
            style={{
              left: `calc(50% + ${logo.x})`,
              top: `calc(50% + ${logo.y})`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
          >
            <motion.div
              animate={{
                y: [0, 15, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 6 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex items-center justify-center"
            >
              <div className="relative overflow-hidden rounded-xl p-1o.
              ..
              ">
                <div className="absolute inset-0 z-0 rounded-xl bg-white backdrop-blur-lg" />
                <img
                  src={logo.src}
                  alt="Partner logo"
                  className="relative z-10 h-12 w-auto object-contain"
                />
              </div>

            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.span
          {...fadeUp}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-4 inline-block text-[11px] font-medium tracking-[0.5em] uppercase text-white/30"
        >
          Enterprise Solutions
        </motion.span>

        <motion.h2
          {...fadeUp}
          transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
          className="mb-6 text-4xl font-semibold tracking-tight text-white md:text-6xl lg:text-7xl"
        >
          Built for Every
          <br />
          <span className="font-light text-white/40">Medical Imaging Facility.</span>
        </motion.h2>

        <motion.p
          {...fadeUp}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
          className="mx-auto mb-12 max-w-lg text-base font-light leading-relaxed text-white/40 md:text-lg"
        >
          Armorray serves radiology centers, hospitals, diagnostic labs, telemedicine providers,
          and clinics worldwide. One platform. Unlimited scalability. Enterprise trust.
        </motion.p>

        <motion.div
          {...fadeUp}
          transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-3"
        >
          {DESTINATIONS.map((dest, i) => (
            <motion.span
              key={dest.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
              className="border border-white/10 px-4 py-1.5 text-[10px] font-medium tracking-[0.25em] uppercase text-white/45 backdrop-blur-sm transition-all duration-500 hover:border-white/30 hover:text-white"
            >
              {dest.label}
            </motion.span>
          ))}
        </motion.div>

        <motion.a
          {...fadeUp}
          transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          href="#contact"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="inline-block border border-white/15 px-10 py-3.5 text-[10px] font-medium tracking-[0.35em] uppercase text-white/70 backdrop-blur-sm transition-all duration-500 hover:border-white/40 hover:text-white"
        >
          Explore Solutions
        </motion.a>
      </div>
    </section>
  );
}
