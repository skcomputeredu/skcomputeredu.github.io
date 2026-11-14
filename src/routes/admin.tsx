import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FilledForm, saveServerPdf } from "@/components/filled-form";
import {
  adminList,
  adminLogin,
  adminOne,
  adminPassword,
  adminPurge,
  adminRecover,
  adminSoftDelete,
  adminTrash,
  readFeeGate,
  readSignGate,
  readManagerSign,
  setManagerSign,
  readUploadGates,
  setFeeGate,
  setSignGate,
  setSignPart,
  setUploadGate,
  type AdmissionForm,
  type AdmissionRow,
} from "@/lib/admissions";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin · SK Computer & Education Centre" }],
  }),
  component: AdminPage,
});

const TOKEN = "sk-admin-token";
const GATES = "sk-admin-gates";

type GateSnap = {
  fee: boolean;
  sign: boolean;
  applicant: boolean;
  parent: boolean;
  manager: boolean;
  pad: boolean;
  photo: boolean;
  document: boolean;
  aadhaar: boolean;
  signature: boolean;
};

function readRemembered(): GateSnap | null {
  try {
    const raw = window.localStorage.getItem(GATES);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<GateSnap>;
    if (typeof data.fee !== "boolean" || typeof data.sign !== "boolean") return null;
    return {
      fee: data.fee,
      sign: data.sign,
      applicant: data.applicant !== false,
      parent: data.parent !== false,
      manager: Boolean(data.manager),
      pad: Boolean(data.pad),
      photo: data.photo !== false,
      document: data.document !== false,
      aadhaar: data.aadhaar !== false,
      signature: data.signature !== false,
    };
  } catch {
    return null;
  }
}

function rememberGates(snap: GateSnap) {
  window.localStorage.setItem(GATES, JSON.stringify(snap));
}

