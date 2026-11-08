import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { MapPin, Menu, Phone, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { SkLogo, SkLogoClassic } from "@/components/logo";
import { EmailLink, SiteLink, WhatsAppIcon, CentreName } from "@/components/bits";
import { useCopy, useI18n } from "@/lib/i18n";
import { courses, presentCourse } from "@/lib/courses";
import { addressFor, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

export function Shell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const menuRef = useRef<HTMLDetailsElement>(null);
  const { lang, setLang } = useI18n();
  const t = useCopy();
  const address = addressFor(lang);

  useEffect(() => {
    if (menuRef.current) menuRef.current.open = false;
  }, [pathname]);

  useEffect(() => {
    let started = false;
    const run = () => {
      if (started) return;
      started = true;
      const paths = [
        router.preloadRoute({ to: "/courses", search: { cat: "all" } }),
        router.preloadRoute({ to: "/tuition" }),
        router.preloadRoute({ to: "/about" }),
        router.preloadRoute({ to: "/contact" }),
        router.preloadRoute({ to: "/pay" }),
        router.preloadRoute({ to: "/slip" }),
        router.preloadRoute({ to: "/registration" }),
        router.preloadRoute({ to: "/admin" }),
      ];
      for (const job of paths) void Promise.resolve(job).catch(() => {});
    };
    const timer = window.setTimeout(run, 1600);
    const idle = "requestIdleCallback" in window ? window.requestIdleCallback(() => run(), { timeout: 2200 }) : 0;
    return () => {
      window.clearTimeout(timer);
      if (idle) window.cancelIdleCallback(idle);
    };
  }, [router]);

  return (
    <div className="min-h-dvh bg-ivory text-ink">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-gold focus:px-4 focus:py-2 focus:text-navy"
      >
        {t.skip}
      </a>
      <div className="no-print bg-navy text-ivory">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2 text-sm md:px-5">
          <div className="hidden min-w-0 md:block">
            <CentreName tone="gold" look="solid" className="text-lg md:text-xl" />
            <p className="truncate text-sm text-brass">{address}</p>
          </div>
          <a href={PHONE_TEL} className="inline-flex min-h-11 items-center gap-2 font-semibold text-gold">
            <Phone className="size-4" aria-hidden="true" />
            {PHONE_DISPLAY}
          </a>
          <div className="md:hidden">
            <LanguageToggle lang={lang} setLang={setLang} className="flex md:hidden" />
          </div>
        </div>
      </div>
      <div className="no-print grid grid-cols-3" aria-hidden="true">
        <span className="h-1.5 bg-gold" />
        <span className="h-1.5 bg-navy" />
        <span className="h-1.5 bg-brass" />
      </div>
      <header className="no-print sticky top-0 z-40 border-b border-line bg-paper touch-manipulation">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/" className="shrink-0" aria-label="SK Computer & Education Centre">
              <SkLogo className="size-16 md:size-24" />
            </Link>
            <div className="min-w-0">
              <Link to="/" className="block">
                <CentreName look="plain" className="text-[clamp(0.8rem,3.5vw,1.65rem)]" />
                <span className="mt-1 flex items-start gap-1.5 text-sm font-medium leading-snug text-navy/85">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-gold-deep" aria-hidden="true" />
                  <span>{address}</span>
                </span>
              </Link>
              <span className="mt-0.5 hidden sm:block">
                <SiteLink className="text-xs text-gold-deep" />
              </span>
            </div>
          </div>
          <nav className="hidden max-w-md flex-wrap items-center justify-end gap-x-3 gap-y-1 lg:flex xl:max-w-3xl" aria-label={t.nav}>
            <NavLinks />
          </nav>
          <div className="flex shrink-0 items-center gap-2">
            <LanguageToggle lang={lang} setLang={setLang} className="hidden md:flex" />
            <a
              href={PHONE_TEL}
              className="hidden min-h-11 items-center gap-2 rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy xl:inline-flex"
            >
              <Phone className="size-4" aria-hidden="true" />
              {t.call}
            </a>
            <details ref={menuRef} className="group relative lg:hidden">
              <summary className="flex size-11 cursor-pointer list-none items-center justify-center rounded-full border border-line text-navy touch-manipulation">
                <Menu className="size-5 group-open:hidden" />
                <X className="hidden size-5 group-open:block" />
              </summary>
              <nav className="absolute right-0 z-50 mt-3 w-[min(20rem,calc(100vw-2.5rem))] rounded-3xl border border-line bg-paper p-3 shadow-xl" aria-label={t.mobileNav}>
                <div className="flex flex-col gap-1">
                  <NavLinks stacked />
                </div>
              </nav>
            </details>
          </div>
        </div>
      </header>
      <main id="content" className="pb-24 md:pb-0">
        {children}
      </main>
      <footer className="no-print mt-8 bg-navy text-ivory">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
          <div className="md:col-span-2">
            <SkLogoClassic className="size-16" />
            <p className="mt-4 font-display text-3xl">{t.footerTag}</p>
            <p className="mt-3">
              <CentreName tone="gold" look="solid" className="text-[clamp(1.15rem,3.2vw,1.7rem)]" />
            </p>
            <p className="mt-1 max-w-md text-sm text-brass">{address}</p>
            <p className="mt-3 max-w-md text-brass">{t.footerLine}</p>
            <SiteLink className="mt-4 text-sm text-gold" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest text-gold uppercase">{t.courses}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {courses.slice(0, 8).map((course) => {
                const view = presentCourse(course, lang);
                const title = lang === "en" ? view.name : view.hindi;
                return (
                  <li key={course.slug}>
                    <Link to="/course/$slug" params={{ slug: course.slug }} className="text-ivory/90 hover:text-gold">
                      {title}
                    </Link>
                  </li>
                );
              })}
              <li>
                <Link to="/courses" search={{ cat: "all" }} className="font-semibold text-gold">
                  {t.allCourses}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-widest text-gold uppercase">{t.contact}</p>
            <a href={PHONE_TEL} className="mt-4 inline-flex items-center gap-3 font-display text-3xl text-gold">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold text-navy">
                <Phone className="size-6" aria-hidden="true" />
              </span>
              {PHONE_DISPLAY}
            </a>
            <a href={whatsappLink(t.waHello)} className="mt-3 inline-flex min-h-12 items-center gap-3 text-lg font-semibold">
              <WhatsAppIcon className="size-9 shrink-0" />
              {t.waWrite}
            </a>
            <a href={MAPS_URL} className="mt-4 block text-sm text-brass">
              {address}
            </a>
            <SiteLink className="mt-3 text-sm text-gold" />
            <EmailLink className="mt-2 text-sm text-brass" iconClassName="size-4 text-gold" />
            <p className="mt-4 text-sm text-brass">{t.batches}</p>
          </div>
        </div>
        <div className="border-t border-ivory/15">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-4 text-xs text-brass">
            <p>{t.footerMeta}</p>
            <p>{t.footerTag}</p>
          </div>
        </div>
      </footer>
      <div className="no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-paper md:hidden">
        <a href={PHONE_TEL} className="inline-flex min-h-14 items-center justify-center gap-2 font-semibold text-navy">
          <Phone className="size-4" aria-hidden="true" />
          {t.call}
        </a>
        <a
          href={whatsappLink(t.waHello)}
          className="inline-flex min-h-14 items-center justify-center gap-2 bg-navy font-semibold text-ivory"
        >
          <WhatsAppIcon className="size-6 shrink-0" />
          <span className="text-base">{t.wa}</span>
        </a>
      </div>
    </div>
  );
}

