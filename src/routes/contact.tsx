import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { EmailLink, Eyebrow, SiteLink, WhatsAppIcon } from "@/components/bits";
import { Enquiry } from "@/components/enquiry";
import { useCopy, useI18n } from "@/lib/i18n";
import { addressFor, MAPS_URL, PHONE_DISPLAY, PHONE_TEL, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [{ title: "संपर्क · SK Computer & Education Centre" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { lang } = useI18n();
  const t = useCopy();
  const en = lang === "en";
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2">
      <div>
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-3 font-display text-4xl text-navy md:text-5xl">
          {en ? "Tap the number. The call starts." : "नंबर छुएँ। कॉल लग जाएगी।"}
        </h1>
        <p className="mt-4 text-muted">
          {en
            ? "Admission, fees and batch time — all three are answered on the phone. The centre is in Defence Colony."
            : "एडमिशन, फीस और बैच का समय — तीनों का जवाब फ़ोन पर। सेंटर डिफेंस कॉलोनी में है।"}
        </p>
        <a href={PHONE_TEL} className="mt-8 flex items-center gap-4 rounded-3xl bg-navy p-6 text-ivory">
          <span className="flex size-14 items-center justify-center rounded-full bg-gold text-navy">
            <Phone className="size-6" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-sm text-brass">Contact us</span>
            <span className="font-display text-4xl text-gold md:text-5xl">{PHONE_DISPLAY}</span>
          </span>
        </a>
        <div className="mt-4 grid gap-3">
          <a
            href={whatsappLink(t.waHello)}
            className="flex min-h-14 items-center gap-3 rounded-3xl border border-line bg-paper px-5 font-semibold text-navy"
          >
            <WhatsAppIcon className="size-9 shrink-0" />
            <span className="text-lg">{t.waWrite}</span>
          </a>
          <a
            href={MAPS_URL}
            className="flex min-h-14 items-start gap-3 rounded-3xl border border-line bg-paper px-5 py-4 text-navy"
          >
            <MapPin className="mt-1 size-5 shrink-0 text-gold-deep" aria-hidden="true" />
            <span>
              <span className="block font-semibold">{t.addressLabel}</span>
              <span className="block">{addressFor(lang)}</span>
            </span>
          </a>
          <SiteLink className="min-h-14 w-full gap-3 rounded-3xl border border-line bg-paper px-5 text-navy" />
          <EmailLink className="min-h-14 w-full gap-3 rounded-3xl border border-line bg-paper px-5 text-navy" iconClassName="size-6 text-gold-deep" />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          {(en
            ? [
                ["Admission", "Open"],
                ["Seats", "Limited"],
                ["Certificate", "On the course"],
                ["Batches", "Morning · noon · evening"],
              ]
            : [
                ["एडमिशन", "खुला है"],
                ["सीटें", "सीमित"],
                ["सर्टिफिकेट", "कोर्स पर"],
                ["बैच", "सुबह · दोपहर · शाम"],
              ]
          ).map(([label, value]) => (
            <div key={label} className="rounded-2xl bg-brass px-4 py-3">
              <dt className="text-gold-deep">{label}</dt>
              <dd className="font-semibold text-navy">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Enquiry />
    </div>
  );
}
