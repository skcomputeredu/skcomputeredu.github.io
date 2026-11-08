import { UPI_ID } from "@/lib/site";

export const PAY_APPS = [
  { name: "Paytm", pkg: "net.one97.paytm", scheme: "paytmmp" },
  { name: "PhonePe", pkg: "com.phonepe.app", scheme: "phonepe" },
  { name: "Google Pay", pkg: "com.google.android.apps.nbu.paisa.user", scheme: "tez" },
  { name: "Amazon Pay", pkg: "in.amazon.mShop.android.shopping", scheme: "upi" },
] as const;

export type PayAppName = (typeof PAY_APPS)[number]["name"];

function query(amount: string, note: string) {
  const params = new URLSearchParams({
    pa: UPI_ID,
    pn: "SK Computer & Education Centre",
    cu: "INR",
    tn: note,
  });
  if (amount) params.set("am", amount);
  return params.toString();
}

export function appPayUrl(name: PayAppName, amount: string, android: boolean) {
  const app = PAY_APPS.find((item) => item.name === name)!;
  const q = query(amount, "SK Computer & Education Centre fee");
  if (android) return `intent://pay?${q}#Intent;scheme=upi;package=${app.pkg};end`;
  if (app.scheme === "tez") return `tez://upi/pay?${q}`;
  if (app.scheme === "upi") return `upi://pay?${q}`;
  return `${app.scheme}://pay?${q}`;
}

export function upiPayUrl(amount: string, note: string, android: boolean) {
  const q = query(amount, note);
  if (android) return `intent://pay?${q}#Intent;scheme=upi;end`;
  return `upi://pay?${q}`;
}
