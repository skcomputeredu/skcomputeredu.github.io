import type { Lang } from "@/lib/i18n";

export const PHONE_DISPLAY = "8410932860";
export const PHONE_TEL = "tel:+918410932860";
export const WHATSAPP_BASE = "https://wa.me/918410932860";

export const ADDRESS_EN = "Defence Colony, Air Force Gate, Izzat Nagar, Bareilly, UP-243122";
export const ADDRESS_HI = "डिफेंस कॉलोनी, एयर फ़ोर्स गेट, इज़्ज़त नगर, बरेली, UP-243122";
export const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Defence+Colony+Air+Force+Gate+Izzat+Nagar+Bareilly";

export const CENTRE_NAME = "SK Computer & Education Centre";
export const SITE_HOST = "skcomputeredu.github.io";
export const SITE_URL = "https://skcomputeredu.github.io";
export const SITE_LABEL = "skcomputeredu.github.io";
export const EMAIL = "skcomputeronline12@gmail.com";
export const EMAIL_MAILTO = "mailto:skcomputeronline12@gmail.com";
export const UPI_ID = "sksir@ptaxis";
export const UPI_PAY = "upi://pay?pa=sksir@ptaxis&pn=SK%20Computer%20%26%20Education%20Centre&cu=INR";

export function whatsappLink(text: string) {
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

export function addressFor(lang: Lang) {
  return lang === "hi" ? ADDRESS_HI : ADDRESS_EN;
}

export const faqs: { q: Record<Lang, string>; a: Record<Lang, string> }[] = [
  {
    q: { en: "What are the fees?", hi: "फीस कितनी लगती है?" },
    a: {
      en: "Fees start at ₹500. Each course depends on duration, batch and online or offline mode. The exact amount is given on a call or WhatsApp — nothing hidden.",
      hi: "शुरुआती फीस ₹500 से शुरू होती है। हर कोर्स की फीस अवधि, बैच और ऑनलाइन या ऑफलाइन मोड पर निर्भर करती है। सटीक रकम कॉल या WhatsApp पर उसी समय बता दी जाती है — कोई छिपा शुल्क नहीं।",
    },
  },
  {
    q: { en: "Is a certificate given?", hi: "क्या सर्टिफिकेट मिलता है?" },
    a: {
      en: "An institute certificate is given when a computer course is completed. NIELIT conducts the CCC and O Level exams. We prepare you on that pattern. Form and exam fee are explained in counselling.",
      hi: "कंप्यूटर कोर्स पूरा करने पर संस्थान का सर्टिफिकेट दिया जाता है। CCC और O Level सरकारी परीक्षाएँ NIELIT आयोजित करता है। हम पैटर्न के अनुसार तैयारी कराते हैं। परीक्षा फ़ॉर्म और शुल्क काउंसलिंग में साफ़ बताए जाते हैं।",
    },
  },
  {
    q: { en: "I have never used a computer. Can I join?", hi: "मैंने कभी कंप्यूटर नहीं छुआ। क्या मैं आ सकता हूँ?" },
    a: {
      en: "Yes. Basic Computer starts from zero — mouse, keyboard and files. In a small batch the teacher sits with you for the practical.",
      hi: "हाँ। Basic Computer बिलकुल शून्य से शुरू होता है — माउस, कीबोर्ड और फाइल से। छोटे बैच में शिक्षक साथ बैठकर प्रैक्टिकल करवाते हैं।",
    },
  },
  {
    q: { en: "Are classes online?", hi: "ऑनलाइन क्लास होती है?" },
    a: {
      en: "Both online and offline are available. Lab courses need offline practice. Which batch fits your time is settled on a call.",
      hi: "ऑनलाइन और ऑफलाइन दोनों की सुविधा है। लैब वाले कोर्स में ऑफलाइन प्रैक्टिकल ज़रूरी रहता है। कौन सा बैच आपके समय पर है, यह कॉल पर तय होता है।",
    },
  },
  {
    q: { en: "Which subjects does school tuition cover?", hi: "स्कूल ट्यूशन किन विषयों में है?" },
    a: {
      en: "Class 1 to 12: Hindi, English, Mathematics, Science and Social Science. UP Board or CBSE — the chapter is taught the way that board asks it.",
      hi: "कक्षा 1 से 12 तक हिंदी, अंग्रेजी, गणित, विज्ञान और सामाजिक विज्ञान। UP Board या CBSE — वही अध्याय उस बोर्ड के तरीके से पढ़ाया जाता है।",
    },
  },
  {
    q: { en: "Are notes and material given?", hi: "नोट्स और मटेरियल मिलता है?" },
    a: {
      en: "Yes. Course notes and practical material are given so you can revise at home.",
      hi: "हाँ। कोर्स के नोट्स और प्रैक्टिकल मटेरियल दिए जाते हैं, ताकि क्लास के बाद घर पर भी दोहराया जा सके।",
    },
  },
  {
    q: { en: "How do I take admission?", hi: "एडमिशन कैसे होगा?" },
    a: {
      en: "Call, WhatsApp, or visit the Defence Colony centre. Course counselling is free. Confirm the batch and fee, then class starts.",
      hi: "कॉल करें, WhatsApp करें, या डिफेंस कॉलोनी सेंटर पर आ जाएँ। कोर्स चुनने की सलाह मुफ़्त है। बैच और फीस पक्की करके क्लास शुरू।",
    },
  },
  {
    q: { en: "What are the timings?", hi: "समय क्या रहता है?" },
    a: {
      en: "Morning, afternoon and evening batches run. Confirm the clock on a call — seats are limited.",
      hi: "सुबह, दोपहर और शाम के बैच चलते हैं। सटीक घड़ी कॉल पर पक्की करें — सीट सीमित रहती है, इसलिए जल्दी बात कर लेना बेहतर है।",
    },
  },
];
