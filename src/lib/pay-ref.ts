const KEY = "sk-pay-attempt";

export type PayAttempt = {
  txn: string;
  amount: string;
  method: string;
  started: number;
  left: boolean;
};

export type PayDone = {
  method: string;
  txn: string;
  utr: string;
  amount: string;
  ok: boolean;
};

export function newTxn() {
  const now = new Date();
  const day = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SKC${day}${rand}`;
}

export function newUtr() {
  let value = "";
  for (let i = 0; i < 12; i += 1) value += Math.floor(Math.random() * 10);
  return value;
}

export function saveAttempt(attempt: PayAttempt) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(attempt));
  } catch {
    /* the page can still show the popup in memory */
  }
}

export function readAttempt(): PayAttempt | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PayAttempt;
    if (!parsed?.txn || Date.now() - parsed.started > 1000 * 60 * 45) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function markAttemptLeft() {
  const current = readAttempt();
  if (!current) return;
  saveAttempt({ ...current, left: true });
}

export function clearAttempt() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
