import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { CallLink, Eyebrow, Points } from "@/components/bits";
import { Enquiry } from "@/components/enquiry";
import { subjects, presentSubject } from "@/lib/tuition";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/tuition")({
  head: () => ({
    meta: [{ title: "स्कूल ट्यूशन · SK Computer & Education Centre" }],
  }),
  component: TuitionPage,
});

function TuitionPage() {
  const { lang } = useI18n();
  const en = lang === "en";
  const promises = en
    ? [
        "Class 1 to 12",
        "Hindi, English, Mathematics, Science and Social Science",
        "Repair a weak base first, then the new chapter",
        "Small batches, notes and room to ask",
        "Can run alongside a computer course",
        "UP Board or CBSE — the same chapter is taught the way that board asks it",
      ]
    : [
        "कक्षा 1 से 12",
        "हिंदी, अंग्रेज़ी, गणित, विज्ञान, सामाजिक विज्ञान",
        "कमज़ोर आधार को पहले ठीक करना, फिर नया अध्याय",
        "छोटे बैच, नोट्स और सवाल पूछने की जगह",
        "कंप्यूटर कोर्स के साथ भी चल सकता है",
        "UP Board या CBSE — वही अध्याय उस बोर्ड के तरीके से पढ़ाया जाता है",
      ];
  const shown = subjects.map((subject) => presentSubject(subject, lang));
  return (
    <>
      <section className="bg-navy text-ivory">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 md:grid-cols-2">
          <div>
            <Eyebrow>
              <span className="text-gold">School tuition</span>
            </Eyebrow>
            <h1 className="mt-3 font-display text-4xl md:text-6xl">{en ? "Class 1 to 12." : "कक्षा 1 से 12।"}</h1>
            <p className="mt-4 font-display text-2xl text-gold">
              {en ? "Even the weakest student can grow strong." : "कमज़ोर से कमज़ोर विद्यार्थी भी बनेंगे मज़बूत।"}
            </p>
            <p className="mt-4 max-w-xl text-brass">
              {en
                ? "Five subjects. It runs through the session, in the same building as the computer centre, so school and computers sit in one place."
                : "पाँच विषय। अवधि चलती रहती है — सत्र भर। कंप्यूटर सेंटर की ही इमारत में, ताकि स्कूल और कंप्यूटर एक जगह संभल जाएँ।"}
            </p>
            <div className="mt-8">
              <CallLink>{en ? "Call about tuition" : "ट्यूशन के लिए कॉल"}</CallLink>
            </div>
          </div>
          <img
            src="/photos/tuition.jpg"
            alt={en ? "A study desk with notebooks" : "नोटबुक और पढ़ाई की मेज़"}
            className="h-72 w-full rounded-3xl object-cover md:h-96"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-navy">{en ? "How we teach" : "कैसे पढ़ाया जाता है"}</h2>
            <div className="mt-5">
              <Points items={promises} />
            </div>
          </div>
          <div className="rounded-3xl bg-brass p-6 text-navy">
            <p className="text-sm font-semibold tracking-widest uppercase">{en ? "Subjects" : "विषय"}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {shown.map((subject) => (
                <li key={subject.slug}>
                  <a href={`#${subject.slug}`} className="inline-flex min-h-11 items-center rounded-full bg-navy px-4 font-semibold text-ivory">
                    {subject.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm">
              {en
                ? "For class 11–12, take the subjects on your board that the centre is running in that batch. Confirm on a call."
                : "कक्षा 11–12 में वही विषय लें जो आपके बोर्ड में हैं और जो बैच सेंटर पर उस समय चल रहा हो। कॉल पर पक्का कर लें।"}
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-10">
          {shown.map((subject) => (
            <section key={subject.slug} id={subject.slug} className="scroll-mt-28">
              <h2 className="font-display text-3xl text-navy">{subject.name}</h2>
              <p className="mt-2 text-muted">{subject.focus}</p>
              <div className="mt-4 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
                {subject.bands.map((band) => (
                  <details key={band.title} className="group px-5">
                    <summary className="flex min-h-14 items-center justify-between gap-4 py-3 font-semibold text-navy">
                      {band.title}
                      <ChevronDown className="chev size-5 text-muted transition-transform duration-200" />
                    </summary>
                    <ul className="space-y-2 pb-4">
                      {band.points.map((point) => (
                        <li key={point} className="flex gap-3">
                          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-navy" aria-hidden="true" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12">
          <Enquiry preset="School Tuition" />
        </div>
      </section>
    </>
  );
}