function LanguageToggle({
  lang,
  setLang,
  className = "flex",
}: {
  lang: "en" | "hi";
  setLang: (lang: "en" | "hi") => void;
  className?: string;
}) {
  return (
    <div className={`${className} overflow-hidden rounded-full border border-line bg-ivory`} role="group" aria-label="Language">
      <button
        type="button"
        aria-pressed={lang === "hi"}
        onPointerDown={() => setLang("hi")}
        onClick={() => setLang("hi")}
        className={`min-h-11 px-3 text-sm font-semibold touch-manipulation ${lang === "hi" ? "bg-navy text-ivory" : "text-navy"}`}
      >
        हिंदी
      </button>
      <button
        type="button"
        aria-pressed={lang === "en"}
        onPointerDown={() => setLang("en")}
        onClick={() => setLang("en")}
        className={`min-h-11 px-3 text-sm font-semibold touch-manipulation ${lang === "en" ? "bg-gold text-navy" : "text-navy"}`}
      >
        English
      </button>
    </div>
  );
}

function NavLinks({ stacked = false }: { stacked?: boolean }) {
  const t = useCopy();
  const { lang } = useI18n();
  const item = stacked
    ? "flex min-h-12 items-center rounded-2xl px-3 font-plain text-base font-semibold text-navy touch-manipulation"
    : "font-plain text-base font-semibold text-navy underline-offset-4 touch-manipulation";
  const active = stacked ? "bg-brass" : "underline decoration-gold decoration-2";
  return (
    <>
      <Link to="/" preload={false} activeOptions={{ exact: true }} className={item} activeProps={{ className: active }}>
        {t.home}
      </Link>
      <Link to="/courses" preload={false} search={{ cat: "all" }} className={item} activeProps={{ className: active }}>
        {t.courses}
      </Link>
      <Link to="/tuition" preload={false} className={item} activeProps={{ className: active }}>
        {t.tuition}
      </Link>
      <Link to="/about" preload={false} className={item} activeProps={{ className: active }}>
        {t.about}
      </Link>
      <Link to="/contact" preload={false} className={item} activeProps={{ className: active }}>
        {lang === "en" ? "Contact Us" : t.contact}
      </Link>
      <Link to="/registration" preload={false} className={item} activeProps={{ className: active }}>
        {t.registration}
      </Link>
      <Link to="/pay" preload={false} className={item} activeProps={{ className: active }}>
        {t.payFees}
      </Link>
      <Link to="/slip" preload={false} className={item} activeProps={{ className: active }}>
        {t.paySlip}
      </Link>
      <Link to="/admin" preload={false} className={item} activeProps={{ className: active }}>
        {t.admin}
      </Link>
    </>
  );
}
