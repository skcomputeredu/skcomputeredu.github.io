import { createFileRoute, Link } from "@tanstack/react-router";
import { CallLink, EmailLink, Points, SiteLink } from "@/components/bits";
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

      <section className="mt-12 rounded-3xl border border-line bg-paper p-7">
        <h2 className="font-display text-3xl text-navy">{en ? "Address" : "पता"}</h2>
        <p className="mt-3 text-lg">{addressFor(lang)}</p>
        <div className="mt-4 flex flex-col items-start gap-2">
          <SiteLink className="text-gold-deep" />
          <EmailLink className="text-navy" iconClassName="size-5 text-gold-deep" />
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
