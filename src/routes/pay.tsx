import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FeeMethods } from "@/components/fee-pay";
import { PaySlipView } from "@/components/pay-slip";
import { readFeeGate, recordFee, type Slip } from "@/lib/admissions";
import { useI18n } from "@/lib/i18n";
import { UPI_ID } from "@/lib/site";

export const Route = createFileRoute("/pay")({
  head: () => ({
    meta: [{ title: "Pay Fees · SK Computer & Education Centre" }],
  }),
  component: PayPage,
});

const field =
  "min-h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base text-ink outline-none focus:border-navy";

function PayPage() {
  const { lang } = useI18n();
  const en = lang === "en";
  const [amount, setAmount] = useState("");
  const [payerUpi, setPayerUpi] = useState("");
  const [student, setStudent] = useState("");
  const [mobile, setMobile] = useState("");
  const [serial, setSerial] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [slip, setSlip] = useState<Slip | null>(null);
  const [saving, setSaving] = useState(false);
  const [feeRequired, setFeeRequired] = useState(false);

  useEffect(() => {
    readFeeGate({ data: {} })
      .then((gate) => setFeeRequired(gate.required))
      .catch(() => setFeeRequired(false));
  }, []);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  async function markPaid(method: string) {
    setError("");
    if (!/^\d{1,6}(\.\d{1,2})?$/.test(amount)) {
      setError(en ? "Write the amount." : "रकम लिखें।");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError(en ? "Write the 10-digit mobile." : "10 अंक का मोबाइल लिखें।");
      return;
    }
    const id = serial ? Number(serial) : 0;
    if (serial && (!Number.isInteger(id) || id < 1)) {
      setError(en ? "Write a valid serial, or leave it empty." : "सही क्रम संख्या लिखें, या खाली छोड़ें।");
      return;
    }
    if (!id && student.trim().length < 2) {
      setError(en ? "Write the student name, or the registration serial." : "विद्यार्थी का नाम लिखें, या रजिस्ट्रेशन क्रम संख्या।");
      return;
    }
    setSaving(true);
    try {
      const result = await recordFee({
        data: { serial: id, mobile, student: student.trim(), amount, method, payerUpi: payerUpi.trim() },
      });
      if (!result.ok) {
        setError(en ? "This serial and mobile do not match a form." : "यह क्रम और मोबाइल किसी फ़ॉर्म से नहीं मिलते।");
        return;
      }
      setSlip(result.slip);
    } catch {
      setError(en ? "Could not save the payment." : "भुगतान सेव नहीं हुआ।");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 md:py-16">
      <div className="no-print">
        <h1 className="font-plain text-4xl font-bold text-navy md:text-6xl">{en ? "Pay Fees" : "फीस भरें"}</h1>
        <p className="mt-4 text-lg text-ink">
          {feeRequired
            ? en
              ? "Pay the centre fee to the UPI below. Registration fee is on, so a new form cannot be submitted until that fee is marked Paid."
              : "सेंटर की फीस नीचे दिए UPI पर भरें। रजिस्ट्रेशन फीस चालू है, इसलिए नया फ़ॉर्म Paid किए बिना सबमिट नहीं होगा।"
            : en
              ? "Pay the centre fee to the UPI below. No amount is fixed here. A registration can be submitted even if the fee is paid later."
              : "सेंटर की फीस नीचे दिए UPI पर भरें। यहाँ कोई रकम पक्की नहीं है। फीस बाद में भरें तब भी रजिस्ट्रेशन हो सकता है।"}
        </p>
        <div className="mt-8 rounded-3xl bg-navy p-6 text-ivory">
          <p className="text-sm text-brass">UPI ID</p>
          <p className="mt-1 font-plain text-3xl font-bold tracking-wide text-gold md:text-4xl">{UPI_ID}</p>
          <button type="button" onClick={copyId} className="mt-4 inline-flex min-h-11 items-center rounded-full bg-gold px-5 py-3 font-semibold text-navy">
            {copied ? (en ? "Copied" : "कॉपी हो गया") : en ? "Copy UPI ID" : "UPI ID कॉपी करें"}
          </button>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <input className={field} value={student} placeholder={en ? "Student name" : "विद्यार्थी का नाम"} onChange={(event) => setStudent(event.target.value)} />
          <input className={field} inputMode="numeric" value={mobile} placeholder={en ? "Mobile" : "मोबाइल"} onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))} />
          <input className={`${field} sm:col-span-2`} inputMode="numeric" value={serial} placeholder={en ? "Registration serial, if the form is already submitted" : "रजिस्ट्रेशन क्रम संख्या, अगर फ़ॉर्म भर चुके हैं"} onChange={(event) => setSerial(event.target.value.replace(/\D/g, "").slice(0, 8))} />
        </div>
        <div className="mt-4">
          <FeeMethods en={en} amount={amount} onAmount={setAmount} payerUpi={payerUpi} onPayerUpi={setPayerUpi} onMarkPaid={saving ? () => undefined : markPaid} />
        </div>
        {error ? <p className="mt-4 text-sm font-medium text-[#c5161d]">{error}</p> : null}
      </div>
      {slip ? (
        <div className="mt-8">
          <button type="button" onClick={() => window.print()} className="no-print mb-4 min-h-11 rounded-full bg-navy px-5 font-semibold text-ivory">
            {en ? "Download / print slip" : "स्लिप डाउनलोड / प्रिंट"}
          </button>
          <PaySlipView slip={slip} lang={lang} />
        </div>
      ) : null}
    </div>
  );
}
