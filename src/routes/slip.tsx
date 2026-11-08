import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PayAppIcons } from "@/components/fee-pay";
import { PaySlipView } from "@/components/pay-slip";
import { readSlip, type Slip } from "@/lib/admissions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/slip")({
  head: () => ({
    meta: [{ title: "Print pay slip · SK Computer & Education Centre" }],
  }),
  component: SlipPage,
});

const field =
  "min-h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base text-ink outline-none focus:border-navy";

function SlipPage() {
  const { lang } = useI18n();
  const en = lang === "en";
  const [serial, setSerial] = useState("");
  const [mobile, setMobile] = useState("");
  const [slip, setSlip] = useState<Slip | null>(null);
  const [error, setError] = useState("");

  async function find(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSlip(null);
    const id = Number(serial);
    if (!Number.isInteger(id) || id < 1 || !/^[6-9]\d{9}$/.test(mobile)) {
      setError(en ? "Write the serial number and the 10-digit mobile." : "क्रम संख्या और 10 अंक का मोबाइल लिखें।");
      return;
    }
    const result = await readSlip({ data: { serial: id, mobile } });
    if (!result.ok) {
      setError(en ? "No slip for this serial and mobile." : "इस क्रम और मोबाइल की स्लिप नहीं मिली।");
      return;
    }
    setSlip(result.slip);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <form onSubmit={find} className="no-print">
        <h1 className="font-plain text-4xl font-bold text-navy">{en ? "Print pay slip" : "पे स्लिप प्रिंट"}</h1>
        <p className="mt-3 text-muted">
          {en
            ? "Enter the registration serial and mobile. The slip shows who was paid, and Paid or Not paid."
            : "रजिस्ट्रेशन की क्रम संख्या और मोबाइल लिखें। स्लिप पर दिखेगा कि भुगतान किसे हुआ, और Paid है या Not paid।"}
        </p>
        <div className="mt-6 grid gap-3">
          <input className={field} inputMode="numeric" value={serial} placeholder={en ? "Serial number" : "क्रम संख्या"} onChange={(event) => setSerial(event.target.value.replace(/\D/g, "").slice(0, 8))} />
          <input className={field} inputMode="numeric" value={mobile} placeholder={en ? "Mobile" : "मोबाइल"} onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))} />
          <button type="submit" className="min-h-11 rounded-full bg-navy font-semibold text-ivory">
            {en ? "Show slip" : "स्लिप दिखाएँ"}
          </button>
          {error ? <p className="text-sm font-medium text-[#c5161d]">{error}</p> : null}
          <div className="mt-2">
            <p className="mb-2 font-plain text-sm font-bold text-navy">{en ? "Pay with" : "इनसे भुगतान"}</p>
            <PayAppIcons amount="" />
          </div>
        </div>
      </form>
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
