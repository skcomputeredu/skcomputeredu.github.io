import { Link } from "@tanstack/react-router";
import {
  AppWindow,
  Award,
  BookOpen,
  Brain,
  Calculator,
  ChevronDown,
  Clapperboard,
  Code2,
  FileSpreadsheet,
  Globe,
  HardDrive,
  Image as ImageIcon,
  Keyboard,
  Languages,
  Mail,
  Monitor,
  Network,
  PenTool,
  Phone,
  Table2,
  type LucideIcon,
} from "lucide-react";
import type { Course, Module } from "@/lib/courses";
import { courseFullForm, courseImage, courseTitle, presentCourse } from "@/lib/courses";
import { useCopy, useI18n } from "@/lib/i18n";
import { PHONE_DISPLAY, PHONE_TEL, EMAIL, EMAIL_MAILTO, SITE_LABEL, SITE_URL, whatsappLink } from "@/lib/site";

const icons: Record<string, LucideIcon> = {
  "basic-computer": Monitor,
  ccc: Award,
  adca: Award,
  dca: Award,
  "o-level": Award,
  "hindi-typing": Languages,
  "english-typing": Keyboard,
  "hardware-networking": Network,
  "software-installation": HardDrive,
  "ms-office": AppWindow,
  "web-designing": Globe,
  "graphic-designing": PenTool,
  photoshop: ImageIcon,
  ai: Brain,
  "internet-email": Mail,
  "advanced-excel": Table2,
  "c-cpp": Code2,
  "data-entry": FileSpreadsheet,
  "video-editing": Clapperboard,
  dtp: BookOpen,
  tally: Calculator,
};

const iconColor: Record<string, string> = {
  "basic-computer": "#2563eb",
  ccc: "#c8962e",
  adca: "#0f9d58",
  dca: "#0d9488",
  "o-level": "#3730a3",
  "hindi-typing": "#e07028",
  "english-typing": "#1d4ed8",
  "hardware-networking": "#0891b2",
  "software-installation": "#7c3aed",
  "ms-office": "#d83b01",
  "web-designing": "#0284c7",
  "graphic-designing": "#db2777",
  photoshop: "#31a8ff",
  ai: "#7c3aed",
  "internet-email": "#ea4335",
  "advanced-excel": "#217346",
  "c-cpp": "#00599c",
  "data-entry": "#0369a1",
  "video-editing": "#e11d48",
  dtp: "#9333ea",
  tally: "#b45309",
};

export function CourseGlyph({ slug, className }: { slug: string; className?: string }) {
  const Icon = icons[slug] ?? Monitor;
  return <Icon className={className} color={iconColor[slug] ?? "#0c2340"} strokeWidth={1.75} aria-hidden="true" />;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest text-gold-deep uppercase">{children}</p>
  );
}

export function CallLink({
  children,
  className = "",
  subtle = false,
}: {
  children?: React.ReactNode;
  className?: string;
  subtle?: boolean;
}) {
  return (
    <a
      href={PHONE_TEL}
      className={
        subtle
          ? `inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ivory/30 px-5 py-3 font-semibold text-ivory ${className}`
          : `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-navy ${className}`
      }
    >
      <Phone className="size-4" aria-hidden="true" />
      {children ?? PHONE_DISPLAY}
    </a>
  );
}

export function SiteLink({ className = "" }: { className?: string }) {
  return (
    <a href={SITE_URL} className={`inline-flex items-center gap-1.5 font-semibold ${className}`}>
      <span aria-hidden="true">🌐</span>
      <span>{SITE_LABEL}</span>
    </a>
  );
}

export function EmailLink({
  className = "",
  iconClassName = "size-5",
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a href={EMAIL_MAILTO} className={`inline-flex items-center gap-2 font-semibold ${className}`}>
      <Mail className={iconClassName} aria-hidden="true" />
      <span>{EMAIL}</span>
    </a>
  );
}

