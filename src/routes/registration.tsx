import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { WhatsAppIcon } from "@/components/bits";
import { FeeMethods } from "@/components/fee-pay";
import { FilledForm } from "@/components/filled-form";
import { readFeeGate, readManagerSign, readSignGate, readUploadGates, submitAdmission, type AdmissionForm } from "@/lib/admissions";
import { courses, presentCourse } from "@/lib/courses";
import { useI18n } from "@/lib/i18n";
import { PHONE_TEL, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/registration")({
  head: () => ({
    meta: [{ title: "Registration · SK Computer & Education Centre" }],
  }),
  component: RegistrationPage,
});

type Draft = {
  course: string;
  student: string;
  gender: string;
  marital: string;
  dob: string;
  birthPlace: string;
  religion: string;
  caste: string;
  category: string;
  aadhaar: string;
  father: string;
  mother: string;
  husband: string;
  occupation: string;
  qualification: string;
  school: string;
  board: string;
  passingYear: string;
  marksGot: string;
  marksTotal: string;
  percentage: string;
  address: string;
  pin: string;
  mobile: string;
  email: string;
  knowledge: string;
  batch: string;
};

const empty: Draft = {
  course: "",
  student: "",
  gender: "",
  marital: "",
  dob: "",
  birthPlace: "",
  religion: "",
  caste: "",
  category: "",
  aadhaar: "",
  father: "",
  mother: "",
  husband: "",
  occupation: "",
  qualification: "",
  school: "",
  board: "",
  passingYear: "",
  marksGot: "",
  marksTotal: "",
  percentage: "",
  address: "",
  pin: "",
  mobile: "",
  email: "",
  knowledge: "",
  batch: "",
};

const jobs = [
  ["Business", "व्यवसाय"],
  ["Self Employee", "स्वरोजगार"],
  ["Government Employee", "सरकारी कर्मचारी"],
  ["Private Job", "प्राइवेट नौकरी"],
  ["Others", "अन्य"],
] as const;

const classes = [
  ["Below Class 6", "कक्षा 6 से नीचे"],
  ["Class 6", "कक्षा 6"],
  ["Class 7", "कक्षा 7"],
  ["Class 8", "कक्षा 8"],
  ["Class 9", "कक्षा 9"],
  ["Class 10", "कक्षा 10"],
  ["Class 11", "कक्षा 11"],
  ["Class 12", "कक्षा 12"],
  ["Graduate", "स्नातक"],
  ["Post Graduate", "स्नातकोत्तर"],
  ["Diploma", "डिप्लोमा"],
] as const;

function percent(got: string, total: string) {
  if (!got || !total) return "";
  const a = Number(got);
  const b = Number(total);
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= 0) return "";
  return `${((a / b) * 100).toFixed(2)}%`;
}

const unpaid: {
  paymentStatus: "Paid" | "Not paid";
  paymentMethod: string;
  paymentAmount: string;
  paymentAt: string;
  payerUpi: string;
} = {
  paymentStatus: "Not paid",
  paymentMethod: "",
  paymentAmount: "",
  paymentAt: "",
  payerUpi: "",
};

const field =
  "min-h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base text-ink outline-none focus:border-navy";

type Upload = { name: string; url: string; image: boolean };

