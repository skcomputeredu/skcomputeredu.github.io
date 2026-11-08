import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BadgeCheck, ChevronDown, Clock, Laptop, MapPin, Users } from "lucide-react";
import { BannerSlider } from "@/components/banner-slider";
import { CallLink, CentreName, CourseGlyph, EmailLink, Eyebrow, SiteLink } from "@/components/bits";
import { SkLogoClassic } from "@/components/logo";
import { categories, courses, presentCourse } from "@/lib/courses";
import { useI18n } from "@/lib/i18n";
import { addressFor, faqs, PHONE_DISPLAY } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: Home,
});

const page = {
  en: {
    admission: "Admission open",
    tagline: "Learn today,",
    tagline2: "lead tomorrow.",
    lead: "Computer courses and school tuition from class 1 to 12 — one centre, practical batches.",
    quote: "“Education is the real wealth.”",
    all: "All courses",
    stats: [
      ["ALL", "Computer courses"],
      ["1–12", "School tuition"],
      ["₹500", "Fees from"],
      ["One Place", "All Courses"],
    ],
    trust: [
      ["Certificate", "An institute certificate when the course is complete"],
      ["Lab practice", "Learn by doing, not only by watching"],
      ["Small batches", "Room left to ask a question"],
      ["Morning to evening", "Confirm the batch time on a call"],
    ],
    catalog: "Catalogue",
    catalogTitle: "Tap a course. The full detail is inside.",
    catalogBody: "Durations follow the centre’s duration list. Syllabus, project and who should join — open any name.",
    tuitionTitle: "School Tuition",
    tuitionSub: "Class 1 to 12 · Hindi, English, Maths, Science, Social Science",
    tuitionTime: "Ongoing",
    featuresEyebrow: "Why this centre",
    featuresTitle: "Open a point. The answer is inside.",
    features: [
      ["Experienced teachers", "Teachers have taught computer courses and school subjects for years, explain every step in simple language, and stay until the student can do the work."],
      ["Practical training", "You learn by working on the computer, not only by listening, with typing, Excel, design, Tally and hardware practised until each step is clear."],
      ["Small batches", "Batches stay small so every student can ask a question, the teacher can see each person’s work, and a missed step is taken up in the next class."],
      ["Notes and material", "Clear class notes and lab files are given with the course, so you can revise the same work at home before the next class."],
      ["Online and offline", "Confirm your batch on a call or WhatsApp, attend the class at the centre, and choose a morning, afternoon or evening time that suits you."],
      ["Computer lab", "Daily practice is on the centre’s computers, a teacher stays in the lab with you, and you do the work on the machine yourself."],
      ["Every age", "School students, homemakers, job seekers and shopkeepers learn in the same calm class, starting from their own level, at any age."],
    ],
    fees: "Fees",
    feesHead: "Starting fees",
    feesBody: "Each course has its own fee. ₹500 is only the starting point. The full amount is told on a call, after the course and batch. Admission is open. Seats are limited.",
    feesCta: `Ask the fee on ${PHONE_DISPLAY}`,
    tuitionBand: "School tuition",
    tuitionQuote: "Even the weakest student can grow strong.",
    faqEyebrow: "Questions",
    faqTitle: "Before you visit",
    ctaBody: "Better education. Brighter future. Tap the number — the call starts.",
    motto: "Learn today. Lead tomorrow.",
    ctaAddress: "Centre address",
    labAlt: "Students in the computer lab",
    designAlt: "Design practice on a screen",
    hardwareAlt: "An open computer and its parts",
    codeAlt: "A programming desk",
    goal: "Your goal",
    duty: "Our responsibility",
    easy: "Easy learning. Bright future.",
  },
  hi: {
    admission: "एडमिशन खुला है",
    tagline: "सीखें आज,",
    tagline2: "सफल बनें कल।",
    lead: "कंप्यूटर कोर्स और कक्षा 1 से 12 की पढ़ाई — एक सेंटर, प्रैक्टिकल बैच।",
    quote: "“शिक्षा ही सच्ची संपत्ति है”",
    all: "सभी कोर्सेज",
    stats: [
      ["ALL", "कंप्यूटर कोर्स"],
      ["1–12", "स्कूल ट्यूशन"],
      ["₹500", "से शुरुआती फीस"],
      ["एक जगह", "सभी कोर्स"],
    ],
    trust: [
      ["सर्टिफिकेट", "कोर्स पूरा होने पर संस्थान का प्रमाण"],
      ["लैब प्रैक्टिस", "देखकर नहीं, करके सीखना"],
      ["छोटे बैच", "सवाल पूछने की जगह बची रहे"],
      ["सुबह से शाम", "बैच का समय कॉल पर पक्का करें"],
    ],
    catalog: "कैटलॉग",
    catalogTitle: "कोर्स छुएँ, अंदर पूरी डिटेल।",
    catalogBody: "अवधि सेंटर की ड्यूरेशन सूची के अनुसार है। सिलेबस, प्रोजेक्ट और किसके लिए है — हर नाम के अंदर।",
    tuitionTitle: "स्कूल ट्यूशन",
    tuitionSub: "कक्षा 1 से 12 · हिंदी, अंग्रेज़ी, गणित, विज्ञान, सामाजिक विज्ञान",
    tuitionTime: "चलता रहता है",
    featuresEyebrow: "हमारी विशेषताएँ",
    featuresTitle: "पॉइंट खोलें। अंदर बात साफ़ है।",
    features: [
      ["अनुभवी एवं प्रशिक्षित शिक्षक", "शिक्षक कंप्यूटर कोर्स और स्कूल के विषय कई साल से पढ़ा रहे हैं, हर कदम आसान भाषा में समझाते हैं, और तब तक साथ रहते हैं जब तक विद्यार्थी खुद काम कर ले।"],
      ["प्रैक्टिकल ट्रेनिंग", "सिर्फ़ सुनकर नहीं, कंप्यूटर पर काम करके सीखा जाता है, और टाइपिंग, Excel, डिज़ाइन, Tally व हार्डवेयर तब तक करवाए जाते हैं जब तक हर कदम साफ़ हो जाए।"],
      ["छोटे बैच", "बैच छोटे रखे जाते हैं ताकि हर विद्यार्थी सवाल पूछ सके, शिक्षक हर किसी का काम देख सकें, और छूटा कदम अगली क्लास में पूरा हो जाए।"],
      ["कंप्यूटर नोट्स एवं मटेरियल", "कोर्स के साथ साफ़ क्लास नोट्स और लैब की फ़ाइलें दी जाती हैं, ताकि अगली क्लास से पहले वही काम घर पर आराम से दोहराया जा सके।"],
      ["ऑनलाइन और ऑफलाइन दोनों", "बैच कॉल या WhatsApp पर पक्का करें, क्लास सेंटर पर आएँ, और सुबह, दोपहर या शाम का समय अपने अनुसार चुनें।"],
      ["कंप्यूटर लैब", "रोज़ की प्रैक्टिस सेंटर के कंप्यूटर पर होती है, शिक्षक लैब में आपके साथ रहते हैं, और काम आप खुद मशीन पर करते हैं।"],
      ["हर उम्र के विद्यार्थी", "स्कूल के विद्यार्थी, गृहिणियाँ, नौकरी की तैयारी करने वाले और दुकानदार एक ही शांत क्लास में, अपने स्तर से, किसी भी उम्र में पढ़ सकते हैं।"],
    ],
    fees: "फीस",
    feesHead: "शुरुआती फीस",
    feesBody: "हर कोर्स की फीस अलग है। ₹500 शुरुआती बात है, पूरी रकम कोर्स और बैच देखकर कॉल पर बताई जाती है। एडमिशन खुला है, सीटें सीमित हैं।",
    feesCta: `${PHONE_DISPLAY} पर फीस पूछें`,
    tuitionBand: "स्कूल ट्यूशन",
    tuitionQuote: "कमज़ोर से कमज़ोर विद्यार्थी भी बनेंगे मज़बूत।",
    faqEyebrow: "सवाल",
    faqTitle: "आने से पहले",
    ctaBody: "बेहतर शिक्षा। उज्ज्वल भविष्य। नंबर छुएँ — कॉल लग जाएगी।",
    motto: "सीखें आज, सफल बनें कल।",
    ctaAddress: "सेंटर का पता",
    labAlt: "कंप्यूटर लैब में पढ़ते विद्यार्थी",
    designAlt: "डिज़ाइन की प्रैक्टिस, रंग और स्क्रीन",
    hardwareAlt: "खुला कंप्यूटर और पार्ट्स",
    codeAlt: "प्रोग्रामिंग की मेज़",
    goal: "आपका लक्ष्य",
    duty: "हमारी जिम्मेदारी",
    easy: "आसान सीखना। उज्ज्वल भविष्य।",
  },
} as const;

