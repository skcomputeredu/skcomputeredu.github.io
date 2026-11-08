import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { getSql } from "@/lib/db";
import type { AdmissionForm, Slip } from "@/lib/admissions";
import { UPI_ID } from "@/lib/site";

const INITIAL_HASH =
  "d00728174a4758de86f9ddfffa067462:54c2392e4e7e57c9b74b31c9d66c34decb33838127c9884fd964496c42efe2d4";

const FAST_N = 4096;
let remembered: { stored: string; password: string } | null = null;

async function ensureSerials(sql: Awaited<ReturnType<typeof getSql>>) {
  await sql`alter table admissions add column if not exists serial_no integer`;
  await sql`
    with ranked as (
      select id, row_number() over (order by id) as n
      from admissions
      where deleted_at is null and serial_no is null
    )
    update admissions as saved
    set serial_no = ranked.n + coalesce((select max(serial_no) from admissions), 0)
    from ranked
    where saved.id = ranked.id
  `;
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32, { N: FAST_N, r: 8, p: 1, maxmem: 16 * 1024 * 1024 }).toString("hex");
  return `n4:${salt}:${hash}`;
}

function passwordOk(password: string, stored: string) {
  if (remembered && remembered.stored === stored && remembered.password === password) return true;
  const parts = stored.split(":");
  const fast = parts[0] === "n4";
  const salt = fast ? parts[1] : parts[0];
  const hash = fast ? parts[2] : parts[1];
  if (!salt || !hash) return false;
  const next = fast
    ? scryptSync(password, salt, 32, { N: FAST_N, r: 8, p: 1, maxmem: 16 * 1024 * 1024 })
    : scryptSync(password, salt, 32);
  const prev = Buffer.from(hash, "hex");
  if (next.length !== prev.length) return false;
  const ok = timingSafeEqual(next, prev);
  if (ok) remembered = { stored, password };
  return ok;
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function parseForm(value: AdmissionForm | string) {
  return typeof value === "string" ? (JSON.parse(value) as AdmissionForm) : value;
}

function slipFrom(serial: number, form: Partial<AdmissionForm>, at: string): Slip {
  return {
    serial,
    student: form.student || "",
    mobile: form.mobile || "",
    amount: form.paymentAmount || "",
    method: form.paymentMethod || "",
    status: form.paymentStatus === "Paid" ? "Paid" : "Not paid",
    at: form.paymentAt || at,
    payerUpi: form.payerUpi || "",
  };
}

async function secretHash() {
  const sql = await getSql();
  const rows = await sql<{ password_hash: string }>`select password_hash from admin_secret where id = 1`;
  if (!rows[0]) {
    await sql`insert into admin_secret (id, password_hash) values (1, ${INITIAL_HASH})`;
    return INITIAL_HASH;
  }
  return rows[0].password_hash;
}

async function requireToken(token: string) {
  const sql = await getSql();
  const rows = await sql<{ ok: number }>`
    select 1 as ok from admin_session
    where token_hash = ${tokenHash(token)} and expires_at > now()
  `;
  if (!rows[0]) throw new Error("locked");
  return sql;
}

function fileProblem(value: string, kinds: string[], max: number, slot: string) {
  if (value.length < 30) return `${slot}:empty`;
  if (value.length > max) return `${slot}:big`;
  const head = value.slice(0, 64).toLowerCase();
  if (!kinds.some((kind) => head.startsWith(`data:${kind}`))) return `${slot}:type`;
  return "";
}

export async function saveAdmission(form: AdmissionForm) {
  const sql = await getSql();
  await ensureSerials(sql);
  if (form.paymentStatus !== "Paid") {
    const gate = await sql<{ value: string }>`select value from site_settings where key = ${"registration_fee"}`;
    if (gate[0]?.value === "on") return { id: 0, blocked: "fee" as const };
  }
  const signs = await signGates();
  if (signs.enabled && signs.applicant && form.studentSign.length < 30) return { id: 0, blocked: "sign" as const };
  if (signs.enabled && signs.parent && form.parentSign.length < 30) return { id: 0, blocked: "sign" as const };
  const gates = await uploadGates();
  const images = ["image/jpeg", "image/jpg", "image/pjpeg", "image/png", "image/webp"];
  const docs = [...images, "application/pdf"];
  const clean = { ...form };
  const problems = [
    gates.photo ? fileProblem(clean.photo, images, 2_500_000, "photo") : "",
    gates.document ? fileProblem(clean.documentData, docs, 7_500_000, "document") || (!clean.documentName ? "document:empty" : "") : "",
    gates.aadhaar ? fileProblem(clean.aadhaarData, docs, 7_500_000, "aadhaar") || (!clean.aadhaarName ? "aadhaar:empty" : "") : "",
    gates.signature ? fileProblem(clean.signUpload, images, 2_500_000, "signature") : "",
  ].filter(Boolean);
  if (problems.length) return { id: 0, blocked: "file" as const, detail: problems[0] };
  if (!gates.photo) clean.photo = "";
  if (!gates.document) {
    clean.documentName = "";
    clean.documentData = "";
  }
  if (!gates.aadhaar) {
    clean.aadhaarName = "";
    clean.aadhaarData = "";
  }
  if (!gates.signature) clean.signUpload = "";
  const rows = await sql<{ serial_no: number }>`
    insert into admissions (student_name, mobile, course, form, serial_no)
    values (
      ${clean.student},
      ${clean.mobile},
      ${clean.course},
      ${JSON.stringify(clean)}::jsonb,
      (select coalesce(max(serial_no), 0) + 1 from admissions)
    )
    returning serial_no
  `;
  const serial = Number(rows[0]?.serial_no) || 0;
  if (serial && clean.paymentStatus === "Paid") {
    const saved = await sql<{ id: number }>`select id from admissions where serial_no = ${serial} order by id desc limit 1`;
    const id = saved[0]?.id ?? 0;
    if (id) {
      await sql`
        insert into payments (admission_id, student_name, mobile, amount, method, status, payee_upi, payer_upi)
        values (${id}, ${clean.student}, ${clean.mobile}, ${clean.paymentAmount}, ${clean.paymentMethod}, ${"Paid"}, ${UPI_ID}, ${clean.payerUpi})
      `;
    }
  }
  return { id: serial, blocked: null };
}

export async function loginAdmin(password: string) {
  const stored = await secretHash();
  let ok = false;
  try {
    ok = passwordOk(password, stored);
  } catch {
    ok = false;
  }
  if (!ok) return { ok: false as const };
  if (!stored.startsWith("n4:")) {
    const sql = await getSql();
    const nextHash = hashPassword(password);
    await sql`update admin_secret set password_hash = ${nextHash} where id = 1`;
    remembered = { stored: nextHash, password };
  }
  const token = randomBytes(24).toString("hex");
  const sql = await getSql();
  await sql`
    insert into admin_session (token_hash, expires_at)
    values (${tokenHash(token)}, now() + interval '12 hours')
  `;
  return { ok: true as const, token };
}

export async function listAdmissions(token: string) {
  const sql = await requireToken(token);
  await ensureSerials(sql);
  const rows = await sql<{ id: number; serial_no: number | null; student_name: string; mobile: string; father_name: string | null; fee_status: string | null }>`
    select id, serial_no, student_name, mobile, coalesce(form->>'father', '') as father_name, coalesce(form->>'paymentStatus', 'Not paid') as fee_status
    from admissions
    where deleted_at is null
    order by serial_no asc, id asc
  `;
  return rows.map((row) => ({
    id: row.id,
    serial: Number(row.serial_no) || row.id,
    student: row.student_name,
    father: row.father_name || "",
    mobile: row.mobile,
    fee: row.fee_status || "Not paid",
  }));
}

export async function listTrash(token: string) {
  const sql = await requireToken(token);
  await ensureSerials(sql);
  const rows = await sql<{ id: number; serial_no: number | null; student_name: string; mobile: string; father_name: string | null; fee_status: string | null }>`
    select id, serial_no, student_name, mobile, coalesce(form->>'father', '') as father_name, coalesce(form->>'paymentStatus', 'Not paid') as fee_status
    from admissions
    where deleted_at is not null
    order by deleted_at desc, id asc
  `;
  return rows.map((row) => ({
    id: row.id,
    serial: Number(row.serial_no) || row.id,
    student: row.student_name,
    father: row.father_name || "",
    mobile: row.mobile,
    fee: row.fee_status || "Not paid",
  }));
}

export async function softDeleteAdmission(token: string, id: number) {
  const sql = await requireToken(token);
  const idNum = Number(id);
  if (!Number.isInteger(idNum) || idNum <= 0) return { ok: false as const };
  await sql`
    update admissions
    set deleted_at = current_timestamp
    where id = ${idNum} and deleted_at is null
  `;
  const rows = await sql<{ id: number }>`select id from admissions where id = ${idNum} and deleted_at is not null`;
  return { ok: rows.length > 0 };
}

export async function recoverAdmission(token: string, id: number) {
  const sql = await requireToken(token);
  await sql`update admissions set deleted_at = null where id = ${id}`;
  return { ok: true as const };
}

export async function purgeAdmission(token: string, id: number) {
  const sql = await requireToken(token);
  await sql`delete from admissions where id = ${id} and deleted_at is not null`;
  return { ok: true as const };
}

export async function readAdmission(token: string, id: number) {
  const sql = await requireToken(token);
  await ensureSerials(sql);
  const rows = await sql<{ id: number; serial_no: number | null; form: AdmissionForm | string }>`
    select id, serial_no, form from admissions where id = ${id} and deleted_at is null
  `;
  const row = rows[0];
  if (!row) return null;
  return { id: row.id, serial: Number(row.serial_no) || row.id, form: parseForm(row.form) };
}

export async function changePassword(token: string, password: string) {
  const sql = await requireToken(token);
  await sql`update admin_secret set password_hash = ${hashPassword(password)} where id = 1`;
  return { ok: true as const };
}

export async function feeGateOn() {
  const sql = await getSql();
  const rows = await sql<{ value: string }>`select value from site_settings where key = ${"registration_fee"}`;
  return rows[0]?.value === "on";
}

export async function writeFeeGate(token: string, enabled: boolean) {
  const sql = await requireToken(token);
  const value = enabled ? "on" : "off";
  await sql`
    insert into site_settings (key, value) values (${"registration_fee"}, ${value})
    on conflict (key) do update set value = excluded.value
  `;
  return { required: enabled };
}

export async function signGates() {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`
    select key, value from site_settings where key in ('digital_sign', 'digital_sign_applicant', 'digital_sign_parent')
  `;
  const map = new Map(rows.map((row) => [row.key, row.value]));
  const on = (key: string) => !map.has(key) || map.get(key) === "on";
  return { enabled: on("digital_sign"), applicant: on("digital_sign_applicant"), parent: on("digital_sign_parent") };
}

export async function signGateOn() {
  return (await signGates()).enabled;
}

export async function writeSignGate(token: string, enabled: boolean) {
  const sql = await requireToken(token);
  const value = enabled ? "on" : "off";
  await sql`
    insert into site_settings (key, value) values (${"digital_sign"}, ${value})
    on conflict (key) do update set value = excluded.value
  `;
  return { enabled };
}

export async function writeSignPart(token: string, part: "applicant" | "parent", enabled: boolean) {
  const sql = await requireToken(token);
  const key = part === "applicant" ? "digital_sign_applicant" : "digital_sign_parent";
  const value = enabled ? "on" : "off";
  await sql`
    insert into site_settings (key, value) values (${key}, ${value})
    on conflict (key) do update set value = excluded.value
  `;
  return signGates();
}

export async function managerStamp() {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`
    select key, value from site_settings where key in ('manager_sign', 'manager_sign_data')
  `;
  const map = new Map(rows.map((row) => [row.key, row.value]));
  const image = map.get("manager_sign_data") || "";
  if (map.get("manager_sign") !== "on" || !image.startsWith("data:image/")) return "";
  return image;
}

export async function managerPadStamp() {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`
    select key, value from site_settings where key in ('manager_sign_pad', 'manager_sign_pad_data')
  `;
  const map = new Map(rows.map((row) => [row.key, row.value]));
  const image = map.get("manager_sign_pad_data") || "";
  if (map.get("manager_sign_pad") !== "on" || !image.startsWith("data:image/")) return "";
  return image;
}

export async function readManagerSign(token?: string) {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`
    select key, value from site_settings where key in ('manager_sign', 'manager_sign_data', 'manager_sign_pad', 'manager_sign_pad_data')
  `;
  const map = new Map(rows.map((row) => [row.key, row.value]));
  const image = map.get("manager_sign_data") || "";
  const padImage = map.get("manager_sign_pad_data") || "";
  const enabled = map.get("manager_sign") === "on";
  const padEnabled = map.get("manager_sign_pad") === "on";
  const safe = image.startsWith("data:image/") ? image : "";
  const padSafe = padImage.startsWith("data:image/") ? padImage : "";
  let reveal = false;
  if (token) {
    try {
      await requireToken(token);
      reveal = true;
    } catch {
      reveal = false;
    }
  }
  return {
    enabled,
    image: enabled || reveal ? safe : "",
    stored: Boolean(safe),
    padEnabled,
    padImage: padEnabled || reveal ? padSafe : "",
  };
}

export async function writeManagerSign(token: string, enabled: boolean, image?: string, padEnabled?: boolean, padImage?: string) {
  const sql = await requireToken(token);
  const flag = enabled ? "on" : "off";
  await sql`
    insert into site_settings (key, value) values (${"manager_sign"}, ${flag})
    on conflict (key) do update set value = excluded.value
  `;
  if (typeof image === "string") {
    if (image && (!image.startsWith("data:image/") || image.length > 2_000_000)) throw new Error("sign");
    await sql`
      insert into site_settings (key, value) values (${"manager_sign_data"}, ${image})
      on conflict (key) do update set value = excluded.value
    `;
  }
  if (typeof padEnabled === "boolean") {
    await sql`
      insert into site_settings (key, value) values (${"manager_sign_pad"}, ${padEnabled ? "on" : "off"})
      on conflict (key) do update set value = excluded.value
    `;
  }
  if (typeof padImage === "string") {
    if (padImage && (!padImage.startsWith("data:image/") || padImage.length > 2_000_000)) throw new Error("sign");
    await sql`
      insert into site_settings (key, value) values (${"manager_sign_pad_data"}, ${padImage})
      on conflict (key) do update set value = excluded.value
    `;
  }
  return readManagerSign(token);
}

const uploadKeys = ["upload_photo", "upload_document", "upload_aadhaar", "upload_signature"] as const;
type UploadKey = (typeof uploadKeys)[number];

export async function uploadGates() {
  const sql = await getSql();
  const rows = await sql<{ key: string; value: string }>`
    select key, value from site_settings
    where key in ('upload_photo', 'upload_document', 'upload_aadhaar', 'upload_signature')
  `;
  const off = new Set(rows.filter((row) => row.value === "off").map((row) => row.key));
  return {
    photo: !off.has("upload_photo"),
    document: !off.has("upload_document"),
    aadhaar: !off.has("upload_aadhaar"),
    signature: !off.has("upload_signature"),
  };
}

export async function writeUploadGate(token: string, key: UploadKey, enabled: boolean) {
  if (!uploadKeys.includes(key)) throw new Error("bad");
  const sql = await requireToken(token);
  const value = enabled ? "on" : "off";
  await sql`
    insert into site_settings (key, value) values (${key}, ${value})
    on conflict (key) do update set value = excluded.value
  `;
  return uploadGates();
}

export async function recordFeePayment(input: {
  serial: number;
  mobile: string;
  student: string;
  amount: string;
  method: string;
  payerUpi: string;
}) {
  const sql = await getSql();
  await ensureSerials(sql);
  const at = new Date().toISOString();
  if (input.serial > 0) {
    const rows = await sql<{ id: number; serial_no: number | null; form: AdmissionForm | string }>`
      select id, serial_no, form from admissions where serial_no = ${input.serial} and mobile = ${input.mobile} and deleted_at is null
    `;
    const row = rows[0];
    if (!row) return { ok: false as const };
    const form = parseForm(row.form);
    const next: AdmissionForm = {
      ...form,
      paymentStatus: "Paid",
      paymentMethod: input.method,
      paymentAmount: input.amount,
      paymentAt: at,
      payerUpi: input.payerUpi,
    };
    await sql`update admissions set form = ${JSON.stringify(next)}::jsonb where id = ${row.id}`;
    await sql`
      insert into payments (admission_id, student_name, mobile, amount, method, status, payee_upi, payer_upi)
      values (${row.id}, ${form.student}, ${input.mobile}, ${input.amount}, ${input.method}, ${"Paid"}, ${UPI_ID}, ${input.payerUpi})
    `;
    return { ok: true as const, slip: slipFrom(Number(row.serial_no) || input.serial, next, at) };
  }
  if (input.student.trim().length < 2) return { ok: false as const };
  const inserted = await sql<{ id: number }>`
    insert into payments (admission_id, student_name, mobile, amount, method, status, payee_upi, payer_upi)
    values (${null}, ${input.student.trim()}, ${input.mobile}, ${input.amount}, ${input.method}, ${"Paid"}, ${UPI_ID}, ${input.payerUpi})
    returning id
  `;
  const id = inserted[0]?.id ?? 0;
  return {
    ok: true as const,
    slip: {
      serial: id,
      student: input.student.trim(),
      mobile: input.mobile,
      amount: input.amount,
      method: input.method,
      status: "Paid" as const,
      at,
      payerUpi: input.payerUpi,
    },
  };
}

export async function findSlip(serial: number, mobile: string) {
  const sql = await getSql();
  await ensureSerials(sql);
  const admissions = await sql<{ id: number; serial_no: number | null; form: AdmissionForm | string; created_at: string | Date }>`
    select id, serial_no, form, created_at from admissions where serial_no = ${serial} and mobile = ${mobile} and deleted_at is null
  `;
  const admission = admissions[0];
  if (admission) {
    const created = typeof admission.created_at === "string" ? admission.created_at : admission.created_at.toISOString();
    return { ok: true as const, slip: slipFrom(Number(admission.serial_no) || serial, parseForm(admission.form), created) };
  }
  const pays = await sql<{
    id: number;
    student_name: string;
    mobile: string;
    amount: string;
    method: string;
    status: string;
    payer_upi: string;
    created_at: string | Date;
  }>`
    select id, student_name, mobile, amount, method, status, payer_upi, created_at
    from payments where id = ${serial} and mobile = ${mobile}
  `;
  const pay = pays[0];
  if (!pay) return { ok: false as const };
  const created = typeof pay.created_at === "string" ? pay.created_at : pay.created_at.toISOString();
  const slip: Slip = {
    serial: pay.id,
    student: pay.student_name,
    mobile: pay.mobile,
    amount: pay.amount,
    method: pay.method,
    status: pay.status === "Paid" ? "Paid" : "Not paid",
    at: created,
    payerUpi: pay.payer_upi || "",
  };
  return { ok: true as const, slip };
}
