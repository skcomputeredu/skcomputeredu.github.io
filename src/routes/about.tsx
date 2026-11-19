import { createFileRoute, Link } from "@tanstack/react-router";
import { CallLink, EmailLink, Points, SiteLink, WhatsAppIcon } from "@/components/bits";
import { useI18n } from "@/lib/i18n";
import { addressFor } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [{ title: "हमारे बारे में · SK Computer & Education Centre" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { lang } = useI18n();
  const en = lang === "en";
  return (
    <div className="mx-auto max-w-6xl px-5 py-14">
      <SiteLink className="text-sm text-gold-deep" />
      <h1 className="mt-3 max-w-3xl font-display text-4xl text-navy md:text-6xl">
        {en ? "One Centre. Computers And School Study." : "एक सेंटर। कंप्यूटर और स्कूल की पढ़ाई।"}
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-ink">
        {en
          ? "SK Computer & Education Centre is at Defence Colony, Air Force Gate, Izzat Nagar, Bareilly, UP-243122. Courses run from Basic Computer to O Level, plus five subjects from class 1 to 12."
          : "SK Computer & Education Centre डिफेंस कॉलोनी, एयर फ़ोर्स गेट, इज़्ज़त नगर, बरेली (UP)-243122 में है। यहाँ बेसिक कंप्यूटर से O Level तक के कोर्स हैं, और कक्षा 1 से 12 के पाँच विषय।"}
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <img src="/photos/lab.jpg" alt={en ? "Rows of systems in the lab" : "लैब में सिस्टम की पंक्तियाँ"} className="h-56 w-full rounded-3xl object-cover md:col-span-2 md:h-80" />
        <img src="/photos/tuition.jpg" alt={en ? "Study notebooks" : "पढ़ाई की नोटबुक"} className="h-56 w-full rounded-3xl object-cover md:h-80" />
      </div>

      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <section>
          <h2 className="font-display text-3xl text-navy">{en ? "How we teach" : "पढ़ाने का तरीका"}</h2>
          <div className="mt-4">
            <Points
              items={
                en
                  ? [
                      "See where a student is stuck, then the next chapter",
                      "Practical the same day, notes with it",
                      "A small batch so work can be checked by name",
                      "Online when the course can live on a screen; lab work at the centre",
                      "Fees start at ₹500 — the rest depends on the course, stated clearly on a call",
                    ]
                  : [
                      "पहले यह देखना कि विद्यार्थी कहाँ अटका है, फिर अगला अध्याय",
                      "प्रैक्टिकल उसी दिन, नोट्स साथ में",
                      "छोटा बैच ताकि नाम पुकारकर काम देखा जा सके",
                      "ऑनलाइन तब, जब कोर्स स्क्रीन से बनता हो; लैब वाला काम सेंटर पर",
                      "फीस शुरू ₹500 से — बाकी कोर्स के हिसाब से, कॉल पर साफ़",
                    ]
              }
            />
          </div>
        </section>
        <section className="rounded-3xl bg-navy p-7 text-ivory">
          <h2 className="font-display text-3xl">{en ? "What we do not promise" : "जो हम वादा नहीं करते"}</h2>
          <div className="mt-4">
            <Points
              tone="ivory"
              items={
                en
                  ? [
                      "A false promise of a job overnight",
                      "We do not issue the NIELIT exam — we prepare you for CCC and O Level",
                      "Not every class 11–12 subject runs in every batch. Counselling says so.",
                    ]
                  : [
                      "रातभर में नौकरी का झूठा वादा",
                      "NIELIT की परीक्षा हम खुद जारी नहीं करते — CCC और O Level की तैयारी कराते हैं",
                      "कक्षा 11–12 का हर विषय हर बैच में न भी हो, तो काउंसलिंग में बता देते हैं",
                    ]
              }
            />
          </div>
          <p className="mt-6 text-brass">
            {en ? "Your goal is our responsibility — with honesty, not noise." : "आपका लक्ष्य हमारी जिम्मेदारी — ईमानदारी से, शोर से नहीं।"}
          </p>
        </section>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-navy">{en ? "Welcome to SK Computer and Education Center" : "SK Computer and Education Center में आपका स्वागत है"}</h2>
        <p className="mt-4 max-w-3xl text-sm leading-6 text-ink">
          {en
            ? "SK Computer and Education Center, situated near Air Force Gate, Defence Colony, Izzatnagar, Bareilly, is a premier computer training and skill development institute committed to empowering students, job seekers, and working professionals with practical, industry-relevant IT education. Since our inception, we have focused on bridging the digital divide by offering high-quality, career-oriented computer programs at affordable fees."
            : "SK Computer and Education Center, एयर फ़ोर्स गेट, डिफेंस कॉलोनी, इज़्ज़तनगर, बरेली के पास, विद्यार्थियों, नौकरी चाहने वालों और कामकाजी लोगों को व्यावहारिक कंप्यूटर शिक्षा देता है। शुरुआत से ही हम कम फीस पर करियर वाले कंप्यूटर प्रोग्राम देते आ रहे हैं।"}
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-line bg-paper p-6">
            <h3 className="font-display text-2xl text-navy">{en ? "Our Mission" : "हमारा उद्देश्य"}</h3>
            <p className="mt-3 text-sm leading-6 text-ink">
              {en
                ? "Our mission is to equip learners from every background with strong digital literacy, hands-on technical proficiency, and professional confidence so they can excel in competitive government examinations, private-sector careers, and modern entrepreneurship."
                : "हर पृष्ठभूमि के विद्यार्थी को डिजिटल साक्षरता, हाथ से किया हुआ अभ्यास और आत्मविश्वास देना, ताकि वे सरकारी परीक्षा, प्राइवेट नौकरी और अपना काम संभाल सकें।"}
            </p>
          </article>
          <article className="rounded-3xl border border-line bg-paper p-6">
            <h3 className="font-display text-2xl text-navy">{en ? "Our Vision" : "हमारी दृष्टि"}</h3>
            <p className="mt-3 text-sm leading-6 text-ink">
              {en
                ? "To be recognized as a leading center of excellence in computer education and vocational skill training in Bareilly and surrounding regions, fostering continuous learning, technological innovation, and complete career readiness."
                : "बरेली और आस-पास के इलाके में कंप्यूटर शिक्षा और कौशल प्रशिक्षण का भरोसेमंद केंद्र बनना, जहाँ पढ़ाई जारी रहे और करियर के लिए तैयारी पूरी हो।"}
            </p>
          </article>
        </div>
        <h3 className="mt-8 font-display text-2xl text-navy">{en ? "Courses and Programs Offered" : "कोर्स और प्रोग्राम"}</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {(en
            ? [
                ["1. Basic & Office Automation", "Basic Computer Course (BCC), Course on Computer Concepts (CCC), and the complete MS Office Suite (MS Word, MS Excel, MS PowerPoint, and Internet Applications) for everyday office work and government exam eligibility."],
                ["2. Diploma Courses", "Advanced Diploma in Computer Applications (ADCA), Diploma in Computer Applications (DCA), Diploma in Financial Accounting (DFA), Diploma in Desktop Publishing (DTP), and Post Graduate Diploma in Computer Applications (PGDCA)."],
                ["3. Accounting & Financial Management", "Tally Prime with GST, Payroll Management, Inventory Control, Taxation, and E-Filing for aspiring accountants and commerce students."],
                ["4. Programming & Web Development", "C, C++, Python, Java, HTML5, CSS3, JavaScript, and responsive Web Designing for modern IT careers."],
                ["5. Graphic Designing & Multimedia", "Adobe Photoshop, CorelDRAW, Adobe Illustrator, and digital publishing tools for print, branding, and digital marketing."],
                ["6. Typing & Skill Development", "English and Hindi Typing (Kruti Dev and Mangal) for SSC, UPSSSC, High Court, and state-level competitive examinations."],
              ]
            : [
                ["1. बेसिक और ऑफिस", "BCC, CCC, और MS Word, MS Excel, MS PowerPoint तथा इंटरनेट — रोज़ के ऑफिस काम और सरकारी परीक्षा के लिए।"],
                ["2. डिप्लोमा", "ADCA, DCA, DFA, DTP और PGDCA।"],
                ["3. अकाउंटिंग", "Tally Prime with GST, पेरोल, इन्वेंटरी, टैक्स और ई-फाइलिंग।"],
                ["4. प्रोग्रामिंग और वेब", "C, C++, Python, Java, HTML5, CSS3, JavaScript और वेब डिज़ाइन।"],
                ["5. ग्राफ़िक डिज़ाइन", "Photoshop, CorelDRAW, Illustrator और डिजिटल पब्लिशिंग।"],
                ["6. टाइपिंग", "अंग्रेज़ी और हिन्दी टाइपिंग (Kruti Dev और Mangal) — SSC, UPSSSC और कोर्ट की परीक्षाओं के लिए।"],
              ]
          ).map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-line bg-paper p-4">
              <h4 className="font-plain text-sm font-bold text-navy">{title}</h4>
              <p className="mt-2 text-xs leading-5 text-ink">{body}</p>
            </article>
          ))}
        </div>
        <h3 className="mt-8 font-display text-2xl text-navy">{en ? "Why Choose SK Computer and Education Center?" : "यह सेंटर क्यों चुनें?"}</h3>
        <div className="mt-4">
          <Points
            items={
              en
                ? [
                    "Experienced and supportive faculty, with academic and real-world experience",
                    "Practical lab sessions, with a system for hands-on practice",
                    "Syllabus revised for current software, government exams, and office work",
                    "Clear and affordable fees, with a ₹500 online registration fee to reserve a seat",
                    "A certificate after the course is completed and assessed",
                  ]
                : [
                    "अनुभवी शिक्षक, पढ़ाई और व्यावहारिक काम दोनों के साथ",
                    "लैब में प्रैक्टिकल, हर विद्यार्थी को सिस्टम पर अभ्यास",
                    "सिलेबस नए सॉफ़्टवेयर, सरकारी परीक्षा और ऑफिस काम के अनुसार",
                    "साफ़ और कम फीस, सीट के लिए ₹500 ऑनलाइन रजिस्ट्रेशन",
                    "कोर्स पूरा होने और जाँच के बाद सर्टिफिकेट",
                  ]
            }
          />
        </div>
        <div className="mt-4 space-y-1 text-xs leading-5 text-muted">
          {en ? (
            <>
              <p className="text-sm font-bold leading-6 text-black">Working hours: Monday to Saturday, 8:00 AM – 8:00 PM.</p>
              <p className="text-sm font-bold leading-6 text-black">Sunday closed.</p>
              <p>Last updated: November 1, 2026.</p>
            </>
          ) : (
            <>
              <p className="text-sm font-bold leading-6 text-black">समय: सोमवार से शनिवार, सुबह 8 से रात 8 बजे।</p>
              <p className="text-sm font-bold leading-6 text-black">रविवार बंद।</p>
            </>
          )}
        </div>
      </section>

      <section className="mt-12 rounded-3xl border border-line bg-paper p-7">
        <h2 className="font-display text-3xl text-navy">{en ? "Address" : "पता"}</h2>
        <div className="mt-3 flex flex-col gap-1.5 text-lg leading-7">
          <p>{addressFor(lang)}</p>
          <p className="inline-flex items-center gap-2 text-navy">
            <WhatsAppIcon className="size-5 shrink-0" />
            <span>WhatsApp: +91 8410932860</span>
          </p>
          <EmailLink className="text-navy" iconClassName="size-5 text-gold-deep" />
          <SiteLink className="text-gold-deep" />
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <CallLink />
          <Link to="/contact" className="inline-flex min-h-11 items-center rounded-full border border-line px-5 font-semibold text-navy">
            {en ? "Contact form" : "संपर्क फ़ॉर्म"}
          </Link>
        </div>
      </section>
    </div>
  );
}
