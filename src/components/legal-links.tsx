import type { ReactNode } from "react";

const links = [
  { to: "/about", label: "About Us" },
  { to: "/contact", label: "Contact Us" },
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms & Conditions" },
  { to: "/refund", label: "Refund & Cancellation Policy" },
] as const;

export function LegalLinks({ light = false }: { light?: boolean }) {
  const tone = light
    ? "shrink-0 whitespace-nowrap text-[9px] leading-4 tracking-tight text-brass/90 underline-offset-2 hover:text-gold sm:text-[11px] touch-manipulation"
    : "text-[11px] leading-4 text-muted underline-offset-2 hover:text-navy touch-manipulation";
  return (
    <nav aria-label="Policies" className={light ? "flex w-full flex-nowrap items-center justify-center gap-x-1.5" : "flex flex-wrap gap-x-3 gap-y-1"}>
      {links.map((item) => (
        <a key={item.to} href={item.to} className={tone}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export function PolicyPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-10">
      <h1 className="font-plain text-lg font-bold text-navy">{title}</h1>
      <div className="mt-4 space-y-3 text-xs leading-5 text-ink">{children}</div>
      <div className="mt-6">
        <LegalLinks />
      </div>
    </article>
  );
}