function RegistrationPage() {
  const { lang } = useI18n();
  const en = lang === "en";
  const [draft, setDraft] = useState<Draft>(empty);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [studentSign, setStudentSign] = useState(false);
  const [parentSign, setParentSign] = useState(false);
  const [photo, setPhoto] = useState<Upload | null>(null);
  const [paper, setPaper] = useState<Upload | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<Upload | null>(null);
  const [signFile, setSignFile] = useState<Upload | null>(null);
  const [fileNote, setFileNote] = useState("");
  const [slotNote, setSlotNote] = useState<Partial<Record<"photo" | "doc" | "aadhaar" | "sign", string>>>({});
  const [saving, setSaving] = useState(false);
  const [sheet, setSheet] = useState<AdmissionForm | null>(null);
  const [peek, setPeek] = useState<Partial<AdmissionForm> | null>(null);
  const [focus, setFocus] = useState<"submit" | "preview">("submit");
  const [serial, setSerial] = useState<number | null>(null);
  const [truth, setTruth] = useState(false);
  const [parentOk, setParentOk] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [amount, setAmount] = useState("500");
  const [feeRequired, setFeeRequired] = useState(false);
  const [signOn, setSignOn] = useState(true);
  const [applicantOn, setApplicantOn] = useState(true);
  const [parentOn, setParentOn] = useState(true);
  const [managerSign, setManagerSignImage] = useState("");
  const [managerPad, setManagerPad] = useState("");
  const [uploads, setUploads] = useState({ photo: true, document: true, aadhaar: true, signature: true });
  const [waNote, setWaNote] = useState("");
  const [payerUpi, setPayerUpi] = useState("");
  const [paid, setPaid] = useState(unpaid);
  const studentPad = useRef<SignHandle>(null);
  const parentPad = useRef<SignHandle>(null);
  const pdfRef = useRef<File | null>(null);
  const pdfJob = useRef<Promise<File | null> | null>(null);
  const waLock = useRef(0);

  useEffect(() => {
    void import("@/lib/admission-pdf").then((mod) => mod.warmAdmissionPdf());
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("sk-registration-draft");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<Draft>;
      setDraft({ ...empty, ...parsed });
    } catch {
      window.localStorage.removeItem("sk-registration-draft");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("sk-registration-draft", JSON.stringify(draft));
  }, [draft]);

  useEffect(() => {
    const next = percent(draft.marksGot, draft.marksTotal);
    setDraft((current) => (current.percentage === next ? current : { ...current, percentage: next }));
  }, [draft.marksGot, draft.marksTotal, draft.percentage]);

  useEffect(() => {
    readFeeGate({ data: {} })
      .then((gate) => setFeeRequired(gate.required))
      .catch(() => setFeeRequired(false));
    readSignGate({ data: {} })
      .then((gate) => {
        setSignOn(gate.enabled);
        setApplicantOn(gate.applicant);
        setParentOn(gate.parent);
      })
      .catch(() => {
        setSignOn(true);
        setApplicantOn(true);
        setParentOn(true);
      });
    readManagerSign({ data: {} })
      .then((gate) => {
        setManagerSignImage(gate.enabled && gate.image ? gate.image : "");
        setManagerPad(gate.padEnabled && gate.padImage ? gate.padImage : "");
      })
      .catch(() => {
        setManagerSignImage("");
        setManagerPad("");
      });
    readUploadGates({ data: {} })
      .then((gate) => setUploads(gate))
      .catch(() => setUploads({ photo: true, document: true, aadhaar: true, signature: true }));
  }, []);

  async function takeFile(file: File | undefined, kind: "photo" | "doc" | "aadhaar" | "sign") {
    if (!file) return;
    const label =
      kind === "photo"
        ? en
          ? "Photo"
          : "फोटो"
        : kind === "doc"
          ? en
            ? "Document"
            : "दस्तावेज़"
          : kind === "aadhaar"
            ? en
              ? "Aadhaar file"
              : "आधार फ़ाइल"
            : en
              ? "Applicant's Signature"
              : "आवेदक का हस्ताक्षर";
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    const mime = file.type.toLowerCase();
    const jpeg = mime === "image/jpeg" || mime === "image/jpg" || mime === "image/pjpeg" || ["jpg", "jpeg", "jpe", "jfif"].includes(ext);
    const png = mime === "image/png" || ext === "png";
    const webp = mime === "image/webp" || ext === "webp";
    const heic = mime.includes("heic") || mime.includes("heif") || ["heic", "heif"].includes(ext);
    const image = jpeg || png || webp || heic || mime.startsWith("image/");
    const pdf = mime === "application/pdf" || ext === "pdf";
    const allowed = kind === "doc" || kind === "aadhaar" ? image || pdf : image;
    const formats = kind === "doc" || kind === "aadhaar" ? "JPG, JPEG, PNG, WEBP, HEIC या PDF" : "JPG, JPEG, PNG, WEBP या HEIC";
    const formatsEn = kind === "doc" || kind === "aadhaar" ? "JPG, JPEG, PNG, WEBP, HEIC or PDF" : "JPG, JPEG, PNG, WEBP or HEIC";
    const sizeText = file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`;
    const reject = (note: string) => {
      setSlotNote((current) => ({ ...current, [kind]: note }));
      setFileNote(note);
      setError(note);
    };
    if (file.size === 0) {
      reject(en ? `${label} “${file.name}” is empty (0 KB). Choose the file again.` : `${label} “${file.name}” खाली है (0 KB)। फ़ाइल फिर से चुनें।`);
      return;
    }
    if (!allowed) {
      reject(
        en
          ? `${label} “${file.name}” was not uploaded. Its format is ${ext || "unknown"}. Save it as ${formatsEn} and choose it again.`
          : `${label} “${file.name}” अपलोड नहीं हुई। इसका फ़ॉर्मैट ${ext || "अज्ञात"} है। इसे ${formats} में सेव करके फिर चुनें।`,
      );
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      reject(
        en
          ? `${label} “${file.name}” is too big (${sizeText}). The limit is 5 MB. Choose a smaller file.`
          : `${label} “${file.name}” बहुत बड़ी है (${sizeText})। सीमा 5 MB है। छोटी फ़ाइल चुनें।`,
      );
      return;
    }
    if (image) {
      const opened = await readImageSize(file);
      if (!opened) {
        reject(
          en
            ? `${label} “${file.name}” was not uploaded. The format is not JPG, JPEG, PNG or WEBP, or the file is damaged. Save it as JPEG and choose it again.`
            : `${label} “${file.name}” अपलोड नहीं हुई। फ़ॉर्मैट JPG, JPEG, PNG या WEBP नहीं है, या फ़ाइल खराब है। JPEG में सेव करके फिर चुनें।`,
        );
        return;
      }
      if (opened.w > 7000 || opened.h > 7000) {
        reject(
          en
            ? `${label} “${file.name}” was not uploaded. Resolution is too high (${opened.w}×${opened.h}). Make the photo smaller, under 5 MB, and choose it again.`
            : `${label} “${file.name}” अपलोड नहीं हुई। रेज़ोल्यूशन बहुत बड़ा है (${opened.w}×${opened.h})। फोटो छोटी करके, 5 MB से कम, फिर चुनें।`,
        );
        return;
      }
    }
    const next = { name: file.name, url: URL.createObjectURL(file), image };
    const keep = (current: Upload | null) => {
      if (current && current.url !== next.url) URL.revokeObjectURL(current.url);
      return next;
    };
    if (kind === "photo") setPhoto(keep);
    else if (kind === "doc") setPaper(keep);
    else if (kind === "aadhaar") setAadhaarFile(keep);
    else setSignFile(keep);
    setSlotNote((current) => ({ ...current, [kind]: "" }));
    setFileNote("");
    setError("");
    setReady(false);
  }

  function showFile(note: string) {
    setFileNote(note);
    setError(note);
  }

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
    setReady(false);
  }

  function validateForm() {
    if (ready) return en ? "This form is already submitted." : "यह फ़ॉर्म पहले ही सबमिट हो चुका है।";
    if (draft.student.trim().length < 2) return en ? "Write the student’s full name." : "विद्यार्थी का पूरा नाम लिखें।";
    if (draft.father.trim().length < 2 || draft.mother.trim().length < 2) {
      return en ? "Write the father’s and mother’s names." : "पिता और माता का नाम लिखें।";
    }
    if (draft.marital !== "Single" && draft.marital !== "Married" && draft.marital !== "Others") return en ? "Choose marital status." : "वैवाहिक स्थिति चुनें।";
    if (!draft.dob) return en ? "Choose the date of birth." : "जन्म तिथि चुनें।";
    if (draft.address.trim().length < 6) return en ? "Write the full address." : "पूरा पता लिखें।";
    if (!/^[6-9]\d{9}$/.test(draft.mobile.trim())) return en ? "Write a 10-digit mobile number." : "10 अंक का मोबाइल नंबर लिखें।";
    if (!draft.course) return en ? "Choose a course." : "कोर्स चुनें।";
    if (!/^\d{12}$/.test(draft.aadhaar)) return en ? "Write the 12-digit Aadhaar number." : "12 अंक का आधार नंबर लिखें।";
    if (!draft.qualification) return en ? "Choose the class." : "कक्षा चुनें।";
    if (draft.school.trim().length < 2) return en ? "Write the school or college name." : "स्कूल या कॉलेज का नाम लिखें।";
    if (!/^(19|20)\d{2}$/.test(draft.passingYear) || Number(draft.passingYear) > new Date().getFullYear()) {
      return en ? "Write the passing year." : "उत्तीर्ण वर्ष लिखें।";
    }
    if ((draft.marksGot && !draft.marksTotal) || (!draft.marksGot && draft.marksTotal)) {
      return en ? "Write both marks, or leave both empty." : "दोनों अंक लिखें, या दोनों खाली छोड़ें।";
    }
    const needApplicant = signOn && applicantOn;
    const needParent = signOn && parentOn;
    if (needApplicant && !studentSign && needParent && !parentSign) return en ? "Add both signatures in the boxes." : "दोनों हस्ताक्षर बॉक्स में करें।";
    if (needApplicant && !studentSign) return en ? "Add the applicant signature." : "आवेदक का हस्ताक्षर करें।";
    if (needParent && !parentSign) return en ? "Add the parent signature." : "माता-पिता का हस्ताक्षर करें।";
    const missing = [
      uploads.photo && !photo ? (en ? "Photo" : "फोटो") : "",
      uploads.document && !paper ? (en ? "Document" : "दस्तावेज़") : "",
      uploads.aadhaar && !aadhaarFile ? (en ? "Aadhaar file" : "आधार फ़ाइल") : "",
      uploads.signature && !signFile ? (en ? "Applicant signature" : "आवेदक का हस्ताक्षर") : "",
    ].filter(Boolean);
    if (missing.length) {
      const note = fileNote
        ? fileNote
        : en
          ? `These files are still missing: ${missing.join(", ")}. Choose each one again.`
          : `ये फ़ाइलें अभी नहीं लगीं: ${missing.join(", ")}। हर फ़ाइल फिर से चुनें।`;
      setFileNote(note);
      return note;
    }
    if (!truth || !parentOk) return en ? "Tick both declarations." : "दोनों घोषणाओं पर टिक करें।";
    return "";
  }

  function feeBlocked() {
    if (!feeRequired || paid.paymentStatus === "Paid") return false;
    setError(en ? "Pay the registration fee before the form can be submitted." : "रजिस्ट्रेशन फीस जमा किए बिना फ़ॉर्म सबमिट नहीं होगा।");
    setPayOpen(true);
    window.setTimeout(() => document.getElementById("reg-pay")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    return true;
  }

  async function readAll() {
    const photoRead = uploads.photo ? await readUpload(photo!, en ? "Photo" : "फोटो", 2_500_000, en) : { data: "" };
    if ("error" in photoRead) return { ...photoRead, kind: "photo" as const };
    const docRead = uploads.document ? await readUpload(paper!, en ? "Document" : "दस्तावेज़", 7_500_000, en) : { data: "" };
    if ("error" in docRead) return { ...docRead, kind: "doc" as const };
    const aadhaarRead = uploads.aadhaar ? await readUpload(aadhaarFile!, en ? "Aadhaar file" : "आधार फ़ाइल", 7_500_000, en) : { data: "" };
    if ("error" in aadhaarRead) return { ...aadhaarRead, kind: "aadhaar" as const };
    const signRead = uploads.signature ? await readUpload(signFile!, en ? "Applicant signature" : "आवेदक का हस्ताक्षर", 2_500_000, en) : { data: "" };
    if ("error" in signRead) return { ...signRead, kind: "sign" as const };
    return { photoData: photoRead.data, docData: docRead.data, aadhaarData: aadhaarRead.data, signData: signRead.data };
  }

  async function openCheckedPreview() {
    const problem = validateForm();
    if (problem) {
      setError(problem);
      return;
    }
    if (feeBlocked()) return;
    const reads = await readAll();
    if ("error" in reads) {
      setSlotNote((current) => ({ ...current, [reads.kind]: reads.error }));
      showFile(reads.error);
      return;
    }
    setFileNote("");
    setError("");
    onPreview();
  }

  async function finalSubmit() {
    if (saving || ready) return;
    const problem = validateForm();
    if (problem) {
      setError(problem);
      return;
    }
    if (feeBlocked()) return;
    setSaving(true);
    setError("");
    try {
      const reads = await readAll();
      if ("error" in reads) {
        setSlotNote((current) => ({ ...current, [reads.kind]: reads.error }));
        showFile(reads.error);
        return;
      }
      const { photoData, docData, aadhaarData, signData } = reads;
      const needApplicant = signOn && applicantOn;
      const needParent = signOn && parentOn;
      const studentDrawn = needApplicant ? studentPad.current?.toDataURL() || "" : "";
      const parentDrawn = needParent ? parentPad.current?.toDataURL() || "" : "";
      if (needApplicant && studentDrawn.length < 30 && needParent && parentDrawn.length < 30) {
        setError(en ? "Add both signatures in the boxes." : "दोनों हस्ताक्षर बॉक्स में करें।");
        return;
      }
      if (needApplicant && studentDrawn.length < 30) {
        setError(en ? "Add the applicant signature." : "आवेदक का हस्ताक्षर करें।");
        return;
      }
      if (needParent && parentDrawn.length < 30) {
        setError(en ? "Add the parent signature." : "माता-पिता का हस्ताक्षर करें।");
        return;
      }
      const form: AdmissionForm = {
        ...draft,
        photo: photoData,
        documentName: paper?.name || "",
        documentData: docData,
        aadhaarName: aadhaarFile?.name || "",
        aadhaarData,
        signUpload: signData,
        studentSign: studentDrawn,
        parentSign: parentDrawn,
        declareTruth: true,
        declareParent: true,
        percentage: percent(draft.marksGot, draft.marksTotal),
        ...paid,
      };
      const saved = await submitAdmission({ data: form });
      if (saved.blocked === "fee") {
        setError(en ? "Pay the registration fee before the form can be submitted." : "रजिस्ट्रेशन फीस जमा किए बिना फ़ॉर्म सबमिट नहीं होगा।");
        setPayOpen(true);
        return;
      }
      if (saved.blocked === "sign") {
        setError(en ? "Add both signatures in the boxes." : "दोनों हस्ताक्षर बॉक्स में करें।");
        return;
      }
      if (saved.blocked === "file") {
        const detail = "detail" in saved ? String(saved.detail) : "";
        const note = fileRejectNote(detail, en);
        const slot = detail.startsWith("photo") ? "photo" : detail.startsWith("document") ? "doc" : detail.startsWith("aadhaar") ? "aadhaar" : detail.startsWith("signature") ? "sign" : "";
        if (slot) setSlotNote((current) => ({ ...current, [slot]: note }));
        showFile(note);
        return;
      }
      setSheet(form);
      setPeek(null);
      setSerial(saved.id);
      pdfRef.current = null;
      const serialNo = saved.id;
      const manager = managerSign;
      const pad = managerPad;
      pdfJob.current = makeRegistrationPdf(form, serialNo, manager, pad)
        .then((file) => {
          pdfRef.current = file;
          return file;
        })
        .catch(() => null);
      setReady(true);
      window.setTimeout(() => document.getElementById("form-preview")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
      setWaNote(
        en
          ? "Submitted and locked. Tap Send PDF on WhatsApp to send the form, or Send details on WhatsApp for the written details."
          : "फ़ॉर्म सबमिट होकर लॉक हो गया। PDF भेजने के लिए WhatsApp पर PDF भेजें दबाएँ, और लिखी डिटेल के लिए डिटेल WhatsApp पर भेजें दबाएँ।",
      );
    } catch {
      setReady(false);
      showFile(
        en
          ? "Could not submit. Check the red note under the file that failed. It names the file and the reason: size over 5 MB, resolution, or the wrong format."
          : "सबमिट नहीं हुआ। जिस फ़ाइल के नीचे लाल नोट है, वही फ़ाइल नहीं चली। उसमें साइज़ 5 MB से बड़ा है, रेज़ोल्यूशन ठीक नहीं है, या फ़ॉर्मैट गलत है।",
      );
    } finally {
      setSaving(false);
    }
  }

  function sendLockedPdf() {
    if (!sheet || !serial) return;
    const now = Date.now();
    if (now - waLock.current < 700) return;
    waLock.current = now;
    setError("");
    const text = pdfCaption(sheet, serial, en);
    const go = (file: File | null) => {
      if (!file) {
        waLock.current = 0;
        setWaNote(en ? "The PDF is not ready yet. Tap again." : "PDF अभी तैयार नहीं है। फिर दबाएँ।");
        return;
      }
      const filesOnly: ShareData = { files: [file] };
      let can = false;
      try {
        can = typeof navigator.canShare === "function" && navigator.canShare(filesOnly);
      } catch {
        can = false;
      }
      if (can) {
        void navigator.share(filesOnly).catch((error) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            setWaNote(en ? "WhatsApp send was cancelled. The form stays locked." : "WhatsApp भेजना रुक गया। फ़ॉर्म लॉक है।");
            return;
          }
          waLock.current = 0;
          handPdfToWhatsApp(file, text, setWaNote, en);
        });
        return;
      }
      handPdfToWhatsApp(file, text, setWaNote, en);
    };
    if (pdfRef.current) {
      go(pdfRef.current);
      return;
    }
    const job = pdfJob.current;
    if (!job) {
      waLock.current = 0;
      setWaNote(en ? "The PDF is not ready yet. Tap again." : "PDF अभी तैयार नहीं है। फिर दबाएँ।");
      return;
    }
    void job.then((file) => {
      waLock.current = 0;
      if (!file) {
        setWaNote(en ? "The PDF is not ready yet. Tap again." : "PDF अभी तैयार नहीं है। फिर दबाएँ।");
        return;
      }
      handPdfToWhatsApp(file, text, setWaNote, en);
    });
  }

  function markPaid(method: string) {
    if (!/^\d{1,6}(\.\d{1,2})?$/.test(amount)) {
      setError(en ? "Write the fee amount before marking paid." : "Paid करने से पहले फीस की रकम लिखें।");
      return;
    }
    setError("");
    setPaid({
      paymentStatus: "Paid",
      paymentMethod: method,
      paymentAmount: amount,
      paymentAt: new Date().toISOString(),
      payerUpi: payerUpi.trim(),
    });
  }

  function onPreview() {
    setPeek({
      ...draft,
      photo: photo?.url,
      documentName: paper?.name,
      documentData: paper?.url,
      aadhaarName: aadhaarFile?.name,
      aadhaarData: aadhaarFile?.url,
      signUpload: signFile?.url,
      studentSign: studentPad.current?.toDataURL() || undefined,
      parentSign: parentPad.current?.toDataURL() || undefined,
      declareTruth: truth ? true : undefined,
      declareParent: parentOk ? true : undefined,
      ...paid,
    });
    window.setTimeout(() => document.getElementById("form-preview")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
  }

  const message = [
    en ? "Online Registration — SK Computer & Education Centre" : "ऑनलाइन रजिस्ट्रेशन — SK Computer & Education Centre",
    `${en ? "Course" : "कोर्स"}: ${draft.course}`,
    `${en ? "Student" : "विद्यार्थी"}: ${draft.student}`,
    `${en ? "Gender" : "लिंग"}: ${draft.gender || "—"}`,
    `${en ? "Date of birth" : "जन्म तिथि"}: ${draft.dob}`,
    `${en ? "Place" : "स्थान"}: ${draft.birthPlace || "—"}`,
    `${en ? "Religion" : "धर्म"}: ${draft.religion || "—"}`,
    `${en ? "Caste" : "जाति"}: ${draft.caste || "—"}`,
    `${en ? "Category" : "वर्ग"}: ${draft.category || "—"}`,
    `${en ? "Aadhaar" : "आधार"}: ${draft.aadhaar || "—"}`,
    `${en ? "Father" : "पिता"}: ${draft.father}`,
    `${en ? "Mother" : "माता"}: ${draft.mother}`,
    `${en ? "Husband" : "पति"}: ${draft.husband || "—"}`,
    `${en ? "Occupation" : "व्यवसाय"}: ${draft.occupation || "—"}`,
    `${en ? "Qualification" : "योग्यता"}: ${draft.qualification || "—"}`,
    `${en ? "School" : "स्कूल"}: ${draft.school || "—"}`,
    `${en ? "Board" : "बोर्ड"}: ${draft.board || "—"}`,
    `${en ? "Passing year" : "उत्तीर्ण वर्ष"}: ${draft.passingYear || "—"}`,
    `${en ? "Marks" : "अंक"}: ${draft.marksGot || "—"} / ${draft.marksTotal || "—"} ${draft.percentage || ""}`,
    `${en ? "Address" : "पता"}: ${draft.address}`,
    `${en ? "PIN" : "पिन"}: ${draft.pin || "—"}`,
    `${en ? "Mobile" : "मोबाइल"}: ${draft.mobile}`,
    `${en ? "Email" : "ईमेल"}: ${draft.email || "—"}`,
    `${en ? "Computer knowledge" : "कंप्यूटर ज्ञान"}: ${draft.knowledge || "—"}`,
    `${en ? "Batch" : "बैच"}: ${draft.batch || "—"}`,
    photo ? `${en ? "Photo file" : "फोटो फ़ाइल"}: ${photo.name}` : "",
    paper ? `${en ? "Document file" : "दस्तावेज़ फ़ाइल"}: ${paper.name}` : "",
    aadhaarFile ? `${en ? "Aadhaar file" : "आधार फ़ाइल"}: ${aadhaarFile.name}` : "",
    signFile ? `${en ? "Applicant's Signature" : "आवेदक का हस्ताक्षर"}: ${signFile.name}` : "",
    `${en ? "Payment" : "भुगतान"}: ${paid.paymentStatus}`,
  ]
    .filter(Boolean)
    .join("\n");

  const t = en
    ? {
        title: "Online Registration",
        lead: "Fill this form the way you would a paper admission form. Sign in the two boxes. Preview shows the full form in one column so you can check every detail. Final Submit then locks it on the website. Then print your own copy. The short enquiry form on the contact page stays as it is.",
        student: "Student Details",
        family: "Family Details",
        study: "Qualification",
        contact: "Contact and course",
        signs: "Signatures",
        signHint: "Sign with a finger or a mouse. Clear and sign again if the line slips.",
        course: "Course applied for",
        name: "Student’s full name",
        gender: "Gender",
        dob: "Date of birth",
        place: "Place",
        religion: "Religion",
        caste: "Caste",
        category: "Category",
        aadhaar: "Aadhaar number",
        father: "Father’s name",
        mother: "Mother’s name",
        husband: "Husband’s name",
        occupation: "Occupation",
        qualification: "Qualification",
        school: "School or college",
        passing: "Passing year",
        marksGot: "Marks obtained",
        marksTotal: "Total marks",
        percentage: "Percentage",
        board: "Board",
        address: "Full address",
        pin: "PIN code",
        mobile: "Mobile",
        email: "Email",
        knowledge: "Computer knowledge",
        batch: "Preferred batch",
        applicant: "Applicant’s signature",
        parent: "Parent’s / guardian’s signature",
        clear: "Clear",
        uploads: "Uploads",
        uploadHint: "Each file up to 5 MB. The signature boxes above stay for signing by hand. Print shows the files. WhatsApp sends the names — attach the files in the chat.",
        photo: "Photo",
        document: "Document",
        aadhaarFile: "Aadhaar upload",
        signFile: "Applicant's Signature",
        photoHint: "Upload JPG, JPEG, PNG or WEBP. Maximum 5 MB.",
        docHint: "Upload JPG, JPEG, PNG, WEBP or PDF. Maximum 5 MB.",
        remove: "Remove",
        submit: "Submit",
        preview: "Preview",
        final: "Final Submit",
        edit: "Edit",
        back: "Back",
        sendPdf: "Send PDF on WhatsApp",
        print: "Print the form",
        send: "Send details on WhatsApp",
        call: "Call the centre",
        ready: "Submitted. Print your own copy below. Other students cannot see it.",
        choose: "Choose",
        chooseClass: "Choose Class",
        pay: "Payment",
        showPay: "Payment",
        declare1: "The information I have given is completely true. If any information is found to be false, the institute may cancel my form.",
        declare2:
          "The parent declares that if my son or daughter, while going from home to the coaching centre or while returning, goes somewhere else, goes out with a friend, or meets with any kind of accident, neither the coaching centre nor any person working there will be responsible. The parent alone will be responsible.",
        male: "Male",
        female: "Female",
        other: "Other",
        none: "None yet",
        basic: "A little",
        some: "I have used a computer",
        morning: "Morning",
        noon: "Afternoon",
        evening: "Evening",
      }
    : {
        title: "ऑनलाइन रजिस्ट्रेशन",
        lead: "यह फ़ॉर्म कागज़ के एडमिशन फ़ॉर्म की तरह भरें। दोनों बॉक्स में हस्ताक्षर करें। पहले प्रीव्यू दबाएँ। पूरी डिटेल एक कॉलम में फ़ॉर्म की तरह खुलेगी, जाँच लें। फिर फाइनल सबमिट वेबसाइट पर फ़ॉर्म लॉक करता है। फिर अपनी कॉपी प्रिंट करें। संपर्क पेज का छोटा पूछताछ फ़ॉर्म ज्यों का त्यों है।",
        student: "विद्यार्थी की डिटेल",
        family: "परिवार की डिटेल",
        study: "योग्यता",
        contact: "संपर्क और कोर्स",
        signs: "हस्ताक्षर",
        signHint: "उंगली या माउस से साइन करें। लाइन बिगड़े तो मिटाकर फिर करें।",
        course: "जिस कोर्स के लिए आवेदन है",
        name: "विद्यार्थी का पूरा नाम",
        gender: "लिंग",
        dob: "जन्म तिथि",
        place: "स्थान",
        religion: "धर्म",
        caste: "जाति",
        category: "वर्ग",
        aadhaar: "आधार नंबर",
        father: "पिता का नाम",
        mother: "माता का नाम",
        husband: "पति का नाम",
        occupation: "व्यवसाय",
        qualification: "योग्यता",
        school: "स्कूल या कॉलेज",
        passing: "उत्तीर्ण वर्ष",
        marksGot: "प्राप्त अंक",
        marksTotal: "कुल अंक",
        percentage: "प्रतिशत",
        board: "बोर्ड",
        address: "पूरा पता",
        pin: "पिन कोड",
        mobile: "मोबाइल",
        email: "ईमेल",
        knowledge: "कंप्यूटर का ज्ञान",
        batch: "पसंदीदा बैच",
        applicant: "आवेदक का हस्ताक्षर",
        parent: "माता-पिता / अभिभावक का हस्ताक्षर",
        clear: "साफ़ करें",
        uploads: "अपलोड",
        uploadHint: "हर फ़ाइल अधिकतम 5 एमबी। ऊपर वाले हस्ताक्षर बॉक्स हाथ से साइन करने के लिए ज्यों के त्यों हैं। प्रिंट पर फ़ाइल दिखेगी। WhatsApp पर नाम जाता है — फ़ाइल चैट में अटैच करें।",
        photo: "फोटो",
        document: "दस्तावेज़",
        aadhaarFile: "आधार अपलोड",
        signFile: "आवेदक का हस्ताक्षर",
        photoHint: "JPG, JPEG, PNG या WEBP में अपलोड करें। अधिकतम 5 एमबी।",
        docHint: "JPG, JPEG, PNG, WEBP या PDF में अपलोड करें। अधिकतम 5 एमबी।",
        remove: "हटाएँ",
        submit: "सबमिट",
        preview: "प्रीव्यू",
        final: "फाइनल सबमिट",
        edit: "एडिट",
        back: "बैक",
        sendPdf: "PDF WhatsApp पर भेजें",
        print: "फ़ॉर्म प्रिंट करें",
        send: "डिटेल WhatsApp पर भेजें",
        call: "सेंटर को कॉल करें",
        ready: "सबमिट हो गया। नीचे अपनी कॉपी प्रिंट करें। किसी और विद्यार्थी को यह नहीं दिखेगा।",
        choose: "चुनें",
        chooseClass: "कक्षा चुनें",
        pay: "भुगतान",
        showPay: "भुगतान",
        declare1:
          "मेरे द्वारा दी गई जानकारी पूर्णतया सत्य है। यदि मेरे द्वारा दी गई कोई जानकारी असत्य पाई जाती है तो संस्थान द्वारा मेरा फॉर्म निरस्त किया जा सकता है।",
        declare2:
          "अभिभावक यह घोषणा करता है कि यदि मेरा पुत्र / पुत्री अपने घर से कोचिंग सेंटर जाते हैं और वापस लौटते समय वहां से कहीं और चले जाएं या किसी मित्र के साथ कहीं घूमने चले जाए या उनके साथ किसी प्रकार की कोई दुर्घटना घटित हो तो इस स्थिति में कोचिंग सेंटर की या कोचिंग सेंटर में कार्य कर रहे किसी भी व्यक्ति की कोई जवाबदेही नहीं होगी। इसके लिए अभिभावक स्वयं जिम्मेदार होगा।",
        male: "पुरुष",
        female: "महिला",
        other: "अन्य",
        none: "अभी नहीं",
        basic: "थोड़ा बहुत",
        some: "कंप्यूटर चलाया है",
        morning: "सुबह",
        noon: "दोपहर",
        evening: "शाम",
      };

  const shown = ready ? null : peek;

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
      <div className="no-print text-center">
        <h1 className="font-plain text-3xl font-bold text-navy md:text-4xl">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-ink">{t.lead}</p>
      </div>

      <form
        id="reg-form"
        onSubmit={(event) => {
          event.preventDefault();
          void finalSubmit();
        }}
        className="no-print mt-8 rounded-3xl border border-line bg-paper p-5 md:p-8"
      >
        <fieldset disabled={ready} className={`min-w-0 border-0 p-0 ${ready ? "hidden" : ""}`}>
        <Section title={t.student}>
          <Label text={t.name} required>
            <input className={field} value={draft.student} autoComplete="name" onChange={(event) => set("student", event.target.value)} />
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text={t.gender}>
              <select className={field} value={draft.gender} onChange={(event) => set("gender", event.target.value)}>
                <option value="">{t.choose}</option>
                <option value={t.male}>{t.male}</option>
                <option value={t.female}>{t.female}</option>
                <option value={t.other}>{t.other}</option>
              </select>
            </Label>
            <Label text={en ? "Marital status" : "वैवाहिक स्थिति"} required>
              <select className={field} value={draft.marital} onChange={(event) => set("marital", event.target.value)}>
                <option value="">{t.choose}</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Others">Others</option>
              </select>
            </Label>
            <Label text={t.dob} required>
              <input className={field} type="date" value={draft.dob} onChange={(event) => set("dob", event.target.value)} />
            </Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text={t.place}>
              <input className={field} value={draft.birthPlace} onChange={(event) => set("birthPlace", event.target.value)} />
            </Label>
            <Label text={t.religion}>
              <input className={field} value={draft.religion} onChange={(event) => set("religion", event.target.value)} />
            </Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text={t.caste}>
              <input className={field} value={draft.caste} onChange={(event) => set("caste", event.target.value)} />
            </Label>
            <Label text={t.category}>
              <select className={field} value={draft.category} onChange={(event) => set("category", event.target.value)}>
                <option value="">{t.choose}</option>
                <option>General</option>
                <option>OBC</option>
                <option>SC</option>
                <option>ST</option>
              </select>
            </Label>
          </div>
          <Label text={t.aadhaar} required>
            <input
              className={field}
              inputMode="numeric"
              autoComplete="off"
              value={draft.aadhaar}
              onChange={(event) => set("aadhaar", event.target.value.replace(/\D/g, "").slice(0, 12))}
            />
          </Label>
        </Section>

        <Section title={t.family}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text={t.father} required>
              <input className={field} value={draft.father} onChange={(event) => set("father", event.target.value)} />
            </Label>
            <Label text={t.mother} required>
              <input className={field} value={draft.mother} onChange={(event) => set("mother", event.target.value)} />
            </Label>
          </div>
          <Label text={t.husband}>
            <input className={field} value={draft.husband} onChange={(event) => set("husband", event.target.value)} />
          </Label>
          <Label text={t.occupation}>
            <select className={field} value={draft.occupation} onChange={(event) => set("occupation", event.target.value)}>
              <option value="">{t.choose}</option>
              {jobs.map(([value, hi]) => (
                <option key={value} value={value}>
                  {en ? value : hi}
                </option>
              ))}
            </select>
          </Label>
        </Section>

        <Section title={t.study}>
          <Label text={t.qualification} required>
            <select className={field} value={draft.qualification} onChange={(event) => set("qualification", event.target.value)}>
              <option value="">{t.chooseClass}</option>
              {classes.map(([value, hi]) => (
                <option key={value} value={value}>
                  {en ? value : hi}
                </option>
              ))}
            </select>
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text={t.school} required>
              <input className={field} value={draft.school} onChange={(event) => set("school", event.target.value)} />
            </Label>
            <Label text={t.board}>
              <select className={field} value={draft.board} onChange={(event) => set("board", event.target.value)}>
                <option value="">{t.choose}</option>
                <option>UP Board</option>
                <option>CBSE</option>
                <option>ICSE</option>
                <option>{en ? "Other" : "अन्य"}</option>
              </select>
            </Label>
          </div>
          <Label text={t.passing} required>
            <input
              className={field}
              inputMode="numeric"
              value={draft.passingYear}
              onChange={(event) => set("passingYear", event.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </Label>
          <div className="grid gap-4 sm:grid-cols-3">
            <Label text={t.marksGot}>
              <input className={field} inputMode="decimal" value={draft.marksGot} onChange={(event) => set("marksGot", event.target.value.replace(/[^\d.]/g, "").slice(0, 6))} />
            </Label>
            <Label text={t.marksTotal}>
              <input className={field} inputMode="decimal" value={draft.marksTotal} onChange={(event) => set("marksTotal", event.target.value.replace(/[^\d.]/g, "").slice(0, 6))} />
            </Label>
            <Label text={t.percentage}>
              <input className={field} value={draft.percentage} readOnly />
            </Label>
          </div>
        </Section>

        <Section title={t.contact}>
          <Label text={t.course} required>
            <select className={field} value={draft.course} onChange={(event) => set("course", event.target.value)}>
              <option value="">{t.choose}</option>
              {courses.map((item) => {
                const view = presentCourse(item, lang);
                const title = lang === "en" ? item.name : item.hindi;
                return (
                  <option key={item.slug} value={`${item.name} (${view.duration})`}>
                    {title} · {view.duration}
                  </option>
                );
              })}
              <option value="School Tuition">{en ? "School Tuition · Class 1–12" : "स्कूल ट्यूशन · कक्षा 1–12"}</option>
            </select>
          </Label>
          <Label text={t.address} required>
            <textarea className={`${field} min-h-28 py-3`} value={draft.address} onChange={(event) => set("address", event.target.value)} />
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text={t.pin}>
              <input
                className={field}
                inputMode="numeric"
                value={draft.pin}
                onChange={(event) => set("pin", event.target.value.replace(/\D/g, "").slice(0, 6))}
              />
            </Label>
            <Label text={t.mobile} required>
              <input
                className={field}
                inputMode="numeric"
                autoComplete="tel"
                value={draft.mobile}
                onChange={(event) => set("mobile", event.target.value.replace(/\D/g, "").slice(0, 10))}
              />
            </Label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label text={t.email}>
              <input className={field} type="email" autoComplete="email" value={draft.email} onChange={(event) => set("email", event.target.value)} />
            </Label>
            <Label text={t.knowledge}>
              <select className={field} value={draft.knowledge} onChange={(event) => set("knowledge", event.target.value)}>
                <option value="">{t.choose}</option>
                <option value={t.none}>{t.none}</option>
                <option value={t.basic}>{t.basic}</option>
                <option value={t.some}>{t.some}</option>
              </select>
            </Label>
          </div>
          <Label text={t.batch}>
            <select className={field} value={draft.batch} onChange={(event) => set("batch", event.target.value)}>
              <option value="">{t.choose}</option>
              <option value={t.morning}>{t.morning}</option>
              <option value={t.noon}>{t.noon}</option>
              <option value={t.evening}>{t.evening}</option>
            </select>
          </Label>
        </Section>

        {signOn && (applicantOn || parentOn) ? (
          <Section title={t.signs}>
            <p className="text-sm text-muted">{t.signHint}</p>
            <div className="grid gap-6 md:grid-cols-2">
              {applicantOn ? <SignaturePad ref={studentPad} label={t.applicant} required clearLabel={t.clear} onChange={setStudentSign} /> : null}
              {parentOn ? <SignaturePad ref={parentPad} label={t.parent} required clearLabel={t.clear} onChange={setParentSign} /> : null}
            </div>
          </Section>
        ) : null}

        <Section title={t.uploads}>
          <p className="text-sm text-muted">{t.uploadHint}</p>
          <div className="grid gap-4 md:grid-cols-3">
            {uploads.photo ? (
            <FileSlot
              label={t.photo}
              required
              hint={t.photoHint}
              accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif"
              removeLabel={t.remove}
              file={photo}
              onPick={(file) => void takeFile(file, "photo")}
              onClear={() => {
                setPhoto((current) => drop(current));
                setSlotNote((current) => ({ ...current, photo: "" }));
              }}
              note={slotNote.photo || ""}
            />
            ) : null}
            {uploads.document ? (
            <FileSlot
              label={t.document}
              required
              sharp
              hint={t.docHint}
              accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,.pdf"
              removeLabel={t.remove}
              file={paper}
              onPick={(file) => void takeFile(file, "doc")}
              onClear={() => {
                setPaper((current) => drop(current));
                setSlotNote((current) => ({ ...current, doc: "" }));
              }}
              note={slotNote.doc || ""}
            />
            ) : null}
            {uploads.aadhaar ? (
            <FileSlot
              label={t.aadhaarFile}
              required
              sharp
              hint={t.docHint}
              accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif,application/pdf,.pdf"
              removeLabel={t.remove}
              file={aadhaarFile}
              onPick={(file) => void takeFile(file, "aadhaar")}
              onClear={() => {
                setAadhaarFile((current) => drop(current));
                setSlotNote((current) => ({ ...current, aadhaar: "" }));
              }}
              note={slotNote.aadhaar || ""}
            />
            ) : null}
            {uploads.signature ? (
            <FileSlot
              label={t.signFile}
              required
              hint={t.photoHint}
              accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif"
              removeLabel={t.remove}
              file={signFile}
              onPick={(file) => void takeFile(file, "sign")}
              onClear={() => {
                setSignFile((current) => drop(current));
                setSlotNote((current) => ({ ...current, sign: "" }));
              }}
              note={slotNote.sign || ""}
            />
            ) : null}
          </div>
        </Section>

        <Section title={en ? "Declaration" : "घोषणा"}>
          <label className="flex items-start gap-3 text-sm leading-6 text-navy">
            <input type="checkbox" checked={truth} onChange={(event) => { setTruth(event.target.checked); setReady(false); }} className="mt-1 size-5 shrink-0 accent-navy" />
            <span>
              <Star /> {t.declare1}
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-navy">
            <input type="checkbox" checked={parentOk} onChange={(event) => { setParentOk(event.target.checked); setReady(false); }} className="mt-1 size-5 shrink-0 accent-navy" />
            <span>
              <Star /> {t.declare2}
            </span>
          </label>
        </Section>

        <Section title={t.pay} id="reg-pay">
          <button type="button" onClick={() => setPayOpen((open) => !open)} className="inline-flex min-h-11 w-fit items-center rounded-full bg-navy px-5 font-semibold text-ivory">
            {t.showPay}
          </button>
          {payOpen ? (
            <FeeMethods en={en} amount={amount} onAmount={setAmount} payerUpi={payerUpi} onPayerUpi={setPayerUpi} onMarkPaid={markPaid} />
          ) : null}
          <p className={`font-plain text-lg font-bold ${paid.paymentStatus === "Paid" ? "text-[#0d7a32]" : "text-[#c5161d]"}`}>
            {paid.paymentStatus === "Paid" ? "Paid" : "Not paid"}
          </p>
          {paid.paymentStatus === "Paid" ? (
            <button type="button" onClick={() => setPaid(unpaid)} className="w-fit text-sm font-semibold text-gold-deep">
              {en ? "Mark as not paid" : "Not paid करें"}
            </button>
          ) : null}
          {feeRequired ? (
            <p className="text-sm font-medium text-navy">
              {en
                ? "Registration fee is on. The form cannot be submitted until it is marked Paid."
                : "रजिस्ट्रेशन फीस चालू है। Paid किए बिना फ़ॉर्म सबमिट नहीं होगा।"}
            </p>
          ) : null}
        </Section>
        </fieldset>

        {error ? (
          <p className={`mt-6 text-sm font-medium ${fileNote && error === fileNote ? "text-[#b42318]" : "text-gold-deep"}`}>{error}</p>
        ) : null}
        {ready && serial ? (
          <p className="mt-6 text-sm font-medium text-navy">
            {t.ready} {en ? "Serial" : "क्रम"} {serial}.
          </p>
        ) : null}
        {waNote ? <p className="mt-3 text-sm font-medium text-navy">{waNote}</p> : null}

        <div className="no-print mt-6 flex flex-wrap items-center gap-3">
          {ready ? null : (
            <>
              <button
                type="submit"
                disabled={saving}
                onClick={() => setFocus("submit")}
                className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-semibold ${focus === "submit" ? "bg-navy text-ivory" : "border border-line bg-white text-navy"}`}
              >
                {saving ? (en ? "Submitting…" : "जा रहा है…") : t.submit}
              </button>
              <button
                type="button"
                onClick={() => {
                  setFocus("preview");
                  void openCheckedPreview();
                }}
                className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-3 font-semibold ${focus === "preview" ? "bg-navy text-ivory" : "border border-line bg-white text-navy"}`}
              >
                {t.preview}
              </button>
            </>
          )}
          {ready ? (
            <>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-3 font-semibold text-navy"
              >
                {t.print}
              </button>
              <button
                type="button"
                onClick={sendLockedPdf}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-navy touch-manipulation"
              >
                <WhatsAppIcon className="size-5" />
                {t.sendPdf}
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={() => window.location.assign(whatsappLink(message))}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-5 py-3 font-semibold text-navy"
          >
            <WhatsAppIcon className="size-5" />
            {t.send}
          </button>
          <a href={PHONE_TEL} className="inline-flex min-h-11 items-center justify-center rounded-full border border-line px-5 py-3 font-semibold text-navy">
            {t.call}
          </a>
        </div>
      </form>
      {sheet && ready && serial ? (
        <div className="print-only">
          <FilledForm form={sheet} serial={serial} lang={lang} managerSign={managerSign} managerPad={managerPad} />
        </div>
      ) : null}
      {shown ? (
        <div id="form-preview" className="no-print mt-8">
          <FilledForm form={shown} serial={serial ?? undefined} lang={lang} managerSign={managerSign} managerPad={managerPad} />
          {peek && !sheet ? (
            <div className="no-print mt-4 grid gap-3">
              {error ? (
                <p className={`text-sm font-medium ${fileNote && error === fileNote ? "text-[#b42318]" : "text-gold-deep"}`}>{error}</p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void finalSubmit()}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-navy px-5 py-3 font-semibold text-ivory"
                >
                  {saving ? (en ? "Submitting…" : "जा रहा है…") : t.final}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPeek(null);
                    document.getElementById("reg-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 py-3 font-semibold text-navy"
                >
                  {t.edit}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPeek(null);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-line bg-white px-5 py-3 font-semibold text-navy"
                >
                  {t.back}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

type SignHandle = { toDataURL: () => string };

async function makeRegistrationPdf(form: AdmissionForm, id: number, manager = "", pad = "") {
  const { buildAdmissionPdf } = await import("@/lib/admission-pdf");
  const toFile = (bytes: Uint8Array) => {
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    return new File([copy], `SK-registration-${id}.pdf`, { type: "application/pdf" });
  };
  try {
    return toFile(await buildAdmissionPdf(form, id, false, manager, "sheet", pad));
  } catch {
    const kept = { ...form, studentSign: "", parentSign: "", signUpload: "", documentData: "", aadhaarData: "" };
    return toFile(await buildAdmissionPdf(kept, id, false, manager, "sheet", pad));
  }
}

function pdfCaption(form: AdmissionForm, id: number, english: boolean) {
  return english
    ? `New registration\nSerial: ${id}\nStudent: ${form.student}\nMobile: ${form.mobile}\nCourse: ${form.course}\nPayment: ${form.paymentStatus}`
    : `नया रजिस्ट्रेशन\nक्रम: ${id}\nविद्यार्थी: ${form.student}\nमोबाइल: ${form.mobile}\nकोर्स: ${form.course}\nभुगतान: ${form.paymentStatus}`;
}

function handPdfToWhatsApp(file: File, text: string, note: (value: string) => void, english: boolean) {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  note(
    english
      ? "The PDF is downloaded. WhatsApp will open next. Attach that PDF in the chat."
      : "PDF डाउनलोड हो गई। अब WhatsApp खुलेगा। उसी चैट में यह PDF अटैच कर दें।",
  );
  window.setTimeout(() => {
    window.location.assign(whatsappLink(`${text}\n\nPDF downloaded. Please attach the PDF in this chat.`));
  }, 0);
  window.setTimeout(() => URL.revokeObjectURL(url), 20000);
}

async function readUpload(file: Upload, label: string, maxChars: number, en: boolean): Promise<{ data: string } | { error: string }> {
  const name = file.name || label;
  try {
    const blob = await fetch(file.url).then((response) => {
      if (!response.ok) throw new Error("fetch");
      return response.blob();
    });
    if (blob.size === 0) {
      return {
        error: en
          ? `${label} “${name}” is empty (0 KB). Choose the file again.`
          : `${label} “${name}” खाली है (0 KB)। फ़ाइल फिर से चुनें।`,
      };
    }
    if (file.image) {
      let bitmap: ImageBitmap;
      try {
        bitmap = await createImageBitmap(blob);
      } catch {
        return {
          error: en
            ? `${label} “${name}” could not be opened. The file may be damaged, or its resolution and format are not supported. Save it as JPG or PNG under 5 MB and choose it again.`
            : `${label} “${name}” नहीं खुली। फ़ाइल खराब हो सकती है, या रेज़ोल्यूशन और फ़ॉर्मैट सही नहीं है। इसे JPG या PNG में 5 MB से छोटी सेव करके फिर चुनें।`,
        };
      }
      const w = bitmap.width;
      const h = bitmap.height;
      try {
        const scale = Math.min(1, 900 / Math.max(w, h));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(w * scale));
        canvas.height = Math.max(1, Math.round(h * scale));
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("canvas");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL("image/jpeg", 0.72);
        bitmap.close?.();
        if (data.length > maxChars) {
          return {
            error: en
              ? `${label} “${name}” is too big (${w}×${h}). Save a smaller JPG under 1 MB and choose it again.`
              : `${label} “${name}” बहुत बड़ी है (${w}×${h})। 1 MB से छोटी JPG सेव करके फिर चुनें।`,
          };
        }
        return { data };
      } catch {
        bitmap.close?.();
        return {
          error: en
            ? `${label} “${name}” resolution is too high (${w}×${h}). Reduce the photo, save it as JPG under 5 MB, and choose it again.`
            : `${label} “${name}” का रेज़ोल्यूशन बहुत बड़ा है (${w}×${h})। फोटो छोटी करके JPG में 5 MB से कम सेव करें, फिर चुनें।`,
        };
      }
    }
    const data = await readDataUrl(blob);
    const head = data.slice(0, 48).toLowerCase();
    if (!head.startsWith("data:application/pdf") && !head.startsWith("data:image/")) {
      return {
        error: en
          ? `${label} “${name}” is not a PDF or a photo. Choose JPG, PNG, WEBP or PDF.`
          : `${label} “${name}” PDF या फोटो नहीं है। JPG, PNG, WEBP या PDF चुनें।`,
      };
    }
    if (data.length > maxChars) {
      const mb = (blob.size / (1024 * 1024)).toFixed(2);
      return {
        error: en
          ? `${label} “${name}” is too big (${mb} MB). The limit is 5 MB. Choose a smaller file.`
          : `${label} “${name}” बहुत बड़ी है (${mb} MB)। सीमा 5 MB है। छोटी फ़ाइल चुनें।`,
      };
    }
    return { data };
  } catch {
    return {
      error: en
        ? `${label} “${name}” could not be read. Choose it again as JPG, PNG, WEBP or PDF under 5 MB.`
        : `${label} “${name}” पढ़ी नहीं गई। JPG, PNG, WEBP या PDF चुनें, 5 MB से छोटी।`,
    };
  }
}

function readDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("read"));
    reader.readAsDataURL(blob);
  });
}

function readImageSize(file: File) {
  return new Promise<{ w: number; h: number } | null>((resolve) => {
    const finish = (size: { w: number; h: number } | null) => resolve(size && size.w > 1 && size.h > 1 ? size : null);
    createImageBitmap(file)
      .then((bitmap) => {
        const size = { w: bitmap.width, h: bitmap.height };
        bitmap.close?.();
        finish(size);
      })
      .catch(() => {
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(url);
          finish({ w: img.naturalWidth, h: img.naturalHeight });
        };
        img.onerror = () => {
          URL.revokeObjectURL(url);
          finish(null);
        };
        img.src = url;
      });
  });
}

function fileRejectNote(detail: string, en: boolean) {
  const [slot, why] = detail.split(":");
  const label =
    slot === "photo"
      ? en
        ? "Photo"
        : "फोटो"
      : slot === "document"
        ? en
          ? "Document"
          : "दस्तावेज़"
        : slot === "aadhaar"
          ? en
            ? "Aadhaar file"
            : "आधार फ़ाइल"
          : slot === "signature"
            ? en
              ? "Applicant signature"
              : "आवेदक का हस्ताक्षर"
            : en
              ? "A file"
              : "एक फ़ाइल";
  const pdfOk = slot === "document" || slot === "aadhaar";
  if (why === "big") {
    return en
      ? `${label} is too big to send. Choose a smaller file under 5 MB.`
      : `${label} भेजने के लिए बहुत बड़ी है। 5 MB से छोटी फ़ाइल चुनें।`;
  }
  if (why === "type") {
    return en
      ? `${label} type was not accepted, so it was not saved. Use JPG, JPEG, PNG or WEBP${pdfOk ? ", or PDF" : ""}.`
      : `${label} का फ़ॉर्मैट स्वीकार नहीं हुआ, इसलिए अपलोड नहीं हुई। JPG, JPEG, PNG या WEBP${pdfOk ? " या PDF" : ""} में लगाएँ।`;
  }
  return en
    ? `${label} could not be read. Choose the file again.`
    : `${label} पढ़ी नहीं गई। फ़ाइल फिर से चुनें।`;
}

function drop(current: Upload | null) {
  if (current) URL.revokeObjectURL(current.url);
  return null;
}

function FileSlot({
  label,
  required = false,
  hint,
  accept,
  removeLabel,
  file,
  note,
  sharp = false,
  onPick,
  onClear,
}: {
  label: string;
  required?: boolean;
  hint: string;
  accept: string;
  removeLabel: string;
  file: Upload | null;
  note?: string;
  sharp?: boolean;
  onPick: (file: File | undefined) => void;
  onClear: () => void;
}) {
  const pdf = Boolean(file && !file.image && file.name.toLowerCase().endsWith(".pdf"));
  return (
    <div className={`grid gap-2 text-sm font-medium text-navy ${sharp ? "md:col-span-3" : ""}`}>
      <span>
        {label}
        {required ? <Star /> : null}
        <span className="mt-0.5 block text-xs font-normal text-muted">{hint}</span>
      </span>
      <input
        type="file"
        accept={accept}
        aria-label={label}
        className="block w-full text-sm text-ink file:mr-3 file:min-h-11 file:rounded-full file:border-0 file:bg-navy file:px-4 file:font-semibold file:text-ivory"
        onChange={(event) => {
          onPick(event.target.files?.[0]);
          event.target.value = "";
        }}
      />
      {note ? <p className="text-sm font-semibold text-[#b42318]">{note}</p> : null}
      {file ? (
        <div className="rounded-2xl border border-line bg-ivory p-3">
          {file.image ? (
            <img src={file.url} alt="" className={sharp ? "doc-hd mb-2 w-full rounded-xl object-contain" : "mb-2 max-h-36 w-full rounded-xl object-contain"} />
          ) : sharp && pdf ? (
            <iframe title={label} src={file.url} className="doc-hd-frame mb-2 w-full rounded-xl border-0" />
          ) : null}
          <p className="truncate text-xs font-normal text-ink">{file.name}</p>
          <button type="button" onClick={onClear} className="mt-1 min-h-11 text-sm font-semibold text-gold-deep">
            {removeLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) {
  return (
    <fieldset id={id} className="mt-8 border-t border-line pt-6 first:mt-0 first:border-0 first:pt-0">
      <legend className="font-plain text-2xl font-bold text-navy">{title}</legend>
      <div className="mt-4 grid gap-4">{children}</div>
    </fieldset>
  );
}

function Label({ text, required = false, children }: { text: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-navy">
      <span>
        {text}
        {required ? <Star /> : null}
      </span>
      {children}
    </label>
  );
}

function Star() {
  return (
    <span className="text-[#d01212]" aria-hidden="true">
      {" "}
      *
    </span>
  );
}

function SignaturePad({
  ref,
  label,
  required = false,
  clearLabel,
  onChange,
}: {
  ref?: Ref<SignHandle>;
  label: string;
  required?: boolean;
  clearLabel: string;
  onChange: (filled: boolean) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useImperativeHandle(ref, () => ({
    toDataURL() {
      return canvasRef.current?.toDataURL("image/png") ?? "";
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 3.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0c2340";
    ctx.fillStyle = "#0c2340";
    let drawing = false;
    let fromPointer = false;

    const place = (clientX: number, clientY: number) => {
      const box = canvas.getBoundingClientRect();
      const width = box.width || 1;
      const height = box.height || 1;
      return {
        x: ((clientX - box.left) / width) * canvas.width,
        y: ((clientY - box.top) / height) * canvas.height,
      };
    };

    const ink = (x: number, y: number) => {
      ctx.beginPath();
      ctx.arc(x, y, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x, y);
      drawing = true;
      onChangeRef.current(true);
    };

    const line = (x: number, y: number) => {
      if (!drawing) return;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      fromPointer = true;
      const pen = place(event.clientX, event.clientY);
      ink(pen.x, pen.y);
    };
    const move = (event: PointerEvent) => {
      if (!drawing) return;
      event.preventDefault();
      const pen = place(event.clientX, event.clientY);
      line(pen.x, pen.y);
    };
    const up = () => {
      drawing = false;
      fromPointer = false;
    };
    const touchDown = (event: TouchEvent) => {
      if (fromPointer || event.touches.length !== 1) return;
      event.preventDefault();
      const touch = event.touches[0];
      const pen = place(touch.clientX, touch.clientY);
      ink(pen.x, pen.y);
    };
    const touchMove = (event: TouchEvent) => {
      if (!drawing || event.touches.length !== 1) return;
      event.preventDefault();
      const touch = event.touches[0];
      const pen = place(touch.clientX, touch.clientY);
      line(pen.x, pen.y);
    };

    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("touchstart", touchDown, { passive: false });
    canvas.addEventListener("touchmove", touchMove, { passive: false });
    canvas.addEventListener("touchend", up);
    canvas.addEventListener("touchcancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("touchstart", touchDown);
      canvas.removeEventListener("touchmove", touchMove);
      canvas.removeEventListener("touchend", up);
      canvas.removeEventListener("touchcancel", up);
    };
  }, []);

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0c2340";
    ctx.fillStyle = "#0c2340";
    onChange(false);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-navy">
          {label}
          {required ? <Star /> : null}
        </span>
        <button type="button" onClick={clear} className="min-h-11 px-2 text-sm font-semibold text-gold-deep">
          {clearLabel}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={200}
        aria-label={label}
        className="h-36 w-full touch-none rounded-2xl border border-dashed border-gold bg-ivory"
      />
    </div>
  );
}
