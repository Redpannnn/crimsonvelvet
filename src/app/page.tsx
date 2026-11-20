"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const COVER_VIDEO = "/images/slide1.mp4";

const SLIDES = [
  {
    src: "/images/slide2.mp4",
    label: "We Are Getting Married — 10.07.2027",
  },
  {
    src: "/images/slide3.mp4",
    label: "Mempelai — Maestro Ade Pratama & Farida Septiani",
  },
  {
    src: "/images/slide4.mp4",
    label: "Save The Date — Akad Nikah & Resepsi",
  },
  {
    src: "/images/slide5.mp4",
    label: "Thank You",
  },
];

/** Video slide yang hanya berjalan saat slide-nya terlihat. */
function SlideVideo({ src, label, active }: { src: string; label: string; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      video.play().catch(() => {
        /* autoplay ditolak browser — diabaikan */
      });
    } else {
      video.pause();
    }
  }, [active]);

  return (
    <>
      <h2 className="sr-only">{label}</h2>
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        aria-hidden="true"
        className="h-full w-full object-cover md:object-contain"
      />
    </>
  );
}

export default function WeddingInvitationPage() {
  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);
  const [active, setActive] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const coverVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleOpen = useCallback(() => {
    if (closing || opened) return;
    setClosing(true);
    coverVideoRef.current?.pause();
    window.setTimeout(() => setOpened(true), 750);
  }, [closing, opened]);

  /** Index slide aktif dari posisi scroll. */
  const getCurrentIndex = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    return Math.min(Math.max(idx, 0), SLIDES.length - 1);
  }, []);

  const handleScroll = useCallback(() => {
    setActive(getCurrentIndex());
  }, [getCurrentIndex]);

  const goToSlide = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const target = Math.min(Math.max(index, 0), SLIDES.length - 1);
    el.scrollTo({ top: target * el.clientHeight, behavior: "smooth" });
  }, []);

  /** Navigasi keyboard (panah atas/bawah, PageUp/PageDown). */
  useEffect(() => {
    if (!opened) return;
    const onKey = (event: KeyboardEvent) => {
      const current = getCurrentIndex();
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        goToSlide(current + 1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        goToSlide(current - 1);
      } else if (event.key === "Home") {
        event.preventDefault();
        goToSlide(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goToSlide(SLIDES.length - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [opened, getCurrentIndex, goToSlide]);

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#12060a]">
      {/* ===== Slide 2-5: konten undangan (muncul setelah Open diklik) ===== */}
      {opened && (
        <main
          ref={scrollRef}
          onScroll={handleScroll}
          tabIndex={0}
          aria-label="Undangan pernikahan"
          className="no-scrollbar animate-fade-in-soft h-dvh w-full snap-y snap-proximity overflow-y-auto overscroll-none bg-[#12060a] focus:outline-none"
        >
          {SLIDES.map((slide, index) => (
            <section
              key={slide.src}
              aria-label={slide.label}
              className="relative flex h-dvh w-full snap-start snap-always items-center justify-center overflow-hidden bg-[#12060a]"
            >
              <SlideVideo src={slide.src} label={slide.label} active={active === index} />
            </section>
          ))}
        </main>
      )}

      {/* ===== Navigasi titik (slide 2-5) ===== */}
      {opened && (
        <nav
          aria-label="Navigasi slide"
          className="fixed right-2.5 top-1/2 z-40 flex -translate-y-1/2 flex-col gap-2.5 sm:right-4"
        >
          {SLIDES.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`Slide ${index + 1} dari ${SLIDES.length}: ${slide.label}`}
              aria-current={active === index}
              onClick={() => goToSlide(index)}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                active === index
                  ? "scale-125 bg-[#f3e9db] shadow-[0_0_6px_rgba(243,233,219,0.6)]"
                  : "bg-[#f3e9db]/35 hover:bg-[#f3e9db]/70"
              }`}
            />
          ))}
        </nav>
      )}

      {/* ===== Petunjuk geser ke bawah ===== */}
      {opened && active < SLIDES.length - 1 && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-4 left-1/2 z-40 -translate-x-1/2 animate-bounce text-[#f3e9db]/70"
        >
          <ChevronDown className="h-6 w-6 drop-shadow-md" strokeWidth={1.5} />
        </div>
      )}

      {/* ===== Slide 1: cover (hilang permanen setelah Open diklik) ===== */}
      {!opened && (
        <section
          aria-label="Cover undangan — Tama & Septi, 10 Juli 2027"
          className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#12060a] transition-all duration-700 ease-out ${
            closing ? "pointer-events-none scale-110 opacity-0" : "scale-100 opacity-100"
          }`}
        >
          <h1 className="sr-only">
            Undangan pernikahan Tama &amp; Septi — Sabtu, 10 Juli 2027
          </h1>
          <video
            ref={coverVideoRef}
            src={COVER_VIDEO}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            aria-hidden="true"
            className="h-full w-full object-cover md:object-contain"
          />

          {/* Tombol Open — persis di bawah tanggal "10 Juli 2027" */}
          <div className="absolute inset-x-0 top-[78.5%] flex justify-center">
            <button
              type="button"
              onClick={handleOpen}
              className="animate-rise-in rounded-full bg-[#8c1d30] px-7 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_8px_24px_rgba(0,0,0,0.45)] ring-1 ring-white/25 transition-all duration-200 hover:scale-105 hover:bg-[#a02338] active:scale-95 sm:px-9 sm:py-2.5 sm:text-[11px]"
            >
              Open
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