function AdminPage() {
  const { lang } = useI18n();
  const en = lang === "en";
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rows, setRows] = useState<AdmissionRow[]>([]);
  const [trash, setTrash] = useState<AdmissionRow[]>([]);
  const [tab, setTab] = useState<"live" | "trash">("live");
  const [open, setOpen] = useState<{ id: number; serial: number; form: AdmissionForm } | null>(null);
  const [nextPassword, setNextPassword] = useState("");
  const [feeOn, setFeeOn] = useState(false);
  const [signOn, setSignOn] = useState(true);
  const [applicantOn, setApplicantOn] = useState(true);
  const [parentOn, setParentOn] = useState(true);
  const [managerOn, setManagerOn] = useState(false);
  const [managerImage, setManagerImage] = useState("");
  const [padOn, setPadOn] = useState(false);
  const [padImage, setPadImage] = useState("");
  const [uploads, setUploads] = useState({ photo: true, document: true, aadhaar: true, signature: true });
  const [controlsOpen, setControlsOpen] = useState(false);
  const [busyId, setBusyId] = useState(0);
  const [viewId, setViewId] = useState(0);
  const [downId, setDownId] = useState(0);
  const gateWrites = useRef({ fee: 0, sign: 0, applicant: 0, parent: 0, manager: 0, upload: 0 });
  const gatesRef = useRef<GateSnap>({
    fee: false,
    sign: true,
    applicant: true,
    parent: true,
    manager: false,
    pad: false,
    photo: true,
    document: true,
    aadhaar: true,
    signature: true,
  });
  const rowBusy = useRef(false);
  const hitAt = useRef<Record<string, number>>({});
  const tapStart = useRef<Record<string, { x: number; y: number }>>({});

  function pressRow(id: number) {
    removeRow(id);
  }

  function tapProps(key: string, run: () => void) {
    const fire = () => {
      const now = Date.now();
      if (now - (hitAt.current[key] || 0) < 350) return;
      hitAt.current[key] = now;
      run();
    };
    return {
      onPointerDown: (event: React.PointerEvent<HTMLElement>) => {
        if (event.button > 0) return;
        tapStart.current[key] = { x: event.clientX, y: event.clientY };
      },
      onPointerUp: (event: React.PointerEvent<HTMLElement>) => {
        if (event.button > 0) return;
        const start = tapStart.current[key];
        if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 14) return;
        fire();
      },
      onClick: () => {
        fire();
      },
    };
  }

  async function load(tok: string) {
    const [live, bin] = await Promise.all([adminList({ data: { token: tok } }), adminTrash({ data: { token: tok } })]);
    setRows(live);
    setTrash(bin);
  }

  function applySnap(snap: GateSnap) {
    gatesRef.current = snap;
    setFeeOn(snap.fee);
    setSignOn(snap.sign);
    setApplicantOn(snap.applicant);
    setParentOn(snap.parent);
    setManagerOn(snap.manager);
    setPadOn(snap.pad);
    setUploads({ photo: snap.photo, document: snap.document, aadhaar: snap.aadhaar, signature: snap.signature });
  }

  function keep(partial: Partial<GateSnap>) {
    const next = { ...gatesRef.current, ...partial };
    gatesRef.current = next;
    rememberGates(next);
  }

  async function restoreGates(tok: string) {
    const [gate, signs, files, manager] = await Promise.all([
      readFeeGate({ data: {} }),
      readSignGate({ data: {} }),
      readUploadGates({ data: {} }),
      readManagerSign({ data: { token: tok } }),
    ]);
    const server: GateSnap = {
      fee: gate.required,
      sign: signs.enabled,
      applicant: signs.applicant,
      parent: signs.parent,
      manager: manager.enabled,
      pad: Boolean(manager.padEnabled),
      photo: files.photo,
      document: files.document,
      aadhaar: files.aadhaar,
      signature: files.signature,
    };
    const remembered = readRemembered();
    const next = remembered ?? server;
    applySnap(next);
    setManagerImage(manager.image || "");
    setPadImage(manager.padImage || "");
    if (!remembered) {
      rememberGates(server);
      return;
    }
    const jobs: Promise<unknown>[] = [];
    if (next.fee !== server.fee) jobs.push(setFeeGate({ data: { token: tok, enabled: next.fee } }));
    if (next.sign !== server.sign) jobs.push(setSignGate({ data: { token: tok, enabled: next.sign } }));
    if (next.applicant !== server.applicant) jobs.push(setSignPart({ data: { token: tok, part: "applicant", enabled: next.applicant } }));
    if (next.parent !== server.parent) jobs.push(setSignPart({ data: { token: tok, part: "parent", enabled: next.parent } }));
    if (next.manager !== server.manager || next.pad !== server.pad) {
      jobs.push(setManagerSign({ data: { token: tok, enabled: next.manager, padEnabled: next.pad } }));
    }
    if (next.photo !== server.photo) jobs.push(setUploadGate({ data: { token: tok, key: "upload_photo", enabled: next.photo } }));
    if (next.document !== server.document) jobs.push(setUploadGate({ data: { token: tok, key: "upload_document", enabled: next.document } }));
    if (next.aadhaar !== server.aadhaar) jobs.push(setUploadGate({ data: { token: tok, key: "upload_aadhaar", enabled: next.aadhaar } }));
    if (next.signature !== server.signature) jobs.push(setUploadGate({ data: { token: tok, key: "upload_signature", enabled: next.signature } }));
    if (jobs.length) await Promise.all(jobs);
  }

  useEffect(() => {
    void readFeeGate({ data: {} }).catch(() => undefined);
    const saved = window.sessionStorage.getItem(TOKEN);
    if (!saved) return;
    setToken(saved);
    load(saved).catch(() => {
      window.setTimeout(() => {
        load(saved).catch(() => {
          window.sessionStorage.removeItem(TOKEN);
          setToken("");
        });
      }, 400);
    });
    const kept = readRemembered();
    if (kept) applySnap(kept);
    restoreGates(saved).catch(() => {
      if (kept) applySnap(kept);
    });
  }, []);

  async function enter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const field = event.currentTarget.elements.namedItem("password");
    const typed = (field instanceof HTMLInputElement ? field.value : password).trim();
    const clearPassword = () => {
      setPassword("");
      if (field instanceof HTMLInputElement) field.value = "";
    };
    if (typed.length < 4) {
      clearPassword();
      setError(en ? "Wrong password." : "पासवर्ड गलत है।");
      return;
    }
    try {
      let result = await adminLogin({ data: { password: typed } }).catch(() => null);
      if (!result) result = await adminLogin({ data: { password: typed } });
      if (!result.ok) {
        clearPassword();
        setError(en ? "Wrong password." : "पासवर्ड गलत है।");
        return;
      }
      window.sessionStorage.setItem(TOKEN, result.token);
      setToken(result.token);
      setPassword("");
      void import("@/lib/admission-pdf").then((mod) => mod.warmAdmissionPdf());
      try {
        await load(result.token);
        await restoreGates(result.token);
      } catch {
        setError(
          en
            ? "The list did not load. Open the page once more."
            : "सूची नहीं खुली। पेज एक बार फिर खोलें।",
        );
      }
    } catch {
      clearPassword();
      setError(en ? "Could not open. Try the password again." : "नहीं खुला। पासवर्ड फिर से डालें।");
    }
  }

  async function show(id: number) {
    if (!token) return;
    const detail = await adminOne({ data: { token, id } });
    if (detail) {
      setOpen(detail);
      setViewId(id);
      window.setTimeout(() => document.getElementById("admin-form")?.scrollIntoView({ behavior: "smooth", block: "start" }), 40);
    } else {
      setViewId(0);
    }
  }

  async function flipFee(enabled: boolean) {
    if (!token) return;
    const rev = ++gateWrites.current.fee;
    setFeeOn(enabled);
    setError("");
    try {
      const result = await setFeeGate({ data: { token, enabled } });
      if (gateWrites.current.fee === rev) {
        setFeeOn(result.required);
        keep({ fee: result.required });
      }
    } catch {
      if (gateWrites.current.fee !== rev) return;
      setFeeOn(!enabled);
      setError(en ? "Could not update the fee setting." : "फीस की सेटिंग नहीं बदली।");
    }
  }

  async function flipSign(enabled: boolean) {
    if (!token) return;
    const rev = ++gateWrites.current.sign;
    setSignOn(enabled);
    setError("");
    try {
      const result = await setSignGate({ data: { token, enabled } });
      if (gateWrites.current.sign === rev) {
        setSignOn(result.enabled);
        keep({ sign: result.enabled });
      }
    } catch {
      if (gateWrites.current.sign !== rev) return;
      setSignOn(!enabled);
      setError(en ? "Could not update the signature setting." : "हस्ताक्षर की सेटिंग नहीं बदली।");
    }
  }

  async function flipSignPart(part: "applicant" | "parent", enabled: boolean) {
    if (!token) return;
    const rev = ++gateWrites.current[part];
    if (part === "applicant") setApplicantOn(enabled);
    else setParentOn(enabled);
    setError("");
    try {
      const result = await setSignPart({ data: { token, part, enabled } });
      if (gateWrites.current[part] !== rev) return;
      setApplicantOn(result.applicant);
      setParentOn(result.parent);
      keep({ applicant: result.applicant, parent: result.parent });
    } catch {
      if (gateWrites.current[part] !== rev) return;
      if (part === "applicant") setApplicantOn(!enabled);
      else setParentOn(!enabled);
      setError(en ? "Could not update the signature setting." : "हस्ताक्षर की सेटिंग नहीं बदली।");
    }
  }

  async function flipUpload(key: "upload_photo" | "upload_document" | "upload_aadhaar" | "upload_signature", field: "photo" | "document" | "aadhaar" | "signature", enabled: boolean) {
    if (!token) return;
    const rev = ++gateWrites.current.upload;
    setUploads((now) => ({ ...now, [field]: enabled }));
    setError("");
    try {
      const result = await setUploadGate({ data: { token, key, enabled } });
      if (gateWrites.current.upload === rev) {
        setUploads(result);
        keep({ photo: result.photo, document: result.document, aadhaar: result.aadhaar, signature: result.signature });
      }
    } catch {
      if (gateWrites.current.upload !== rev) return;
      setUploads((now) => ({ ...now, [field]: !enabled }));
      setError(en ? "Could not update the file setting." : "फ़ाइल की सेटिंग नहीं बदली।");
    }
  }

  async function flipManager(enabled: boolean) {
    if (!token) return;
    const rev = ++gateWrites.current.manager;
    setManagerOn(enabled);
    setError("");
    try {
      const result = await setManagerSign({ data: { token, enabled } });
      if (gateWrites.current.manager !== rev) return;
      setManagerOn(result.enabled);
      keep({ manager: result.enabled });
      if (result.image) setManagerImage(result.image);
    } catch {
      if (gateWrites.current.manager !== rev) return;
      setManagerOn(!enabled);
      setError(en ? "Could not update the manager signature." : "मैनेजर हस्ताक्षर की सेटिंग नहीं बदली।");
    }
  }

  async function flipPad(enabled: boolean) {
    if (!token) return;
    setPadOn(enabled);
    setError("");
    try {
      const result = await setManagerSign({
        data: { token, enabled: managerOn, padEnabled: enabled, padImage: enabled && padImage ? padImage : undefined },
      });
      setPadOn(Boolean(result.padEnabled));
      setManagerOn(result.enabled);
      keep({ pad: Boolean(result.padEnabled), manager: result.enabled });
      if (result.padImage) setPadImage(result.padImage);
    } catch {
      setPadOn(!enabled);
      setError(en ? "Could not update the digital signature." : "डिजिटल हस्ताक्षर की सेटिंग नहीं बदली।");
    }
  }

  async function keepPad(image: string) {
    setPadImage(image);
    if (!token || !padOn) return;
    try {
      const result = await setManagerSign({ data: { token, enabled: managerOn, padEnabled: true, padImage: image } });
      setPadOn(Boolean(result.padEnabled));
      if (result.padImage) setPadImage(result.padImage);
    } catch {
      setError(en ? "Could not save the digital signature." : "डिजिटल हस्ताक्षर सेव नहीं हुआ।");
    }
  }

  async function saveManagerFile(file: File | undefined) {
    if (!token || !file) return;
    setError("");
    try {
      const bitmap = await createImageBitmap(file, { resizeWidth: 800, resizeQuality: "medium" }).catch(() => createImageBitmap(file));
      const scale = Math.min(1, 800 / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(bitmap.width * scale));
      canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("canvas");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close?.();
      const image = canvas.toDataURL("image/jpeg", 0.7);
      if (image.length > 1_800_000) {
        setError(en ? "That signature image is too big. Use a smaller JPG." : "यह हस्ताक्षर बहुत बड़ा है। छोटी JPG चुनें।");
        return;
      }
      const result = await setManagerSign({ data: { token, enabled: true, image } });
      setManagerOn(result.enabled);
      setManagerImage(result.image || image);
    } catch {
      setError(en ? "Could not save the manager signature." : "मैनेजर का हस्ताक्षर सेव नहीं हुआ।");
    }
  }

  async function runRow(id: number, work: () => Promise<unknown>, refresh = true) {
    if (!token || rowBusy.current) return;
    rowBusy.current = true;
    setBusyId(id);
    setError("");
    try {
      await work();
      if (open?.id === id) {
        setOpen(null);
        setViewId(0);
      }
      if (refresh) await load(token);
    } catch {
      setError(en ? "Could not update the list." : "सूची नहीं बदली।");
    } finally {
      rowBusy.current = false;
      setBusyId(0);
    }
  }

  function removeRow(id: number) {
    if (!Number.isInteger(id) || id <= 0 || !token) return;
    if (tab === "trash") {
      const ok = window.confirm(
        en ? "Permanently delete this form? It cannot be recovered." : "यह फ़ॉर्म हमेशा के लिए मिट जाएगा। वापस नहीं आएगा।",
      );
      if (!ok) return;
      void runRow(id, () => adminPurge({ data: { token, id } }));
      return;
    }
    const kept = rows.find((item) => item.id === id);
    void runRow(id, async () => {
      const result = await adminSoftDelete({ data: { token, id } });
      if (!result.ok) throw new Error("miss");
      if (kept) {
        setRows((list) => list.filter((item) => item.id !== id));
        setTrash((list) => [kept, ...list.filter((item) => item.id !== id)]);
      }
      try {
        const [live, bin] = await Promise.all([adminList({ data: { token } }), adminTrash({ data: { token } })]);
        setRows(live);
        const still = live.some((item) => item.id === id) || bin.some((item) => item.id === id);
        setTrash(still || !kept ? bin : [kept, ...bin]);
      } catch {
        /* the row is already in Trash on this screen */
      }
    }, false);
  }

  function logout() {
    window.sessionStorage.removeItem(TOKEN);
    setToken("");
    setOpen(null);
    setPassword("");
    setError("");
  }

  async function savePassword(event: React.FormEvent) {
    event.preventDefault();
    if (!token || nextPassword.trim().length < 6) return;
    await adminPassword({ data: { token, password: nextPassword.trim() } });
    setNextPassword("");
    setError(en ? "Password updated." : "पासवर्ड बदल गया।");
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-5 py-16">
        <p className="text-xs font-semibold tracking-widest text-gold-deep uppercase">Admin use only</p>
        <h1 className="mt-2 font-display text-4xl text-navy">{en ? "Centre Owner" : "सेंटर मालिक"}</h1>
        <p className="mt-3 text-muted">
          {en
            ? "Students cannot open this list. Enter the owner password."
            : "यह सूची विद्यार्थी नहीं खोल सकते। मालिक का पासवर्ड डालें।"}
        </p>
        <form onSubmit={enter} className="mt-6 grid gap-3">
          <input
            type="password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="min-h-12 rounded-2xl border border-line bg-ivory px-4"
            aria-label={en ? "Password" : "पासवर्ड"}
          />
          <button type="submit" className="min-h-11 rounded-full bg-navy px-5 font-semibold text-ivory touch-manipulation">
            {en ? "Open" : "खोलें"}
          </button>
          {error ? <p className="text-sm font-medium text-gold-deep">{error}</p> : null}
        </form>
      </div>
    );
  }

  const shown = tab === "live" ? rows : trash;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="no-print">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-widest text-gold-deep uppercase">Admin Use Only</p>
            <h1 className="mt-2 font-display text-4xl text-navy">{en ? "Submitted Forms" : "आए हुए फ़ॉर्म"}</h1>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-1 min-h-9 shrink-0 rounded-full border border-line px-3 text-sm font-semibold text-navy touch-manipulation"
          >
            {en ? "Logout" : "लॉगआउट"}
          </button>
        </div>
        <button
          type="button"
          aria-expanded={controlsOpen}
          onClick={() => setControlsOpen((open) => !open)}
          className="mt-4 flex min-h-12 w-full items-center justify-between rounded-xl border-2 border-navy bg-navy px-4 font-plain text-base font-bold text-ivory touch-manipulation"
        >
          <span>{en ? "Admin Control" : "एडमिन कंट्रोल"}</span>
          <span>{controlsOpen ? (en ? "Close" : "बंद") : en ? "Open" : "खोलें"}</span>
        </button>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label={en ? "Admin sections" : "एडमिन भाग"}>
          <button
            type="button"
            onClick={() => {
              setTab("live");
              setOpen(null);
              setViewId(0);
            }}
            className={`min-h-11 rounded-full px-5 font-plain text-base font-bold ${tab === "live" ? "bg-navy text-ivory" : "border border-line text-navy"}`}
          >
            {en ? "Forms" : "फ़ॉर्म"}
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("trash");
              setOpen(null);
              setViewId(0);
            }}
            className={`min-h-11 rounded-full px-5 font-plain text-base font-bold ${tab === "trash" ? "bg-navy text-ivory" : "border border-line text-navy"}`}
          >
            {en ? "Trash" : "ट्रैश"}
            {trash.length ? ` (${trash.length})` : ""}
          </button>
        </nav>
        {tab === "live" && controlsOpen ? (
          <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-line bg-paper p-4">
            <div>
              <p className="font-plain text-lg font-bold text-navy">{en ? "Registration Fee" : "रजिस्ट्रेशन फीस"}</p>
              <p className="mt-1 text-sm text-muted">
                {feeOn
                  ? en
                    ? "Enabled. A form cannot be submitted until the registration fee is marked Paid."
                    : "इनेबल है। रजिस्ट्रेशन फीस Paid किए बिना फ़ॉर्म सबमिट नहीं होगा।"
                  : en
                    ? "Disabled. A form can be submitted without the registration fee."
                    : "डिसेबल है। बिना रजिस्ट्रेशन फीस के फ़ॉर्म सबमिट हो जाएगा।"}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={feeOn}
              {...tapProps("fee", () => void flipFee(!feeOn))}
              className="inline-flex min-h-12 items-center gap-3 touch-manipulation"
            >
              <span className={`relative h-8 w-14 shrink-0 rounded-full ${feeOn ? "bg-navy" : "bg-[#cfc6b4]"}`}>
                <span className={`absolute top-1 size-6 rounded-full bg-white shadow ${feeOn ? "left-7" : "left-1"}`} />
              </span>
              <span className="font-plain text-lg font-bold text-navy">{feeOn ? (en ? "Enable" : "इनेबल") : en ? "Disable" : "डिसेबल"}</span>
            </button>
          </div>
          <div className="mt-4 rounded-3xl border border-line bg-paper p-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-plain text-lg font-bold text-navy">{en ? "Digital Signatures" : "डिजिटल हस्ताक्षर"}</p>
                <p className="mt-1 text-sm text-muted">
                  {signOn
                    ? en
                      ? "Enabled. The registration form shows the applicant and parent signature boxes."
                      : "इनेबल है। रजिस्ट्रेशन फ़ॉर्म में आवेदक और माता-पिता के हस्ताक्षर बॉक्स दिखते हैं।"
                    : en
                      ? "Disabled. Those two signature boxes are hidden, and the form can be submitted without them."
                      : "डिसेबल है। वे दोनों बॉक्स नहीं दिखते, और बिना उनके फ़ॉर्म जा सकता है।"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={signOn}
                {...tapProps("sign", () => void flipSign(!signOn))}
                className="inline-flex min-h-12 items-center gap-3 touch-manipulation"
              >
                <span className={`relative h-8 w-14 shrink-0 rounded-full ${signOn ? "bg-navy" : "bg-[#cfc6b4]"}`}>
                  <span className={`absolute top-1 size-6 rounded-full bg-white shadow ${signOn ? "left-7" : "left-1"}`} />
                </span>
                <span className="font-plain text-lg font-bold text-navy">{signOn ? (en ? "Enable" : "इनेबल") : en ? "Disable" : "डिसेबल"}</span>
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-plain text-base font-bold text-navy">{en ? "Applicant Signature" : "आवेदक हस्ताक्षर"}</span>
              <button
                type="button"
                role="switch"
                aria-checked={applicantOn}
                {...tapProps("sign-applicant", () => void flipSignPart("applicant", !applicantOn))}
                className="inline-flex min-h-12 items-center gap-3 touch-manipulation"
              >
                <span className={`relative h-8 w-14 shrink-0 rounded-full ${applicantOn ? "bg-navy" : "bg-[#cfc6b4]"}`}>
                  <span className={`absolute top-1 size-6 rounded-full bg-white shadow ${applicantOn ? "left-7" : "left-1"}`} />
                </span>
                <span className="font-plain text-lg font-bold text-navy">{applicantOn ? (en ? "Enable" : "इनेबल") : en ? "Disable" : "डिसेबल"}</span>
              </button>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <span className="font-plain text-base font-bold text-navy">{en ? "Parent Signature" : "पेरेंट हस्ताक्षर"}</span>
              <button
                type="button"
                role="switch"
                aria-checked={parentOn}
                {...tapProps("sign-parent", () => void flipSignPart("parent", !parentOn))}
                className="inline-flex min-h-12 items-center gap-3 touch-manipulation"
              >
                <span className={`relative h-8 w-14 shrink-0 rounded-full ${parentOn ? "bg-navy" : "bg-[#cfc6b4]"}`}>
                  <span className={`absolute top-1 size-6 rounded-full bg-white shadow ${parentOn ? "left-7" : "left-1"}`} />
                </span>
                <span className="font-plain text-lg font-bold text-navy">{parentOn ? (en ? "Enable" : "इनेबल") : en ? "Disable" : "डिसेबल"}</span>
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-3xl border border-line bg-paper p-4">
            <p className="font-plain text-lg font-bold text-navy">{en ? "Manager Signature" : "मैनेजर का हस्ताक्षर"}</p>
            <p className="mt-1 max-w-xl text-sm text-muted">
              {managerOn
                ? en
                  ? "Enabled. This signature is stored once and prints on the bottom right of every student form and every admin download."
                  : "इनेबल है। यह हस्ताक्षर एक बार सेव रहता है और हर विद्यार्थी फ़ॉर्म तथा हर एडमिन डाउनलोड में नीचे दाईं ओर अपने आप आता है।"
                : en
                  ? "Disabled. Turn it on and upload the manager signature once. It then stays on every form."
                  : "डिसेबल है। इसे चालू करके मैनेजर का हस्ताक्षर एक बार अपलोड करें। उसके बाद हर फ़ॉर्म पर रहेगा।"}
            </p>
            {managerImage ? (
              <img src={managerImage} alt="" className="mt-3 h-16 max-w-48 rounded-lg border border-line bg-white object-contain p-1" />
            ) : null}
            <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center rounded-full border border-navy px-4 text-sm font-semibold text-navy">
              {en ? "Upload Signature" : "हस्ताक्षर अपलोड"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                className="sr-only"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  void saveManagerFile(file);
                }}
              />
            </label>
            <button
              type="button"
              role="switch"
              aria-checked={managerOn}
              {...tapProps("manager", () => void flipManager(!managerOn))}
              className="mt-3 flex min-h-12 items-center gap-3 touch-manipulation"
            >
              <span className={`relative h-8 w-14 shrink-0 rounded-full ${managerOn ? "bg-navy" : "bg-[#cfc6b4]"}`}>
                <span className={`absolute top-1 size-6 rounded-full bg-white shadow ${managerOn ? "left-7" : "left-1"}`} />
              </span>
              <span className="font-plain text-lg font-bold text-navy">{managerOn ? (en ? "Enable" : "इनेबल") : en ? "Disable" : "डिसेबल"}</span>
            </button>
            <ManagerPad
              title={en ? "Digital Signature" : "डिजिटल हस्ताक्षर"}
              clearLabel={en ? "Clear" : "साफ़"}
              onInk={(image) => void keepPad(image)}
            />
            {padImage ? <img src={padImage} alt="" className="mt-2 h-14 max-w-48 bg-white object-contain" /> : null}
            <button
              type="button"
              role="switch"
              aria-checked={padOn}
              {...tapProps("manager-pad", () => void flipPad(!padOn))}
              className="mt-2 inline-flex min-h-11 items-center gap-3 touch-manipulation"
            >
              <span className={`relative h-7 w-12 shrink-0 rounded-full ${padOn ? "bg-navy" : "bg-[#cfc6b4]"}`}>
                <span className={`absolute top-0.5 size-6 rounded-full bg-white shadow ${padOn ? "left-5" : "left-0.5"}`} />
              </span>
              <span className="font-plain text-sm font-bold text-navy">{padOn ? (en ? "Enable" : "इनेबल") : en ? "Disable" : "डिसेबल"}</span>
            </button>
          </div>
          <ul className="mt-4 grid grid-cols-4 gap-2">
            {(
              [
                ["upload_photo", "photo", en ? "Photo" : "फोटो"],
                ["upload_document", "document", en ? "Document" : "दस्तावेज़"],
                ["upload_aadhaar", "aadhaar", en ? "Aadhaar" : "आधार"],
                ["upload_signature", "signature", en ? "Signature" : "हस्ताक्षर"],
              ] as const
            ).map(([key, field, label]) => {
              const on = uploads[field];
              return (
                <li key={key}>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={label}
                    {...tapProps(key, () => void flipUpload(key, field, !on))}
                    className="flex min-h-11 w-full flex-col items-center justify-center gap-1 rounded-xl border border-line bg-paper px-1 py-2 touch-manipulation"
                  >
                    <span className="text-center font-plain text-[11px] font-bold leading-tight text-navy sm:text-sm">{label}</span>
                    <span className={`relative h-7 w-12 shrink-0 rounded-full ${on ? "bg-navy" : "bg-[#cfc6b4]"}`}>
                      <span className={`absolute top-0.5 size-6 rounded-full bg-white shadow ${on ? "left-5" : "left-0.5"}`} />
                    </span>
                    <span className="text-[10px] font-bold text-navy">{on ? (en ? "Enable" : "इनेबल") : en ? "Disable" : "डिसेबल"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          </>
        ) : tab === "trash" ? (
          <p className="mt-4 text-sm text-muted">
            {en
              ? "Deleted forms sit here. Recover puts a form back in the table. Delete removes it forever."
              : "डिलीट हुए फ़ॉर्म यहाँ हैं। रिकवर से फ़ॉर्म वापस टेबल में आ जाता है। डिलीट से वह हमेशा के लिए मिट जाता है।"}
          </p>
        ) : null}
        {error ? <p className="mt-3 text-sm font-medium text-navy">{error}</p> : null}
        <p className="mt-4 text-sm text-muted">
          {tab === "live"
            ? en
              ? "Nothing opens until you tap View. The name is not a link."
              : "व्यू पर टैप करने से पहले फ़ॉर्म नहीं खुलता। नाम पर लाइन नहीं है।"
            : null}
        </p>
        <div className="mt-3 overflow-x-auto rounded-2xl border border-navy">
          <table className="w-full min-w-[52rem] border-collapse text-left text-sm lg:min-w-full">
            <thead>
              <tr className="bg-navy text-ivory">
                {(tab === "live"
                  ? en
                    ? ["Serial", "Student Name", "Father Name", "Mobile", "Fee Status", "View", "Download", "Delete"]
                    : ["क्रम", "विद्यार्थी का नाम", "पिता का नाम", "मोबाइल", "फीस स्थिति", "व्यू", "डाउनलोड", "डिलीट"]
                  : en
                    ? ["Serial", "Student Name", "Father Name", "Mobile", "Fee Status", "Recover", "Delete"]
                    : ["क्रम", "विद्यार्थी का नाम", "पिता का नाम", "मोबाइल", "फीस स्थिति", "रिकवर", "डिलीट"]
                ).map((head) => (
                  <th key={head} className="border border-white/20 px-3 py-3 font-plain text-sm font-bold">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 ? (
                <tr>
                  <td colSpan={tab === "live" ? 8 : 7} className="border border-line px-3 py-4 text-muted">
                    {en ? "Nothing in this list." : "इस सूची में कुछ नहीं।"}
                  </td>
                </tr>
              ) : (
                shown.map((row, index) => (
                  <tr key={row.id} className={index % 2 ? "bg-ivory" : "bg-white"}>
                    <td className="border border-line px-3 py-2 font-plain text-base font-bold text-navy">{row.serial}</td>
                    <td className="border border-line px-3 py-2 text-navy">{row.student}</td>
                    <td className="border border-line px-3 py-2 text-navy">{row.father || "—"}</td>
                    <td className="border border-line px-3 py-2 text-navy">{row.mobile}</td>
                    <td className="border border-line px-3 py-2 font-semibold text-navy">{row.fee || "Not Paid"}</td>
                    <td className="border border-line px-3 py-2">
                      {tab === "live" ? (
                        <button
                          type="button"
                          {...tapProps(`view-${row.id}`, () => {
                            setViewId(row.id);
                            void show(row.id);
                          })}
                          className={`min-h-11 rounded-full px-4 font-semibold touch-manipulation ${viewId === row.id ? "bg-navy text-ivory" : "border border-navy bg-white text-navy"}`}
                        >
                          {en ? "View Form" : "फ़ॉर्म देखें"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === row.id}
                          {...tapProps(`recover-${row.id}`, () => void runRow(row.id, () => adminRecover({ data: { token, id: row.id } })))}
                          className="min-h-11 rounded-full bg-navy px-4 font-semibold text-ivory touch-manipulation"
                        >
                          {en ? "Recover" : "रिकवर"}
                        </button>
                      )}
                    </td>
                    {tab === "live" ? (
                      <td className="border border-line px-3 py-2">
                        <button
                          type="button"
                          {...tapProps(`down-${row.id}`, () => {
  setDownId(row.id);
  void (async () => {
    const detail = open?.id === row.id ? open : await adminOne({ data: { token, id: row.id } });
    if (!detail) return;
    const { downloadAdmissionPdf } = await import("@/lib/admission-pdf");
    await downloadAdmissionPdf(
      {
        ...detail.form,
        studentSign: signOn && applicantOn ? detail.form.studentSign : "",
        parentSign: signOn && parentOn ? detail.form.parentSign : "",
      },
      detail.serial,
      true,
      managerOn ? managerImage : "",
      padOn ? padImage : "",
    );
  })();
})}
  );
})();
                          className={`inline-flex min-h-11 items-center rounded-full px-4 font-semibold touch-manipulation ${downId === row.id ? "bg-navy text-ivory" : "border border-navy bg-white text-navy"}`}
                        >
                          {en ? "Download" : "डाउनलोड"}
                        </button>
                      </td>
                    ) : null}
                    <td className="border border-line px-3 py-2">
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        {...tapProps(`del-${row.id}`, () => pressRow(Number(row.id)))}
                        className="min-h-11 rounded-full border border-[#c5161d] px-4 font-semibold text-[#c5161d] touch-manipulation"
                      >
                        {busyId === row.id ? (en ? "Please Wait" : "रुकें") : en ? "Delete" : "डिलीट"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <form onSubmit={savePassword} className="mt-8 flex flex-wrap gap-3">
          <input
            type="password"
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
            placeholder={en ? "New Password" : "नया पासवर्ड"}
            className="min-h-12 flex-1 rounded-2xl border border-line bg-ivory px-4"
          />
          <button type="submit" className="min-h-11 rounded-full border border-line px-5 font-semibold text-navy">
            {en ? "Change Password" : "पासवर्ड बदलें"}
          </button>
        </form>
        <button
          type="button"
          onClick={() => {
            window.sessionStorage.removeItem(TOKEN);
            setToken("");
            setOpen(null);
          }}
          className="mt-4 text-sm font-semibold text-gold-deep"
        >
          {en ? "Lock" : "बंद करें"}
        </button>
      </div>
      {open && tab === "live" ? (
        <div className="mt-8" id="admin-form">
          <div className="no-print mb-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className="min-h-11 rounded-full bg-navy px-5 font-semibold text-ivory"
            >
              {en ? "Print Form And Documents" : "फ़ॉर्म और दस्तावेज़ एक साथ प्रिंट"}
            </button>
            <button type="button" onClick={() => { setOpen(null); setViewId(0); }} className="min-h-11 rounded-full border border-line px-5 font-semibold text-navy">
              {en ? "Close Form" : "फ़ॉर्म बंद करें"}
            </button>
          </div>
          <FilledForm form={{ ...open.form, studentSign: signOn && applicantOn ? open.form.studentSign : "", parentSign: signOn && parentOn ? open.form.parentSign : "" }} serial={open.serial} recordId={open.id} lang={lang} downloads downloadToken={token} managerSign={managerOn ? managerImage : ""} managerPad={padOn ? padImage : ""} />
        </div>
      ) : null}
    </div>
  );
}

function ManagerPad({ title, clearLabel, onInk }: { title: string; clearLabel: string; onInk: (image: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onInkRef = useRef(onInk);
  const clearRef = useRef<() => void>(() => {});
  onInkRef.current = onInk;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineWidth = 3.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#0c2340";
    let drawing = false;

    const place = (clientX: number, clientY: number) => {
      const box = canvas.getBoundingClientRect();
      return {
        x: ((clientX - box.left) / (box.width || 1)) * canvas.width,
        y: ((clientY - box.top) / (box.height || 1)) * canvas.height,
      };
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.preventDefault();
      const pen = place(event.clientX, event.clientY);
      ctx.beginPath();
      ctx.moveTo(pen.x, pen.y);
      drawing = true;
    };
    const move = (event: PointerEvent) => {
      if (!drawing) return;
      event.preventDefault();
      const pen = place(event.clientX, event.clientY);
      ctx.lineTo(pen.x, pen.y);
      ctx.stroke();
    };
    const up = () => {
      if (!drawing) return;
      drawing = false;
      onInkRef.current(canvas.toDataURL("image/png"));
    };
    clearRef.current = () => {
      drawing = false;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3.4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#0c2340";
      onInkRef.current("");
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    return () => {
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, []);

  return (
    <div className="mt-4 max-w-sm">
      <div className="mb-1 flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-navy">{title}</span>
        <button type="button" onClick={() => clearRef.current()} className="min-h-11 px-2 text-sm font-semibold text-[#c5161d]">
          {clearLabel}
        </button>
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={160}
        className="h-24 w-full touch-none rounded-2xl border border-dashed border-gold bg-ivory"
      />
    </div>
  );
}
