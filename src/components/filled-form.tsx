import type { AdmissionForm } from "@/lib/admissions";
import { CentreName } from "@/components/bits";
import { PHONE_DISPLAY } from "@/lib/site";
import type { Lang } from "@/lib/i18n";
import { Phone } from "lucide-react";

export async function saveServerPdf(url: string, name: string) {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" });
  if (!response.ok) return;
  const blob = await response.blob();
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = name;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(fileUrl), 4000);
}

const qualHi: Record<string, string> = {
  "Below Class 6": "कक्षा 6 से नीचे",
  "Class 6": "कक्षा 6",
  "Class 7": "कक्षा 7",
  "Class 8": "कक्षा 8",
  "Class 9": "कक्षा 9",
  "Class 10": "कक्षा 10",
  "Class 11": "कक्षा 11",
  "Class 12": "कक्षा 12",
  Graduate: "स्नातक",
  "Post Graduate": "स्नातकोत्तर",
  Diploma: "डिप्लोमा",
};

const jobHi: Record<string, string> = {
  Business: "व्यवसाय",
  "Self Employee": "स्वरोजगार",
  "Government Employee": "सरकारी कर्मचारी",
  "Private Job": "प्राइवेट नौकरी",
  Others: "अन्य",
};

const rows: { key: keyof AdmissionForm; en: string; hi: string }[] = [
  { key: "course", en: "Course", hi: "कोर्स" },
  { key: "student", en: "Student's Name", hi: "विद्यार्थी का नाम" },
  { key: "gender", en: "Gender", hi: "लिंग" },
  { key: "marital", en: "Marital Status", hi: "वैवाहिक स्थिति" },
  { key: "dob", en: "Date Of Birth", hi: "जन्म तिथि" },
  { key: "birthPlace", en: "Place", hi: "स्थान" },
  { key: "religion", en: "Religion", hi: "धर्म" },
  { key: "caste", en: "Caste", hi: "जाति" },
  { key: "category", en: "Category", hi: "वर्ग" },
  { key: "aadhaar", en: "Aadhaar Number", hi: "आधार नंबर" },
  { key: "father", en: "Father's Name", hi: "पिता का नाम" },
  { key: "mother", en: "Mother's Name", hi: "माता का नाम" },
  { key: "husband", en: "Husband's Name", hi: "पति का नाम" },
  { key: "occupation", en: "Occupation", hi: "व्यवसाय" },
  { key: "qualification", en: "Qualification", hi: "योग्यता" },
  { key: "school", en: "School Or College", hi: "स्कूल या कॉलेज" },
  { key: "board", en: "Board", hi: "बोर्ड" },
  { key: "passingYear", en: "Passing Year", hi: "उत्तीर्ण वर्ष" },
  { key: "marksGot", en: "Marks Obtained", hi: "प्राप्त अंक" },
  { key: "marksTotal", en: "Total Marks", hi: "कुल अंक" },
  { key: "percentage", en: "Percentage", hi: "प्रतिशत" },
  { key: "address", en: "Address", hi: "पता" },
  { key: "pin", en: "PIN", hi: "पिन" },
  { key: "mobile", en: "Mobile", hi: "मोबाइल" },
  { key: "email", en: "Email", hi: "ईमेल" },
  { key: "knowledge", en: "Computer Knowledge", hi: "कंप्यूटर ज्ञान" },
  { key: "batch", en: "Batch", hi: "बैच" },
];

