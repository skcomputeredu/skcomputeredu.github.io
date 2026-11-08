import { useMemo, useState } from "react";
import { WhatsAppIcon } from "@/components/bits";
import { courses, presentCourse } from "@/lib/courses";
import { useI18n } from "@/lib/i18n";
import { PHONE_TEL, whatsappLink } from "@/lib/site";

export function Enquiry({ preset = "" }: { preset?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [course, setCourse] = useState(preset);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const { lang } = useI18n();
  const en = lang === "en";

  const href = useMemo(() => {
    const text = [
      en ? "Hello, I need information from SK Computer & Education Centre." : "नमस्ते, SK Computer & Education Centre से जानकारी चाहिए।",
      `${en ? "Name" : "नाम"}: ${name.trim() || "—"}`,
      `${en ? "Mobile" : "मोबाइल"}: ${phone.trim() || "—"}`,
      `${en ? "Course" : "कोर्स"}: ${course || (en ? "Not decided yet" : "अभी तय नहीं")}`,
      note.trim() ? `${en ? "Message" : "संदेश"}: ${note.trim()}` : "",
    ]
      .filter(Boolean)
      .join("\n");
    return whatsappLink(text);
  }, [name, phone, course, note, en]);

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (name.trim().length < 2) {
      setError(en ? "Please write your name." : "अपना नाम लिखें।");
      setSent(false);
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setError(en ? "Write a 10-digit mobile number." : "10 अंक का मोबाइल नंबर लिखें।");
      setSent(false);
      return;
    }
    setError("");
    setSent(true);
    window.open(href, "_blank", "noopener,noreferrer");
  }

  const field =
    "min-h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base text-ink outline-none focus:border-navy";

  return (
    <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-paper p-5 md:p-7">
      <h2 className="font-display text-3xl text-navy">{en ? "Ask about admission" : "एडमिशन पूछें"}</h2>
      <p className="mt-2 text-sm text-muted">
        {en
          ? "The form opens WhatsApp. The number itself starts a call."
          : "फ़ॉर्म WhatsApp खोलता है। नंबर छूते ही सीधे कॉल भी लग सकती है।"}
      </p>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-2 text-sm font-medium text-navy">
          {en ? "Name" : "नाम"}
          <input className={field} value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
        </label>
        <label className="grid gap-2 text-sm font-medium text-navy">
          {en ? "Mobile" : "मोबाइल"}
          <input
            className={field}
            inputMode="numeric"
            autoComplete="tel"
            value={phone}
            onChange={(event) => setPhone(event.target.value.replace(/\D/g, "").slice(0, 10))}
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-navy">
          {en ? "Course" : "कोर्स"}
          <select className={field} value={course} onChange={(event) => setCourse(event.target.value)}>
            <option value="">{en ? "Choose, or leave blank" : "चुनें या खाली छोड़ें"}</option>
            {courses.map((item) => {
              const view = presentCourse(item, lang);
              return (
                <option key={item.slug} value={item.name}>
                  {item.name} · {view.duration}
                </option>
              );
            })}
            <option value="School Tuition">{en ? "School Tuition · Class 1–12" : "School Tuition · कक्षा 1–12"}</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium text-navy">
          {en ? "Message" : "संदेश"}
          <textarea
            className={`${field} min-h-28 py-3`}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={en ? "Batch time, online or offline" : "बैच का समय, ऑनलाइन या ऑफलाइन"}
          />
        </label>
      </div>
      {error ? <p className="mt-4 text-sm font-medium text-gold-deep">{error}</p> : null}
      {sent ? (
        <p className="mt-4 text-sm text-navy">
          {en ? "WhatsApp should have opened. If not, use the link below." : "WhatsApp खुल गया होगा। नहीं खुला तो नीचे दिए लिंक पर दबाएँ।"}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy px-5 py-3 font-semibold text-ivory">
          <WhatsAppIcon className="size-5" />
          {en ? "Send on WhatsApp" : "WhatsApp पर भेजें"}
        </button>
        <a href={href} className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-3 font-semibold text-navy">
          {en ? "Open the link" : "लिंक से खोलें"}
        </a>
        <a href={PHONE_TEL} className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 py-3 font-semibold text-navy">
          {en ? "Call now" : "अभी कॉल करें"}
        </a>
      </div>
    </form>
  );
}
