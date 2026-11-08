import type { Slip } from "@/lib/admissions";
import { CentreName } from "@/components/bits";
import { ADDRESS_EN, PHONE_DISPLAY, UPI_ID } from "@/lib/site";
import type { Lang } from "@/lib/i18n";
import { Phone } from "lucide-react";

export function PaySlipView({ slip, lang }: { slip: Slip; lang: Lang }) {
  const en = lang === "en";
  const paid = slip.status === "Paid";
  const when = slip.at ? new Date(slip.at).toLocaleString("en-IN") : "—";
  const rows: [string, string][] = [
    [en ? "Paid to" : "किसे भुगतान", "SK Computer & Education Centre"],
    ["UPI", UPI_ID],
    [en ? "Student's name" : "विद्यार्थी का नाम", slip.student || "—"],
    [en ? "Mobile" : "मोबाइल", slip.mobile],
    [en ? "Amount" : "रकम", slip.amount ? `Rs ${slip.amount}` : "—"],
    [en ? "Method" : "माध्यम", slip.method || "—"],
    [en ? "Payer UPI" : "भुगतानकर्ता UPI", slip.payerUpi || "—"],
    [en ? "Time" : "समय", when],
    [en ? "Fee status" : "फीस स्थिति", paid ? "Paid" : "Not paid"],
  ];
  return (
    <article className="slip-sheet print-form text-ink">
      <div className="paper-form">
        <img src="/form-watermark.png?v=logo" alt="" className="paper-wm" />
        <div className="paper-body">
          <h2 className="paper-title">
            <CentreName look="plain" className="text-[22pt]" />
          </h2>
          <p className="paper-address">{ADDRESS_EN}</p>
          <div className="paper-meta">
            <p className="paper-serial font-bold">{slip.serial ? `S.No. ${slip.serial}` : "S.No."}</p>
            <p className="paper-admit">{en ? "Pay Slip" : "पे स्लिप"}</p>
            <p className="paper-phone font-bold">
              <Phone className="size-4 shrink-0" aria-hidden="true" />
              {PHONE_DISPLAY}
            </p>
          </div>
          <div className="paper-rows" style={{ marginTop: "3mm" }}>
            {rows.map(([label, value]) => (
              <div key={label} className="paper-row">
                <b>{label}</b>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}