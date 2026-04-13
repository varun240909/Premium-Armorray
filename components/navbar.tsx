"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SOLUTIONS_ITEMS = [
  "Radiology Center",
  "Hospital",
  "Clinic",
  "Diagnostic Lab",
  "Telemedicine",
  "Pharmacy",
  "Home Care",
];

const PACS_ITEMS = [
  "My Clinic Hybrid PACS",
  "Features",
  "Read Anywhere",
  "Sharing",
  "Archiving",
  "Security & Safety",
  "Hardware",
  "RIS",
  "HIS-PACS Integration",
];

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "Solutions", href: "#solutions", submenu: SOLUTIONS_ITEMS },
  { label: "PACS", href: "#features", submenu: PACS_ITEMS },
  { label: "Teleradiology", href: "#contact" },
  { label: "Blog", href: "#blog" },
  { label: "Contact", href: "#contact" },
];

function DropdownMenu({ items }: { items: string[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 min-w-[200px] rounded-sm border border-white/[0.08] bg-[#0a0a0a]/[0.97] backdrop-blur-xl py-2 shadow-2xl"
    >
      {/* top accent line */}
      <span className="absolute top-0 left-6 right-6 h-px bg-white/10" />

      {items.map((item, i) => (
        <a
          key={item}
          href="#"
          className="block px-6 py-[9px] text-[10px] font-medium tracking-[0.2em] uppercase text-white/45 transition-colors duration-300 hover:text-white hover:bg-white/[0.04]"
        >
          {item}
        </a>
      ))}
    </motion.div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const heroEl = document.getElementById("hero");
    const onScroll = () => {
      if (!heroEl) { setVisible(true); return; }
      const rect = heroEl.getBoundingClientRect();
      const scrollable = heroEl.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      setVisible(progress >= 0.55);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleMouseEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const toggleMobileExpand = (label: string) => {
    setMobileExpanded((prev) => (prev === label ? null : label));
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-transparent"
        style={{ pointerEvents: visible ? "auto" : "none" }}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 lg:px-12">
          {/* Left spacer */}
          <div />

          {/* Desktop links */}
          <div className="hidden items-center gap-0 md:flex">
            {NAV_LINKS.map((link) =>
              link.submenu ? (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(link.label)}
                  onMouseLeave={handleMouseLeave}
                >
                  <a
                    href={link.href}
                    className="group relative flex items-center gap-1 px-6 py-2 text-[11px] font-medium tracking-[0.25em] uppercase text-white/60 transition-colors duration-500 hover:text-white"
                  >
                    {link.label}
                    {/* chevron */}
                    <motion.svg
                      animate={{ rotate: activeDropdown === link.label ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      width="8"
                      height="8"
                      viewBox="0 0 8 8"
                      fill="none"
                      className="opacity-40 group-hover:opacity-80 transition-opacity duration-300 mt-px"
                    >
                      <path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                    <span className="absolute bottom-1 left-6 right-6 h-px origin-left scale-x-0 bg-white/40 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                  </a>

                  <AnimatePresence>
                    {activeDropdown === link.label && (
                      <DropdownMenu items={link.submenu} />
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="group relative px-6 py-2 text-[11px] font-medium tracking-[0.25em] uppercase text-white/60 transition-colors duration-500 hover:text-white"
                >
                  {link.label}
                  <span className="absolute bottom-1 left-6 right-6 h-px origin-left scale-x-0 bg-white/40 transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </a>
              )
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[7px] md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 9, width: 24 } : { rotate: 0, y: 0, width: 24 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="block h-px w-6 bg-white"
            />
            <motion.span
              animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 0.5, scaleX: 1 }}
              transition={{ duration: 0.25 }}
              className="block h-px w-6 bg-white"
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -9, width: 24 } : { rotate: 0, y: 0, width: 16 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="block h-px bg-white self-end"
              style={{ width: menuOpen ? 24 : 16 }}
            />
          </button>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center overflow-y-auto bg-[#050505]/[0.98] backdrop-blur-3xl"
          >
            <div className="flex flex-col items-center gap-1 py-16">
              {NAV_LINKS.map((link, i) =>
                link.submenu ? (
                  <div key={link.label} className="w-full flex flex-col items-center">
                    {/* Expandable parent */}
                    <motion.button
                      onClick={() => toggleMobileExpand(link.label)}
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                      className="flex items-center gap-2 py-4 text-3xl font-light tracking-[0.25em] uppercase text-white/80 transition-colors duration-400 hover:text-white"
                    >
                      {link.label}
                      <motion.svg
                        animate={{ rotate: mobileExpanded === link.label ? 180 : 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        width="14"
                        height="14"
                        viewBox="0 0 14 14"
                        fill="none"
                        className="opacity-50 mt-1"
                      >
                        <path d="M2 4.5L7 9.5L12 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </motion.svg>
                    </motion.button>

                    {/* Sub-items */}
                    <AnimatePresence>
                      {mobileExpanded === link.label && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="overflow-hidden flex flex-col items-center w-full"
                        >
                          <div className="flex flex-col items-center gap-0 pt-1 pb-3">
                            {link.submenu.map((item, j) => (
                              <motion.a
                                key={item}
                                href="#"
                                onClick={() => setMenuOpen(false)}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: j * 0.05, ease: "easeOut" }}
                                className="py-2 text-sm font-light tracking-[0.2em] uppercase text-white/35 transition-colors duration-300 hover:text-white/70"
                              >
                                {item}
                              </motion.a>
                            ))}
                          </div>
                          <span className="mb-3 h-px w-8 bg-white/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
                    className="py-4 text-3xl font-light tracking-[0.25em] uppercase text-white/80 transition-colors duration-400 hover:text-white"
                  >
                    {link.label}
                  </motion.a>
                )
              )}

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                className="mt-10 h-px w-12 bg-white/15"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
