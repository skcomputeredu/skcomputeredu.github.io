import { useEffect, useRef, useState } from "react";
import { UPI_ID } from "@/lib/site";
import { PAY_APPS, appPayUrl, upiPayUrl, type PayAppName } from "@/lib/upi";

const field =
  "min-h-12 w-full rounded-2xl border border-line bg-ivory px-4 text-base text-ink outline-none focus:border-navy";

const PAY_LOGOS: Record<PayAppName, { src: string; alt: string }> = {
  Paytm: { src: "/pay/paytm.png", alt: "Paytm" },
  PhonePe: { src: "/pay/phonepe.png", alt: "PhonePe" },
  "Google Pay": { src: "/pay/gpay.png", alt: "Google Pay" },
  "Amazon Pay": { src: "/pay/amazon-pay.png", alt: "Amazon Pay" },
};

export function PayAppIcons({ amount, onPay }: { amount: string; onPay?: (name: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {PAY_APPS.map((app) => {
        const logo = PAY_LOGOS[app.name];
        return (
          <button
            key={app.name}
            type="button"
            onClick={() => {
              const isAndroid = /Android/i.test(navigator.userAgent);
              onPay?.(app.name);
              window.location.href = appPayUrl(app.name, amount, isAndroid);
            }}
            className="pay-raise flex min-h-[4.5rem] w-full items-center gap-3 rounded-2xl border border-[#d9d0bc] px-3 py-2 text-left touch-manipulation"
          >
            <img
              src={logo.src}
              alt=""
              className={`h-12 w-14 shrink-0 object-contain ${app.name === "Paytm" ? "rounded-xl" : ""}`}
            />
            <span className="font-plain text-sm font-extrabold tracking-tight text-navy sm:text-base">{logo.alt}</span>
          </button>
        );
      })}
    </div>
  );
}

export function FeeMethods({
  en,
  amount,
  onAmount,
  payerUpi,
  onPayerUpi,
  onMarkPaid,
}: {
  en: boolean;
  amount: string;
  onAmount: (value: string) => void;
  payerUpi: string;
  onPayerUpi: (value: string) => void;
  onMarkPaid: (method: string) => void;
}) {
  const [android, setAndroid] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [method, setMethod] = useState("");
  const [cardNote, setCardNote] = useState("");
  const [card, setCard] = useState<"" | "debit" | "credit">("");
  const cardLock = useRef(0);

  function toggleCard(kind: "debit" | "credit") {
    const now = Date.now();
    if (now - cardLock.current < 400) return;
    cardLock.current = now;
    setCardNote("");
    setCard((current) => (current === kind ? "" : kind));
  }

  useEffect(() => {
    setAndroid(/Android/i.test(navigator.userAgent));
  }, []);

  function openPay(next: string, href: string) {
    setMethod(next);
    setCardNote("");
    window.location.href = href;
  }

  return (
    <div className="grid gap-4">
      <label className="grid gap-2 text-sm font-medium text-navy">
        {en ? "Amount" : "रकम"}
        <input
          className={field}
          inputMode="decimal"
          value={amount}
          placeholder="500"
          onChange={(event) => onAmount(event.target.value.replace(/[^\d.]/g, "").slice(0, 8))}
        />
      </label>
      <PayAppIcons
        amount={amount}
        onPay={(name) => {
          setMethod(name);
          setCardNote("");
        }}
      />
      <div className="rounded-2xl border border-line bg-ivory p-4">
        <p className="font-plain text-sm font-semibold text-navy">{en ? "Pay with UPI ID" : "UPI ID से भुगतान"}</p>
        <p className="mt-1 text-sm text-muted">
          {en ? "Money is paid to" : "पैसा इसी UPI पर जाएगा"} {UPI_ID}
        </p>
        <input
          className={`${field} mt-3`}
          value={payerUpi}
          placeholder={en ? "Your UPI ID (optional)" : "आपकी UPI ID (ज़रूरी नहीं)"}
          onChange={(event) => onPayerUpi(event.target.value.slice(0, 80))}
        />
        <button
          type="button"
          onClick={() => openPay(payerUpi ? `UPI ${payerUpi}` : "UPI", upiPayUrl(amount, "SK Computer & Education Centre fee", android))}
          className="mt-3 inline-flex min-h-11 items-center rounded-full bg-navy px-4 font-semibold text-ivory"
        >
          {en ? "Open UPI app" : "UPI ऐप खोलें"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={card === "debit"}
          onClick={() => toggleCard("debit")}
          className={`min-h-14 rounded-2xl border px-3 font-plain text-base font-bold ${card === "debit" ? "border-navy bg-navy text-ivory" : "border-line bg-white text-navy"}`}
        >
          {en ? "Debit card" : "डेबिट कार्ड"}
        </button>
        <button
          type="button"
          aria-pressed={card === "credit"}
          onClick={() => toggleCard("credit")}
          className={`min-h-14 rounded-2xl border px-3 font-plain text-base font-bold ${card === "credit" ? "border-navy bg-navy text-ivory" : "border-line bg-white text-navy"}`}
        >
          {en ? "Credit card" : "क्रेडिट कार्ड"}
        </button>
      </div>
      {card === "debit" ? (
        <CardBox
          en={en}
          title={en ? "Debit card" : "डेबिट कार्ड"}
          onPay={() => openPay("Debit card", upiPayUrl(amount, "Fee by debit card", android))}
          onInvalid={setCardNote}
        />
      ) : null}
      {card === "credit" ? (
        <CardBox
          en={en}
          title={en ? "Credit card" : "क्रेडिट कार्ड"}
          onPay={() => openPay("Credit card", upiPayUrl(amount, "Fee by credit card", android))}
          onInvalid={setCardNote}
        />
      ) : null}
      <p className="text-sm text-muted">
        {en
          ? "Card number, expiry and CVC are not saved on this website. Card and UPI payments open your UPI app and the money goes to sksir@ptaxis."
          : "कार्ड नंबर, एक्सपायरी और CVC इस वेबसाइट पर सेव नहीं होते। कार्ड और UPI का भुगतान ऐप में खुलता है और पैसा sksir@ptaxis पर जाता है।"}
      </p>
      {cardNote ? <p className="text-sm font-medium text-[#c5161d]">{cardNote}</p> : null}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setQrOpen(true)}
          className="inline-flex min-h-16 w-full max-w-sm items-center justify-center gap-3 rounded-2xl border-2 border-navy bg-white px-6 font-plain text-base font-bold text-navy"
        >
          <QrMark />
          QR
        </button>
      </div>
      <button
        type="button"
        onClick={() => onMarkPaid(method || "UPI")}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-4 font-semibold text-navy"
      >
        {en ? "Payment done — mark Paid" : "भुगतान हो गया — Paid करें"}
      </button>
      {qrOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/70 p-5" role="dialog" aria-modal="true">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center">
            <p className="font-semibold text-navy">{en ? "Scan to pay" : "स्कैन करके भुगतान करें"}</p>
            <img src="/upi-qr.png" alt={UPI_ID} className="mx-auto mt-4 w-56 max-w-full" />
            <p className="mt-2 text-sm text-muted">{UPI_ID}</p>
            <button type="button" onClick={() => setQrOpen(false)} className="mt-4 min-h-11 rounded-full bg-navy px-5 font-semibold text-ivory">
              {en ? "Close" : "बंद करें"}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function CardBox({
  en,
  title,
  onPay,
  onInvalid,
}: {
  en: boolean;
  title: string;
  onPay: () => void;
  onInvalid: (message: string) => void;
}) {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  function pay() {
    const digits = number.replace(/\s/g, "");
    const month = Number(expiry.slice(0, 2));
    if (name.trim().length < 2 || !/^\d{13,19}$/.test(digits) || !/^\d{2}\/\d{2}$/.test(expiry) || month < 1 || month > 12 || !/^\d{3,4}$/.test(cvc)) {
      onInvalid(en ? "Check the card name, number, expiry and CVC." : "कार्ड का नाम, नंबर, एक्सपायरी और CVC जाँचें।");
      return;
    }
    setNumber("");
    setCvc("");
    onInvalid("");
    onPay();
  }

  return (
    <div className="grid gap-2 rounded-2xl border border-line bg-white p-4">
      <p className="font-plain font-semibold text-navy">{title}</p>
      <input className={field} value={name} autoComplete="cc-name" placeholder={en ? "Card holder name" : "कार्ड होल्डर का नाम"} onChange={(event) => setName(event.target.value)} />
      <input
        className={field}
        inputMode="numeric"
        autoComplete="cc-number"
        value={number}
        placeholder={en ? "Card number" : "कार्ड नंबर"}
        onChange={(event) => {
          const digits = event.target.value.replace(/\D/g, "").slice(0, 19);
          setNumber(digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim());
        }}
      />
      <div className="grid grid-cols-2 gap-2">
        <input
          className={field}
          inputMode="numeric"
          autoComplete="cc-exp"
          value={expiry}
          placeholder="MM/YY"
          onChange={(event) => {
            const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
            setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
          }}
        />
        <input
          className={field}
          inputMode="numeric"
          autoComplete="cc-csc"
          value={cvc}
          placeholder="CVC"
          onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))}
        />
      </div>
      <button type="button" onClick={pay} className="min-h-11 rounded-full bg-navy font-semibold text-ivory">
        {en ? "Pay" : "भुगतान"}
      </button>
    </div>
  );
}

function QrMark() {
  return (
    <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden="true">
      <rect x="2" y="2" width="12" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="5" y="5" width="6" height="6" fill="currentColor" />
      <rect x="18" y="2" width="12" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="21" y="5" width="6" height="6" fill="currentColor" />
      <rect x="2" y="18" width="12" height="12" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="5" y="21" width="6" height="6" fill="currentColor" />
      <rect x="18" y="18" width="4" height="4" fill="currentColor" />
      <rect x="24" y="18" width="6" height="4" fill="currentColor" />
      <rect x="18" y="24" width="12" height="6" fill="currentColor" />
    </svg>
  );
}