export function FilledForm({
  form,
  serial,
  lang,
  downloads = false,
  downloadToken = "",
  managerSign = "",
  managerPad = "",
  recordId = 0,
}: {
  form: Partial<AdmissionForm>;
  serial?: number;
  lang: Lang;
  downloads?: boolean;
  downloadToken?: string;
  managerSign?: string;
  managerPad?: string;
  recordId?: number;
}) {
  const en = lang === "en";
  const paid = form.paymentStatus === "Paid";
  const fileId = recordId || serial || 0;
  const files = [
    form.photo ? { href: form.photo, name: "photo.jpg", label: en ? "Photo" : "फोटो", page: false } : null,
    form.documentData ? { href: form.documentData, name: form.documentName || "document", label: en ? "Document" : "दस्तावेज़", page: true } : null,
    form.aadhaarData ? { href: form.aadhaarData, name: form.aadhaarName || "aadhaar", label: en ? "Aadhaar file" : "आधार फ़ाइल", page: true } : null,
    form.studentSign ? { href: form.studentSign, name: "applicant-signature.png", label: en ? "Applicant signature" : "आवेदक का हस्ताक्षर", page: false } : null,
    form.parentSign ? { href: form.parentSign, name: "parent-signature.png", label: en ? "Parent signature" : "अभिभावक का हस्ताक्षर", page: false } : null,
    form.signUpload ? { href: form.signUpload, name: "applicant-signature.jpg", label: en ? "Applicant's Signature" : "आवेदक का हस्ताक्षर", page: false } : null,
  ].filter((item): item is { href: string; name: string; label: string; page: boolean } => Boolean(item));
  const printFiles = files.filter((file) => file.page);
  const signPrints = [
    form.studentSign ? { label: en ? "Applicant's Signature" : "आवेदक का हस्ताक्षर", src: form.studentSign, plain: false } : null,
    form.parentSign ? { label: en ? "Parent's Signature" : "माता-पिता का हस्ताक्षर", src: form.parentSign, plain: false } : null,
    form.signUpload ? { label: en ? "Applicant's Signature" : "आवेदक का हस्ताक्षर", src: form.signUpload, plain: false } : null,
    managerSign ? { label: en ? "Manager's Signature" : "मैनेजर का हस्ताक्षर", src: managerSign, plain: true } : null,
  ].filter((item): item is { label: string; src: string; plain: boolean } => Boolean(item));
  const boxedSigns = signPrints.filter((sign) => !sign.plain);
  const managerPrint = signPrints.find((sign) => sign.plain);

  const paperRows: [string, string][] = [
    [en ? "Student's Name" : "विद्यार्थी का नाम", labelOf(form.student, "student", en)],
    [en ? "Father's Name" : "पिता का नाम", labelOf(form.father, "father", en)],
    [en ? "Mother's Name" : "माता का नाम", labelOf(form.mother, "mother", en)],
    [en ? "Husband's Name" : "पति का नाम", labelOf(form.husband, "husband", en)],
    [en ? "Gender" : "लिंग", labelOf(form.gender, "gender", en)],
    [en ? "Marital Status" : "वैवाहिक स्थिति", labelOf(form.marital, "marital", en)],
    [en ? "Date Of Birth" : "जन्म तिथि", labelOf(form.dob, "dob", en)],
    [en ? "Place" : "स्थान", labelOf(form.birthPlace, "birthPlace", en)],
    [en ? "Religion" : "धर्म", labelOf(form.religion, "religion", en)],
    [en ? "Caste" : "जाति", labelOf(form.caste, "caste", en)],
    [en ? "Category" : "वर्ग", labelOf(form.category, "category", en)],
    [en ? "Aadhaar Number" : "आधार नंबर", labelOf(form.aadhaar, "aadhaar", en)],
    [en ? "Course" : "कोर्स", labelOf(form.course, "course", en)],
    [en ? "Qualification" : "योग्यता", labelOf(form.qualification, "qualification", en)],
    [en ? "School Or College" : "स्कूल या कॉलेज", labelOf(form.school, "school", en)],
    [en ? "Board" : "बोर्ड", labelOf(form.board, "board", en)],
    [en ? "Passing Year" : "उत्तीर्ण वर्ष", labelOf(form.passingYear, "passingYear", en)],
    [en ? "Marks Obtained" : "प्राप्त अंक", labelOf(form.marksGot, "marksGot", en)],
    [en ? "Total Marks" : "कुल अंक", labelOf(form.marksTotal, "marksTotal", en)],
    [en ? "Percentage" : "प्रतिशत", labelOf(form.percentage, "percentage", en)],
    [en ? "Mobile" : "मोबाइल", labelOf(form.mobile, "mobile", en)],
    [en ? "PIN" : "पिन", labelOf(form.pin, "pin", en)],
    [en ? "Email" : "ईमेल", labelOf(form.email, "email", en)],
    [en ? "Batch" : "बैच", labelOf(form.batch, "batch", en)],
    [en ? "Address" : "पता", labelOf(form.address, "address", en)],
    [en ? "Computer Knowledge" : "कंप्यूटर ज्ञान", labelOf(form.knowledge, "knowledge", en)],
    [en ? "Occupation" : "व्यवसाय", labelOf(form.occupation, "occupation", en)],
    [en ? "Fee Status" : "फीस स्थिति", paid ? `Paid  Rs ${form.paymentAmount || ""}  ${form.paymentMethod || ""}`.trim() : "Not Paid"],
  ];

  return (
    <div className="a4-fit">
    <article className="a4-sheet print-form screen-sheet relative bg-white p-5 text-ink md:p-8">
      <div className="no-print">
      <header className="border-b-2 border-navy pb-3 text-center">
        <h2>
          <CentreName look="plain" caps className="text-[clamp(1.15rem,3.4vw,1.7rem)]" />
        </h2>
        <p className="mt-0.5 text-[13px] leading-tight text-[#111111]">Defence Colony, Air Force Gate, Izzat Nagar</p>
        <p className="text-[13px] leading-tight text-[#111111]">Bareilly, UP-243122</p>
        <div className="mt-1 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <p className="justify-self-start text-sm leading-none font-bold whitespace-nowrap text-navy">{serial ? `S.No. ${serial}` : "S.No."}</p>
          <p className="screen-admit justify-self-center leading-none whitespace-nowrap text-navy">{en ? "ADMISSION FORM" : "प्रवेश फ़ॉर्म"}</p>
          <p className="inline-flex items-center justify-self-end gap-1 text-sm leading-none font-bold whitespace-nowrap text-navy">
            <Phone className="paper-phone-mark size-2.5 shrink-0 text-navy" aria-hidden="true" />
            {PHONE_DISPLAY}
          </p>
        </div>
      </header>
      <div className="mt-3 flex items-start justify-end">
        <div className="relative h-32 w-24 shrink-0 overflow-hidden border-2 border-navy bg-white p-1">
          {form.photo ? (
            <img src={form.photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center px-2 text-center text-xs text-muted">{en ? "Photo" : "फोटो"}</span>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className={`inline-flex min-h-8 items-center rounded-full px-3 font-plain text-sm font-bold ${paid ? "bg-[#e5f6ea] text-[#0d7a32]" : "bg-[#fde8e8] text-[#c5161d]"}`}>
          {paid ? "Paid" : "Not paid"}
        </p>
        {downloads && serial && downloadToken ? (
          <button
            type="button"
            onClick={() => {
              void saveServerPdf(
                `/api/admission-pdf?${new URLSearchParams({ token: downloadToken, id: String(fileId), docs: "1" }).toString()}`,
                `SK-registration-${serial}-with-documents.pdf`,
              );
            }}
            className="no-print inline-flex min-h-11 items-center rounded-full border border-navy px-4 text-sm font-semibold text-navy touch-manipulation"
          >
            {en ? "Download form" : "फ़ॉर्म डाउनलोड"}
          </button>
        ) : null}
      </div>
      <dl className="a4-fields-stack mt-4">
        {rows.map((row) => (
          <div key={row.key} className={row.key === "address" ? "a4-span" : ""}>
            <dt className="form-side-label text-[13px] leading-tight">{en ? row.en : row.hi}</dt>
            <dd className="border-b border-line pb-1 text-[15px] leading-snug text-navy">{labelOf(form[row.key], row.key, en)}</dd>
          </div>
        ))}
      </dl>
      {boxedSigns.length || managerPrint || managerPad ? (
      <div className="mt-4 flex items-start gap-3">
        {boxedSigns.length ? (
          <div className={`flex min-w-0 flex-1 items-start ${boxedSigns.length > 1 ? "justify-between gap-6" : "justify-start"}`}>
            {boxedSigns.map((sign, index) => (
              <div key={`${sign.label}-${index}`} className={boxedSigns.length === 1 ? "w-[34%] text-center" : "w-[30%] text-center"}>
                <p className="text-xs font-semibold text-navy">{sign.label}</p>
                <img src={sign.src} alt="" className="mx-auto mt-0.5 max-h-14 w-auto object-contain object-top" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex-1" />
        )}
        {managerPrint || managerPad ? (
          <div className="w-28 shrink-0 text-center">
            <p className="text-xs font-semibold text-navy">{managerPrint?.label || (en ? "Manager's Signature" : "मैनेजर का हस्ताक्षर")}</p>
            {managerPrint ? <img src={managerPrint.src} alt="" className="mx-auto mt-0.5 max-h-14 w-auto object-contain object-top" /> : null}
            {managerPad ? <img src={managerPad} alt="" className="mx-auto mt-0.5 max-h-14 w-auto object-contain object-top" /> : null}
          </div>
        ) : null}
      </div>
      ) : null}
      {form.declareTruth ? (
        <ol className="mt-4 space-y-2 text-xs leading-snug text-navy">
          <li className="flex gap-2">
            <span className="font-bold">1.</span>
            <span>
              {en
                ? "The information I have given is completely true. If any information is found to be false, the institute may cancel my form."
                : "मेरे द्वारा दी गई जानकारी पूर्णतया सत्य है। यदि मेरे द्वारा दी गई कोई जानकारी असत्य पाई जाती है तो संस्थान द्वारा मेरा फॉर्म निरस्त किया जा सकता है।"}
            </span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold">2.</span>
            <span>
              {en
                ? "The parent declares that if my son or daughter, while going from home to the coaching centre or while returning, goes somewhere else, goes out with a friend, or meets with any kind of accident, neither the coaching centre nor any person working there will be responsible. The parent alone will be responsible."
                : "अभिभावक यह घोषणा करता है कि यदि मेरा पुत्र / पुत्री अपने घर से कोचिंग सेंटर जाते हैं और वापस लौटते समय वहां से कहीं और चले जाएं या किसी मित्र के साथ कहीं घूमने चले जाए या उनके साथ किसी प्रकार की कोई दुर्घटना घटित हो तो इस स्थिति में कोचिंग सेंटर की या कोचिंग सेंटर में कार्य कर रहे किसी भी व्यक्ति की कोई जवाबदेही नहीं होगी। इसके लिए अभिभावक स्वयं जिम्मेदार होगा।"}
            </span>
          </li>
        </ol>
      ) : null}
      <div className="mt-4 border-t border-line pt-3">
        <p className="font-plain text-sm font-bold text-navy">{en ? "Attached documents" : "संलग्न दस्तावेज़"}</p>
        <div className="mt-2 grid grid-cols-1 gap-3">
          {files.length === 0 ? <p className="text-sm text-muted">—</p> : null}
          {files.map((file) => (
            <div key={file.label} className="rounded-xl border border-line p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-navy">{file.label}</p>
                {downloads ? (
                  <a
                    href={file.href}
                    download={file.name}
                    className="no-print inline-flex min-h-11 items-center rounded-full border border-navy px-4 text-sm font-semibold text-navy"
                  >
                    {en ? "Download" : "डाउनलोड"}
                  </a>
                ) : null}
              </div>
              {(() => {
                const pdf = file.href.startsWith("data:application/pdf") || file.name.toLowerCase().endsWith(".pdf");
                const image = !pdf && (file.href.startsWith("data:image") || file.href.startsWith("blob:"));
                if (pdf) return <iframe title={file.label} src={file.href} className="doc-hd-frame mt-2 w-full rounded-md border-0" />;
                if (image) {
                  return <img src={file.href} alt="" className={file.page ? "doc-hd mt-2 w-full rounded-md object-contain" : "mt-1 h-16 w-full rounded-md object-contain"} />;
                }
                return <p className="mt-1 text-xs text-navy">{file.name}</p>;
              })()}
            </div>
          ))}
        </div>
      </div>
      {downloads && downloadToken && fileId ? (
        <button
          type="button"
          onClick={() => {
            void saveServerPdf(
              `/api/admission-pdf?${new URLSearchParams({ token: downloadToken, id: String(fileId), layout: "detail" }).toString()}`,
              `SK-form-${serial || fileId}.pdf`,
            );
          }}
          style={{ textTransform: "none" }}
          className="no-print mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-navy px-5 text-base font-semibold text-ivory touch-manipulation"
        >
          Save as PDF
        </button>
      ) : null}
      </div>
    </article>
    <article className="print-only paper-sheet">
      <div className="paper-form">
      <img src="/form-watermark.png?v=logo" alt="" className="paper-wm" />
      <div className="paper-body">
        <h2 className="paper-title">
          <CentreName look="plain" caps className="text-[22pt]" />
        </h2>
        <p className="paper-address">Defence Colony, Air Force Gate, Izzat Nagar</p>
        <p className="paper-place">Bareilly, UP-243122</p>
        <div className="paper-meta">
          <p className="paper-serial font-bold">{serial ? `S.No. ${serial}` : "S.No."}</p>
          <p className="paper-admit">{en ? "ADMISSION FORM" : "प्रवेश फ़ॉर्म"}</p>
          <p className="paper-phone">
            <svg viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
              <path fill="#000000" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z" />
            </svg>
            {PHONE_DISPLAY}
          </p>
        </div>
        <div className="paper-frame">
        <div className="paper-top">
          <div className="paper-rows">
            {paperRows.slice(0, 5).map(([label, value]) => (
              <PaperRow key={label} label={label} value={value} />
            ))}
          </div>
          <div className="paper-photo">
            {form.photo ? <img src={form.photo} alt="" /> : <span>{en ? "Photo" : "फोटो"}</span>}
          </div>
        </div>
        <div className="paper-rows">
          {paperRows.slice(5).map(([label, value]) => (
            <PaperRow key={label} label={label} value={value} />
          ))}
        </div>
        </div>
        {form.declareTruth ? (
          <div className="paper-decl">
            <p className="font-bold text-[#111111]">{en ? "Declaration" : "घोषणा"}</p>
            <ol>
              <li>
                <span>1.</span>
                <span>
                  {en
                    ? "The information I have given is completely true. If any information is found to be false, the institute may cancel my form."
                    : "मेरे द्वारा दी गई जानकारी पूर्णतया सत्य है। यदि मेरे द्वारा दी गई कोई जानकारी असत्य पाई जाती है तो संस्थान द्वारा मेरा फॉर्म निरस्त किया जा सकता है।"}
                </span>
              </li>
              <li>
                <span>2.</span>
                <span>
                  {en
                    ? "The parent declares that if my son or daughter, while going from home to the coaching centre or while returning, goes somewhere else, goes out with a friend, or meets with any kind of accident, neither the coaching centre nor any person working there will be responsible. The parent alone will be responsible."
                    : "अभिभावक यह घोषणा करता है कि यदि मेरा पुत्र / पुत्री अपने घर से कोचिंग सेंटर जाते हैं और वापस लौटते समय वहां से कहीं और चले जाएं या किसी मित्र के साथ कहीं घूमने चले जाए या उनके साथ किसी प्रकार की कोई दुर्घटना घटित हो तो इस स्थिति में कोचिंग सेंटर की या कोचिंग सेंटर में कार्य कर रहे किसी भी व्यक्ति की कोई जवाबदेही नहीं होगी। इसके लिए अभिभावक स्वयं जिम्मेदार होगा।"}
                </span>
              </li>
            </ol>
          </div>
        ) : null}
        {boxedSigns.length || managerPrint || managerPad ? (
          <div className="paper-sign-row">
            {boxedSigns.length ? (
              <div className="paper-signs">
                {boxedSigns.map((sign, index) => (
                  <SignPrint key={`${sign.label}-${index}`} label={sign.label} src={sign.src} />
                ))}
              </div>
            ) : null}
            {managerPrint || managerPad ? (
              <div className="paper-sign paper-sign-open">
                <p>{managerPrint?.label || (en ? "Manager's Signature" : "मैनेजर का हस्ताक्षर")}</p>
                {managerPrint ? (
                  <div>
                    <img src={managerPrint.src} alt="" />
                  </div>
                ) : null}
                {managerPad ? (
                  <div>
                    <img src={managerPad} alt="" />
                  </div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      </div>
        {downloads
          ? printFiles.map((file) => (
              <div key={file.label} className="paper-file">
                <p>{file.label}</p>
                {file.href.startsWith("data:image") || (file.href.startsWith("blob:") && !file.name.toLowerCase().endsWith(".pdf")) ? (
                  <img src={file.href} alt="" />
                ) : (
                  <p>{file.name}</p>
                )}
              </div>
            ))
          : null}
    </article>
    </div>
  );
}

function PaperRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="paper-row">
      <b>{label}</b>
      <span>{value}</span>
    </div>
  );
}

function SignPrint({ label, src, plain = false }: { label: string; src?: string | null; plain?: boolean }) {
  return (
    <div className={plain ? "paper-sign paper-sign-open" : "paper-sign"}>
      <p>{label}</p>
      <div>{src ? <img src={src} alt="" /> : null}</div>
    </div>
  );
}

function labelOf(value: unknown, key: keyof AdmissionForm, en: boolean) {
  const text = typeof value === "string" ? value.trim() : "";
  if (!text) return "—";
  if (!en && key === "qualification" && qualHi[text]) return qualHi[text];
  if (!en && key === "occupation" && jobHi[text]) return jobHi[text];
  return text;
}
