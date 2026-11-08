import { useEffect, useRef, useState } from "react";
import { useI18n, type Lang } from "@/lib/i18n";

const slides: { src: string; fit: "contain" | "cover"; alt: Record<Lang, string> }[] = [
  {
    src: "/banners/centre-banner.png",
    fit: "contain",
    alt: {
      en: "SK Computer & Education Centre admission poster",
      hi: "SK Computer & Education Centre का एडमिशन पोस्टर",
    },
  },
  {
    src: "/banners/lab.jpg",
    fit: "cover",
    alt: { en: "Students in the computer lab", hi: "कंप्यूटर लैब में प्रैक्टिस" },
  },
  {
    src: "/banners/design.jpg",
    fit: "cover",
    alt: { en: "Design and print practice", hi: "डिज़ाइन और प्रिंट की प्रैक्टिस" },
  },
  {
    src: "/banners/screens.jpg",
    fit: "cover",
    alt: { en: "Office, web and video practice screens", hi: "ऑफिस, वेब और वीडियो की प्रैक्टिस" },
  },
  {
    src: "/banners/tuition.jpg",
    fit: "cover",
    alt: { en: "School tuition books and notes", hi: "स्कूल ट्यूशन की किताबें और नोट्स" },
  },
  {
    src: "/banners/students-blue.jpg",
    fit: "cover",
    alt: { en: "A student in a blue shirt at the computer", hi: "नीली शर्ट में कंप्यूटर पर विद्यार्थी" },
  },
  {
    src: "/banners/tally.jpg",
    fit: "cover",
    alt: { en: "Tally practice on a clear accounts screen", hi: "Tally की प्रैक्टिस, साफ़ खाता स्क्रीन" },
  },
  {
    src: "/banners/practice.jpg",
    fit: "cover",
    alt: { en: "Spreadsheet and design practice in the lab", hi: "लैब में शीट और डिज़ाइन की प्रैक्टिस" },
  },
];

export function BannerSlider() {
  const { lang } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const startX = useRef(0);
  const label = lang === "en" ? "Centre banners" : "सेंटर के बैनर";

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || paused) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(id);
  }, [paused]);

  function go(next: number) {
    setIndex((next + slides.length) % slides.length);
  }

  function onTouchEnd(clientX: number) {
    const dx = clientX - startX.current;
    if (dx > 42) go(index - 1);
    else if (dx < -42) go(index + 1);
    setPaused(false);
  }

  const slide = slides[index] ?? slides[0];

  return (
    <section className="bg-navy pb-10" aria-roledescription="carousel" aria-label={label}>
      <div
        className="relative mx-auto max-w-6xl px-5"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className={
            slide.fit === "contain"
              ? "banner-poster overflow-hidden rounded-3xl border-4 border-gold bg-paper touch-pan-y"
              : "banner-frame overflow-hidden rounded-3xl border-4 border-gold bg-paper touch-pan-y"
          }
          onPointerDown={(event) => {
            if (event.pointerType === "mouse" && event.button !== 0) return;
            startX.current = event.clientX;
            setPaused(true);
          }}
          onPointerUp={(event) => onTouchEnd(event.clientX)}
          onPointerCancel={() => setPaused(false)}
        >
          <img
            src={slide.src}
            alt={slide.alt[lang]}
            draggable={false}
            fetchPriority="high"
            decoding="async"
            className={slide.fit === "contain" ? "block h-auto w-full" : "h-full w-full object-cover"}
          />
        </div>
        <div className="mt-4 flex justify-center gap-2">
          {slides.map((item, dot) => (
            <button
              key={item.src}
              type="button"
              aria-label={`${lang === "en" ? "Banner" : "बैनर"} ${dot + 1}`}
              aria-current={dot === index}
              onClick={() => go(dot)}
              className={`size-3 rounded-full ${dot === index ? "bg-gold" : "bg-ivory/40"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
