import { createFileRoute } from "@tanstack/react-router";
import { Phone } from "lucide-react";
import { CentreName } from "@/components/bits";
import { useI18n } from "@/lib/i18n";
import { addressFor, PHONE_DISPLAY } from "@/lib/site";

export const Route = createFileRoute("/download")({
  head: () => ({
    meta: [{ title: "Download form · SK Computer & Education Centre" }],
  }),
  component: DownloadPage,
});

function DownloadPage() {
  const { lang } = useI18n();
  const en = lang === "en";
  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
      <h1 className="font-display text-4xl text-navy md:text-6xl">{en ? "Download the form" : "फ़ॉर्म डाउनलोड"}</h1>
      <p className="mt-4 max-w-2xl text-lg text-ink">
        {en
          ? "Same admission form, for a pen. One letter in each box. Download the PDF, fill it, and submit it at the centre."
          : "वही एडमिशन फ़ॉर्म, पेन से भरने के लिए। हर बॉक्स में एक अक्षर। PDF डाउनलोड करें, भरें, और सेंटर में जमा करें।"}
      </p>
      <a
        href="/admission-form.pdf"
        download="SK-Computer-Classes-Admission-Form.pdf"
        className="no-print mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 py-3 font-semibold text-ivory"
      >
        {en ? "Download PDF" : "PDF डाउनलोड करें"}
      </a>

      <article className="a4-sheet print-form mt-8 bg-white p-5 text-ink md:p-8">
        <header className="border-b-2 border-navy pb-3 text-center">
          <h2>
            <CentreName look="plain" className="text-[clamp(1.15rem,3.4vw,1.7rem)]" />
          </h2>
          <p className="a4-meta mt-2">
            <span>{addressFor(lang)}</span>
            <span className="inline-flex items-center gap-1 font-semibold whitespace-nowrap text-navy">
              <Phone className="size-3.5 text-gold-deep" aria-hidden="true" />
              {PHONE_DISPLAY}
            </span>
          </p>
        </header>
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-display text-2xl text-navy">प्रवेश फ़ॉर्म</p>
            <p className="text-sm text-gold-deep">Admission form · One letter in each box</p>
          </div>
          <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border border-gold text-center text-xs text-muted">
            फोटो
            <br />
            Photo
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <Field label="विद्यार्थी का पूरा नाम · Student’s full name" boxes={26} />
          <Ticks label="लिंग · Gender" options={["पुरुष Male", "महिला Female", "अन्य Other"]} />
          <div>
            <p className="text-sm font-semibold text-navy">जन्म तिथि · Date of birth</p>
            <div className="mt-1 flex flex-wrap gap-3">
              <Group caption="दिन DD" n={2} />
              <Group caption="माह MM" n={2} />
              <Group caption="वर्ष YYYY" n={4} />
            </div>
          </div>
          <Field label="स्थान · Place" boxes={22} />
          <Field label="धर्म · Religion" boxes={16} />
          <Field label="जाति · Caste" boxes={16} />
          <Ticks label="वर्ग · Category" options={["General", "OBC", "SC", "ST"]} />
          <Field label="पिता का नाम · Father’s name" boxes={26} />
          <Field label="माता का नाम · Mother’s name" boxes={26} />
          <Field label="पिता / अभिभावक का व्यवसाय · Occupation" boxes={26} />
          <Field label="शिक्षा की डिटेल · Education detail" boxes={26} />
          <Field label="स्कूल या कॉलेज · School or college" boxes={26} />
          <Ticks label="बोर्ड · Board" options={["UP Board", "CBSE", "ICSE", "अन्य Other"]} />
          <Field label="जिस कोर्स के लिए आवेदन है · Course applied for" boxes={26} />
          <Field label="पूरा पता · Full address" boxes={32} />
          <Field label="पता जारी · Address continued" boxes={32} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="पिन कोड · PIN" boxes={6} />
            <Field label="मोबाइल · Mobile" boxes={10} />
          </div>
          <Field label="ईमेल · Email" boxes={28} />
          <Ticks label="कंप्यूटर का ज्ञान · Computer knowledge" options={["अभी नहीं None", "थोड़ा A little", "चलाया है Used one"]} />
          <Ticks label="पसंदीदा बैच · Preferred batch" options={["सुबह Morning", "दोपहर Afternoon", "शाम Evening"]} />
          <Field label="दस्तावेज़ का नाम · Document attached" boxes={26} />
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex h-28 items-end rounded-2xl border border-gold p-3 text-sm text-navy">
            आवेदक का हस्ताक्षर · Applicant’s signature
          </div>
          <div className="flex h-28 items-end rounded-2xl border border-gold p-3 text-sm text-navy">
            माता-पिता / अभिभावक का हस्ताक्षर · Parent’s signature
          </div>
        </div>
      </article>
    </div>
  );
}

function Field({ label, boxes }: { label: string; boxes: number }) {
  return (
    <div>
      <p className="text-sm font-semibold text-navy">{label}</p>
      <Boxes n={boxes} />
    </div>
  );
}

function Group({ caption, n }: { caption: string; n: number }) {
  return (
    <div>
      <Boxes n={n} />
      <p className="mt-1 text-xs text-muted">{caption}</p>
    </div>
  );
}

function Boxes({ n }: { n: number }) {
  return (
    <div className="mt-1 flex max-w-full flex-wrap gap-0.5">
      {Array.from({ length: n }, (_, index) => (
        <span key={index} className="size-5 border border-navy bg-white sm:size-6" />
      ))}
    </div>
  );
}

function Ticks({ label, options }: { label: string; options: string[] }) {
  return (
    <div>
      <p className="text-sm font-semibold text-navy">{label}</p>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2">
        {options.map((option) => (
          <span key={option} className="inline-flex items-center gap-2 text-sm text-ink">
            <span className="size-4 border border-navy bg-white" />
            {option}
          </span>
        ))}
      </div>
    </div>
  );
}