export function CentreName({
  tone = "ink",
  look = "display",
  caps = false,
  className = "",
}: {
  tone?: "ink" | "gold";
  look?: "plain" | "display" | "heading" | "solid";
  caps?: boolean;
  className?: string;
}) {
  if (look === "heading") {
    const color = tone === "gold" ? "text-white" : "text-navy";
    return (
      <span className={`centre-heading ${className}`}>
        <span className={`centre-heading-main ${color}`}>SK Computer Classes</span>
        <span className={`centre-heading-sub ${color}`}>
          <span className="amp">&</span> School Coaching
        </span>
      </span>
    );
  }
  if (look === "solid") {
    const color = tone === "gold" ? "text-gold" : "text-navy";
    return (
      <span className={`centre-solid ${color} ${className}`}>
        SK Computer <span className="amp">&</span> Education Centre
      </span>
    );
  }
  if (look === "plain") {
    const color = tone === "gold" ? "text-gold" : "text-navy";
    return (
      <span className={`centre-name ${color} ${className}`}>
        {caps ? "SK COMPUTER" : "SK Computer"} <span className="amp">&</span> {caps ? "EDUCATION CENTRE" : "Education Centre"}
      </span>
    );
  }
  const color = tone === "gold" ? "text-white" : "text-navy";
  return (
    <span className={`centre-display ${className}`}>
      <span className={`centre-display-main ${color}`}>SK Computer</span>
      <span className={`centre-display-line ${color}`}>
        <span className="amp">&</span> Education Centre
      </span>
    </span>
  );
}

export function WhatsAppIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path
        fill="#fff"
        d="M12 5.2a6.7 6.7 0 0 0-5.8 10.1l-.7 2.6 2.7-.7A6.7 6.7 0 1 0 12 5.2zm3.7 9.4c-.2.5-1 .9-1.4.9-.3.1-.8.1-1.3-.1-.3-.1-.7-.3-1.2-.5-2-.9-3.3-3-3.4-3.2-.1-.2-.8-1.1-.8-2.1 0-1 .5-1.5.7-1.7.2-.2.4-.2.5-.2h.4c.1 0 .3 0 .4.3.2.4.6 1.5.6 1.6.1.1.1.2 0 .4l-.3.4c-.1.1-.2.2-.1.4.1.2.5.9 1.2 1.5.8.7 1.5 1 1.7 1.1.2.1.3 0 .4-.1.1-.1.5-.6.6-.8.1-.2.3-.1.4-.1.2.1 1.2.6 1.4.7.2.1.3.1.4.2.1.2.1.7-.1 1.2z"
      />
    </svg>
  );
}

export function WhatsAppLink({
  text,
  children,
  className = "",
}: {
  text: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={whatsappLink(text)}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 font-semibold text-ivory ${className}`}
    >
      <WhatsAppIcon className="size-5" />
      {children}
    </a>
  );
}

export function Points({ items, tone = "ink" }: { items: readonly string[]; tone?: "ink" | "ivory" }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            className={`mt-2 size-1.5 shrink-0 rounded-full ${tone === "ivory" ? "bg-gold" : "bg-navy"}`}
            aria-hidden="true"
          />
          <span className={tone === "ivory" ? "text-ivory" : "text-ink"}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Syllabus({ modules }: { modules: Module[] }) {
  return (
    <div className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
      {modules.map((mod, index) => (
        <details key={mod.title} className="group px-4 md:px-6">
          <summary className="flex min-h-14 items-center justify-between gap-4 py-4">
            <span className="flex items-baseline gap-3 text-left">
              <span className="font-display text-lg text-gold-deep tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-sans text-base font-semibold text-navy">{mod.title}</span>
            </span>
            <ChevronDown className="chev size-5 shrink-0 text-muted transition-transform duration-200" />
          </summary>
          <ul className="space-y-2 pb-5">
            {mod.points.map((point) => (
              <li key={point} className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-navy" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </details>
      ))}
    </div>
  );
}

export function CourseCard({ course }: { course: Course }) {
  const { lang } = useI18n();
  const t = useCopy();
  const view = presentCourse(course, lang);
  const title = courseTitle(course, lang);
  const full = courseFullForm(course, lang);
  return (
    <Link
      to="/course/$slug"
      params={{ slug: course.slug }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-line bg-paper transition-transform duration-200 hover:-translate-y-0.5"
    >
      <div className="relative h-36 overflow-hidden">
        <img
          src={courseImage(course)}
          alt=""
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <span className="absolute top-3 left-3 rounded-full bg-navy px-3 py-1 text-xs font-semibold text-ivory">
          {course.code}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ivory text-navy">
            <CourseGlyph slug={course.slug} className="size-5" />
          </span>
          <div>
            <h3 className="font-sans text-lg font-semibold text-navy">{title}</h3>
            {full ? <p className="text-sm text-muted">{full}</p> : null}
          </div>
        </div>
        <p className="line-clamp-3 text-sm text-ink">{view.summary}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm">
          <span className="font-semibold text-gold-deep">{view.duration}</span>
          <span className="font-semibold text-navy">{t.detail}</span>
        </div>
      </div>
    </Link>
  );
}
