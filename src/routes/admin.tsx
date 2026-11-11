import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { FilledForm } from "@/components/filled-form";
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
    readFeeGate({ data: {} })
      .then((gate) => {
        if (gateWrites.current.fee === 0) setFeeOn(gate.required);
      })
      .catch(() => setFeeOn(false));
    readSignGate({ data: {} })
      .then((gate) => {
        if (gateWrites.current.sign === 0) {
          setSignOn(gate.enabled);
          setApplicantOn(gate.applicant);
          setParentOn(gate.parent);
        }
      })
      .catch(() => setSignOn(true));
    readManagerSign({ data: saved ? { token: saved } : {} })
      .then((gate) => {
        if (gateWrites.current.manager !== 0) return;
        setManagerOn(gate.enabled);
        setManagerImage(gate.image || "");
        setPadOn(Boolean(gate.padEnabled));
        setPadImage(gate.padImage || "");
      })
      .catch(() => undefined);
    readUploadGates({ data: {} })
      .then((gate) => setUploads(gate))
      .catch(() => setUploads({ photo: true, document: true, aadhaar: true, signature: true }));
  }, []);

  async function enter(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const field = event.currentTarget.elements.namedItem("password");
    const typed = (field instanceof HTMLInputElement ? field.value : password).trim();
    if (typed.length < 4) {
      setError(en ? "Wrong password." : "पासवर्ड गलत है।");
      return;
    }
    try {
      let result = await adminLogin({ data: { password: typed } }).catch(() => null);
      if (!result) result = await adminLogin({ data: { password: typed } });
      if (!result.ok) {
        setError(en ? "Wrong password." : "पासवर्ड गलत है।");
        return;
      }
      window.sessionStorage.setItem(TOKEN, result.token);
      setToken(result.token);
      setPassword("");
      void import("@/lib/admission-pdf").then((mod) => mod.warmAdmissionPdf());
      try {
        await load(result.token);
        const [gate, signs, files, manager] = await Promise.all([
          readFeeGate({ data: {} }),
          readSignGate({ data: {} }),
          readUploadGates({ data: {} }),
          readManagerSign({ data: { token: result.token } }),
        ]);
        setFeeOn(gate.required);
        setSignOn(signs.enabled);
        setApplicantOn(signs.applicant);
        setParentOn(signs.parent);
        setUploads(files);
        setManagerOn(manager.enabled);
        setManagerImage(manager.image || "");
        setPadOn(Boolean(manager.padEnabled));
        setPadImage(manager.padImage || "");
      } catch {
        setError(
          en
            ? "The list did not load. Open the page once more."
            : "सूची नहीं खुली। पेज एक बार फिर खोलें।",
        );
      }
    } catch {
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
      if (gateWrites.current.fee === rev) setFeeOn(result.required);
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
      if (gateWrites.current.sign === rev) setSignOn(result.enabled);
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
      if (gateWrites.current.upload === rev) setUploads(result);
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
      const bitmap = await createImageBitmap(file);
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
      const image = canvas.toDataURL("image/jpeg", 0.8);
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
            className="min-h-12 rounded-2xl border border-line bg-ivory px-4 text-navy"
            style={{ color: "#0c2340", WebkitTextFillColor: "#0c2340", backgroundColor: "#f4f0e6" }}
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
        <p className="text-xs font-semibold tracking-widest text-gold-deep uppercase">Admin Use Only</p>
        <h1 className="mt-2 font-display text-4xl text-navy">{en ? "Submitted Forms" : "आए हुए फ़ॉर्म"}</h1>
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