const chip = [
  "bg-navy text-ivory",
  "bg-gold text-navy",
  "bg-swoosh text-ivory",
  "bg-brass text-navy",
  "bg-paper text-navy border border-line",
];

function Home() {
  const { lang } = useI18n();
  const c = page[lang];
  const address = addressFor(lang);
  const trustIcons = [BadgeCheck, Laptop, Users, Clock];

  return (
    <>
      <section className="bg-navy text-ivory">
        <div className="bg-gold text-navy">
          <p className="mx-auto max-w-6xl px-5 py-2 text-center text-sm font-semibold">{c.admission}</p>
        </div>
        <div className="grid grid-cols-3" aria-hidden="true">
          <span className="h-1.5 bg-gold" />
          <span className="h-1.5 bg-swoosh" />
          <span className="h-1.5 bg-brass" />
        </div>
        <div className="bg-navy px-4 py-6 md:py-9">
          <div className="mx-auto max-w-5xl text-center">
            <CentreName tone="gold" look="heading" className="text-[clamp(1.55rem,6.2vw,3.35rem)]" />
            <p className="mt-3 text-sm text-brass md:text-base">{address}</p>
            <span className="mx-auto mt-4 block h-1.5 w-36 rounded-full bg-swoosh md:w-56" aria-hidden="true" />
          </div>
        </div>
        <BannerSlider />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 md:grid-cols-2 md:py-16">
          <div>
            <div className="flex items-center gap-3">
              <SkLogoClassic className="size-24 md:size-28" />
              <Eyebrow>
                <span className="text-gold">{c.admission}</span>
              </Eyebrow>
            </div>
            <h1 className="mt-4">
              <CentreName tone="gold" look="display" className="text-[clamp(1.9rem,6.5vw,3.5rem)]" />
            </h1>
            <p className="mt-4 flex items-start gap-2 text-brass">
              <MapPin className="mt-1 size-4 shrink-0 text-gold" aria-hidden="true" />
              <span>{address}</span>
            </p>
            <p className="mt-2 pl-6">
              <SiteLink className="text-gold" />
            </p>
            <p className="mt-1 pl-6">
              <EmailLink className="text-brass" iconClassName="size-4 text-gold" />
            </p>
            <p className="mt-5 font-display text-3xl text-ivory">
              {c.tagline} <span className="italic text-gold">{c.tagline2}</span>
            </p>
            <p className="mt-4 max-w-xl text-lg text-brass">{c.lead}</p>
            <p className="mt-3 font-display text-xl text-ivory">{c.quote}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CallLink />
              <Link
                to="/courses"
                search={{ cat: "all" }}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ivory/30 bg-ivory/10 px-5 py-3 font-semibold text-ivory"
              >
                {c.all}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <dl className="mt-10 grid grid-cols-2 gap-3">
              {c.stats.map(([value, label], index) => {
                const tile = ["bg-gold text-navy", "bg-ivory text-navy", "bg-swoosh text-ivory", "bg-brass text-navy"][index];
                return (
                  <div key={label} className={`rounded-2xl px-4 py-3 ${tile}`}>
                    <dt className={`font-display leading-none ${value.length > 6 ? "text-2xl" : "text-3xl"}`}>{value}</dt>
                    <dd className="text-sm">{label}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
          <div className="relative">
            <img src="/banners/lab.jpg" alt={c.labAlt} loading="lazy" decoding="async" className="h-80 w-full rounded-3xl object-cover md:h-96" />
            <div className="absolute right-4 bottom-4 left-4 rounded-2xl border-4 border-gold bg-paper p-4 text-ink md:right-auto md:max-w-xs">
              <p className="text-xs font-semibold tracking-widest text-gold-deep uppercase">{c.goal}</p>
              <p className="mt-1 font-display text-2xl text-navy">{c.duty}</p>
              <p className="mt-1 text-sm text-muted">{c.easy}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 sm:grid-cols-2 lg:grid-cols-4">
          {c.trust.map(([title, body], index) => {
            const Icon = trustIcons[index] ?? BadgeCheck;
            return (
              <div key={title} className="flex gap-3">
                <span className={`mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-2xl ${index % 2 ? "bg-gold text-navy" : "bg-navy text-gold"}`}>
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-navy">{title}</p>
                  <p className="text-sm text-muted">{body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 md:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{c.catalog}</Eyebrow>
            <h2 className="font-plain mt-2 text-4xl font-bold text-navy md:text-5xl">{c.catalogTitle}</h2>
          </div>
          <p className="max-w-md text-muted">{c.catalogBody}</p>
        </div>
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories
            .filter((category) => category.id !== "all")
            .map((category, index) => (
              <Link
                key={category.id}
                to="/courses"
                search={{ cat: category.id }}
                className={`min-h-11 shrink-0 rounded-full px-4 py-3 text-sm font-semibold ${chip[index % chip.length]}`}
              >
                {category.label[lang]}
              </Link>
            ))}
        </div>
        <ol className="mt-6 divide-y divide-line overflow-hidden rounded-3xl border border-line bg-paper">
          {courses.map((course) => {
            const view = presentCourse(course, lang);
            return (
              <li key={course.slug}>
                <Link
                  to="/course/$slug"
                  params={{ slug: course.slug }}
                  className="flex min-h-16 items-center gap-4 px-4 py-4 hover:bg-ivory md:px-6"
                >
                  <span
                    className={`w-8 font-display text-lg tabular-nums ${["text-gold-deep", "text-navy", "text-swoosh"][Number(course.code) % 3]}`}
                  >
                    {course.code}
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-ivory text-navy">
                    <CourseGlyph slug={course.slug} className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-navy">{course.name}</span>
                    <span className="block text-sm text-muted">{course.hindi}</span>
                  </span>
                  <span className="hidden text-sm font-semibold text-gold-deep sm:block">{view.duration}</span>
                  <ArrowRight className="size-4 shrink-0 text-navy" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
          <li>
            <Link to="/tuition" className="flex min-h-16 items-center gap-4 bg-brass/40 px-4 py-4 hover:bg-brass md:px-6">
              <span className="w-8 font-display text-lg text-navy">T</span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-navy">{c.tuitionTitle}</span>
                <span className="block text-sm text-muted">{c.tuitionSub}</span>
              </span>
              <span className="hidden text-sm font-semibold text-gold-deep sm:block">{c.tuitionTime}</span>
              <ArrowRight className="size-4 shrink-0 text-navy" aria-hidden="true" />
            </Link>
          </li>
        </ol>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
          <div>
            <img src="/banners/design.jpg" alt={c.designAlt} loading="lazy" decoding="async" className="h-72 w-full rounded-3xl object-cover" />
            <div className="mt-4 grid grid-cols-2 gap-4">
              <img src="/photos/hardware-networking.jpg" alt={c.hardwareAlt} loading="lazy" decoding="async" className="h-40 w-full rounded-3xl object-cover" />
              <img src="/photos/c-cpp.jpg" alt={c.codeAlt} loading="lazy" decoding="async" className="h-40 w-full rounded-3xl object-cover" />
            </div>
          </div>
          <div>
            <Eyebrow>{c.featuresEyebrow}</Eyebrow>
            <h2 className="mt-2 font-display text-4xl text-navy">{c.featuresTitle}</h2>
            <div className="mt-6 divide-y divide-line border-y border-line">
              {c.features.map(([title, body], index) => (
                <details key={title} className="group">
                  <summary className="flex min-h-14 items-center gap-4 py-3">
                    <span className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${index % 2 ? "bg-gold text-navy" : "bg-navy text-ivory"}`}>
                      {index + 1}
                    </span>
                    <span className="flex-1 font-semibold text-navy">{title}</span>
                    <ChevronDown className="chev size-5 text-muted transition-transform duration-200" />
                  </summary>
                  <p className="pb-4 pl-12 text-ink">{body}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-16 md:grid-cols-5 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-navy p-7 text-ivory md:col-span-3">
          <div className="absolute inset-x-0 top-0 grid grid-cols-3" aria-hidden="true">
            <span className="h-2 bg-gold" />
            <span className="h-2 bg-swoosh" />
            <span className="h-2 bg-[#2f6fe0]" />
          </div>
          <div className="pointer-events-none absolute -top-8 -right-8 size-36 rounded-full bg-swoosh/50" aria-hidden="true" />
          <div className="pointer-events-none absolute -bottom-12 left-10 size-40 rounded-full bg-gold/35" aria-hidden="true" />
          <div className="relative">
            <Eyebrow>
              <span className="text-gold">{c.fees}</span>
            </Eyebrow>
            <h2 className="font-plain mt-3 text-4xl font-bold md:text-5xl">
              {c.feesHead}{" "}
              <span className="inline-block rounded-xl bg-gold px-2.5 text-navy shadow-[4px_4px_0_#e07028]">₹500</span>
            </h2>
            <p className="mt-4 max-w-lg text-brass">{c.feesBody}</p>
            <div className="mt-8">
              <CallLink>{c.feesCta}</CallLink>
            </div>
          </div>
        </div>
        <Link to="/tuition" className="relative overflow-hidden rounded-3xl md:col-span-2">
          <img src="/banners/tuition.jpg" alt="" loading="lazy" decoding="async" className="h-full min-h-64 w-full object-cover" />
          <span className="absolute inset-0 bg-navy/55" />
          <span className="absolute inset-x-0 bottom-0 p-6 text-ivory">
            <span className="block text-sm text-gold">{c.tuitionBand}</span>
            <span className="mt-1 block font-display text-3xl">{c.tuitionQuote}</span>
          </span>
        </Link>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-8">
        <Eyebrow>{c.faqEyebrow}</Eyebrow>
        <h2 className="mt-2 font-display text-4xl text-navy">{c.faqTitle}</h2>
        <div className="mt-6 divide-y divide-line rounded-3xl border border-line bg-paper px-5">
          {faqs.map((faq) => (
            <details key={faq.q.en} className="group">
              <summary className="flex min-h-14 items-center justify-between gap-4 py-4 font-semibold text-navy">
                {faq.q[lang]}
                <ChevronDown className="chev size-5 shrink-0 text-muted transition-transform duration-200" />
              </summary>
              <p className="pb-4 text-ink">{faq.a[lang]}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="rounded-3xl border border-gold bg-paper px-6 py-8 md:flex md:items-center md:justify-between md:px-10">
          <div>
            <h2 className="font-display text-3xl text-navy">{c.motto}</h2>
            <p className="mt-2 text-muted">{c.ctaBody}</p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-0">
            <CallLink />
            <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full border border-line px-5 py-3 font-semibold text-navy">
              {c.ctaAddress}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
