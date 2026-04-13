"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

const FIELDS = [
  { name: "name", label: "Full Name", type: "text", required: true },
  { name: "email", label: "Work Email", type: "email", required: true },
  { name: "facility", label: "Facility / Organization", type: "text", required: false },
  { name: "role", label: "Your Role", type: "text", required: false },
  { name: "interest", label: "Primary Interest", type: "text", required: false },
];

export default function Charter() {
  const [formState, setFormState] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" className="relative overflow-hidden">
      {/* Full-width image background */}
      <div className="absolute inset-0">
        <Image
          src="/images/yacht-night.jpg"
          alt="Yacht at night"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/80" />
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#0D1318] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#111111] to-transparent" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-center px-6 py-24 md:px-12">
        <div className="grid w-full gap-16 md:grid-cols-2 md:gap-20">
          {/* Left -- copy */}
          <div className="flex flex-col justify-center">
            <motion.span
              {...fadeUp}
              transition={{ duration: 1, ease: "easeOut" }}
              className="mb-6 block text-[11px] font-semibold tracking-[0.5em] uppercase text-white/40"
            >
              Get Started
            </motion.span>

            <motion.h2
              {...fadeUp}
              transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
              className="mb-8 text-4xl font-bold leading-[1.08] tracking-tight text-white md:text-6xl lg:text-7xl"
            >
              Request a Demo.
              <br />
              No Pressure.
            </motion.h2>

            <motion.p
              {...fadeUp}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              className="mb-10 max-w-md text-base leading-relaxed text-white/50 md:text-lg"
            >
              See how Armorray transforms diagnostic workflows. Our team will walk you through
              features tailored to your facility - PACS, archiving, teleradiology, and more.
            </motion.p>

            {/* Trust badges */}
            <motion.div
              {...fadeUp}
              transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
              className="flex gap-10"
            >
              {[
                { value: "24h", label: "Response" },
                { value: "37M+", label: "Lives Impacted" },
                { value: "99.9%", label: "Uptime SLA" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col">
                  <span className="text-2xl font-bold tabular-nums text-white">
                    {item.value}
                  </span>
                  <span className="mt-1 text-[10px] font-medium tracking-[0.3em] uppercase text-white/30">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right -- form / success */}
          <motion.div
            {...fadeUp}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  className="border border-white/10 bg-white/[0.03] p-10 text-center backdrop-blur-xl md:p-14"
                >
                  {/* Animated checkmark */}
                  <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-white/10">
                    <motion.svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      className="text-white"
                    >
                      <motion.path
                        d="M4 12l6 6L20 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                      />
                    </motion.svg>
                  </div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="mb-3 text-2xl font-bold tracking-tight text-white"
                  >
                    Demo Request Received
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.75, duration: 0.6 }}
                    className="mb-2 text-sm leading-relaxed text-white/45"
                  >
                    Thank you for your interest in Armorray. Our product team will
                    reach out within 24 hours to schedule your personalized demo.
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.6 }}
                    className="text-[10px] font-semibold tracking-[0.3em] uppercase text-white/25"
                  >
                    We look forward to welcoming you aboard
                  </motion.p>

                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    onClick={() => {
                      setSubmitted(false);
                      setFormState({});
                    }}
                    className="mt-8 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/40 transition-colors duration-400 hover:text-white/70"
                  >
                    Submit another request
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.4 }}
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                  className="border border-white/[0.08] bg-white/[0.03] p-8 backdrop-blur-xl md:p-12"
                >
                  <h3 className="mb-8 text-lg font-semibold tracking-tight text-white">
                    Request a Demo
                  </h3>

                  <div className="flex flex-col gap-6">
                    {FIELDS.map((field) => (
                      <div key={field.name} className="group relative">
                        <input
                          type={field.type}
                          name={field.name}
                          required={field.required}
                          onChange={handleChange}
                          value={formState[field.name] || ""}
                          placeholder=" "
                          className="peer w-full border-b border-white/[0.1] bg-transparent pb-2 pt-5 text-sm font-medium text-white outline-none transition-all duration-500 placeholder:text-transparent focus:border-white/30"
                        />
                        <label className="pointer-events-none absolute left-0 top-0 text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/20 peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-[0.2em] peer-focus:text-white/50">
                          {field.label}
                        </label>
                      </div>
                    ))}

                    <div className="group relative">
                      <textarea
                        name="message"
                        rows={2}
                        onChange={handleChange}
                        value={formState.message || ""}
                        placeholder=" "
                        className="peer w-full resize-none border-b border-white/[0.1] bg-transparent pb-2 pt-5 text-sm font-medium text-white outline-none transition-all duration-500 placeholder:text-transparent focus:border-white/30"
                      />
                      <label className="pointer-events-none absolute left-0 top-0 text-[10px] font-semibold tracking-[0.2em] uppercase text-white/25 transition-all duration-300 peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal peer-placeholder-shown:text-white/20 peer-focus:top-0 peer-focus:text-[10px] peer-focus:font-semibold peer-focus:tracking-[0.2em] peer-focus:text-white/50">
                        Message
                      </label>
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-10 w-full bg-white py-4 text-[11px] font-bold tracking-[0.4em] uppercase text-[#050505] transition-all duration-500 hover:bg-white/90"
                  >
                    Request Demo
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
