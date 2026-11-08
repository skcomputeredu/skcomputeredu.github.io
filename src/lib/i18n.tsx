import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "en" | "hi";

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
};

const I18nContext = createContext<I18nValue>({ lang: "en", setLang: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("sk-lang");
    if (saved === "hi" || saved === "en") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem("sk-lang", next);
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

const ui = {
  en: {
    skip: "Skip to content",
    home: "Home",
    courses: "Courses",
    tuition: "School Tuition",
    about: "About",
    contact: "Contact",
    registration: "Online Registration",
    downloadForm: "Download Form",
    payFees: "Pay Fees",
    paySlip: "Print Pay Slip",
    admin: "Admin Use Only",
    call: "Call",
    callNow: "Call Now",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    nav: "Main",
    mobileNav: "Mobile",
    wa: "WhatsApp",
    waWrite: "Message on WhatsApp",
    allCourses: "All Courses",
    footerLine: "Computer courses and school coaching from class 1 to 12, under one roof.",
    footerMeta: "Admission open · Certificate · Small batches · Practical lab",
    footerTag: "Learn today. Lead tomorrow.",
    batches: "Morning, afternoon and evening batches. Confirm the time on a call.",
    waHello: "Hello, I would like information about SK Computer & Education Centre.",
    detail: "Full Detail",
    duration: "Duration",
    practical: "Practical",
    syllabus: "Syllabus",
    openPoints: "Open each point",
    openPointsBody: "Tap a number. Inside is the work done in the lab.",
    project: "Project",
    forWhom: "Who it is for",
    after: "After the course",
    certTools: "Certificate and tools",
    feeNote: "Fees start at ₹500. The fee for this course is confirmed on a call.",
    related: "Related courses",
    missing: "This course is not on the list",
    seeAll: "See All Courses",
    callCourse: "Call about this course",
    waCourse: (name: string, duration: string) =>
      `Hello, I would like details of ${name} (${duration}).`,
    notFoundTitle: "This page was not found",
    notFoundBody: "Choose a course, or call directly.",
    notFoundHome: "Back To Home",
    addressLabel: "Address",
  },
  hi: {
    skip: "सामग्री पर जाएँ",
    home: "होम",
    courses: "कोर्सेज",
    tuition: "स्कूल ट्यूशन",
    about: "हमारे बारे में",
    contact: "संपर्क",
    registration: "ऑनलाइन रजिस्ट्रेशन",
    downloadForm: "फ़ॉर्म डाउनलोड",
    payFees: "फीस भरें",
    paySlip: "पे स्लिप प्रिंट",
    admin: "केवल एडमिन",
    call: "कॉल",
    callNow: "अभी कॉल करें",
    menuOpen: "मेनू खोलें",
    menuClose: "मेनू बंद करें",
    nav: "मुख्य",
    mobileNav: "मोबाइल",
    wa: "WhatsApp",
    waWrite: "WhatsApp पर लिखें",
    allCourses: "सभी कोर्स",
    footerLine: "कंप्यूटर कोर्स और कक्षा 1 से 12 की पढ़ाई, एक ही छत के नीचे।",
    footerMeta: "एडमिशन खुला है · सर्टिफिकेट · छोटे बैच · प्रैक्टिकल लैब",
    footerTag: "सीखें आज, सफल बनें कल।",
    batches: "सुबह, दोपहर और शाम के बैच। समय कॉल पर पक्का करें।",
    waHello: "नमस्ते, मैं SK Computer & Education Centre के बारे में जानकारी चाहता/चाहती हूँ।",
    detail: "पूरी डिटेल",
    duration: "अवधि",
    practical: "प्रैक्टिकल",
    syllabus: "सिलेबस",
    openPoints: "हर पॉइंट खोलें",
    openPointsBody: "नंबर पर टैप करें। अंदर वही काम है जो लैब में करवाया जाता है।",
    project: "प्रोजेक्ट",
    forWhom: "किसके लिए",
    after: "कोर्स के बाद",
    certTools: "सर्टिफिकेट और टूल",
    feeNote: "शुरुआती फीस ₹500 से। इस कोर्स की रकम कॉल पर।",
    related: "साथ के कोर्स",
    missing: "यह कोर्स सूची में नहीं है",
    seeAll: "सारे कोर्सेज देखें",
    callCourse: "इस कोर्स के लिए कॉल",
    waCourse: (name: string, duration: string) =>
      `नमस्ते, मुझे ${name} (${duration}) के बारे में जानकारी चाहिए।`,
    notFoundTitle: "यह पेज नहीं मिला",
    notFoundBody: "कोर्स सूची से चुनें, या सीधे कॉल करें।",
    notFoundHome: "होम पर जाएँ",
    addressLabel: "पता",
  },
} as const;

export function useCopy() {
  const { lang } = useI18n();
  return ui[lang];
}
