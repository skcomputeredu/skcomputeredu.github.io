import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const text = z.string().trim().max(400);

export const admissionSchema = z.object({
  course: text.min(1),
  student: text.min(2),
  gender: text,
  marital: text,
  dob: text,
  birthPlace: text,
  religion: text,
  caste: text,
  category: text,
  aadhaar: z.string().regex(/^\d{12}$/),
  father: text.min(2),
  mother: text.min(2),
  husband: text,
  occupation: text,
  qualification: text.min(1),
  school: text.min(2),
  board: text,
  passingYear: z.string().regex(/^(19|20)\d{2}$/),
  marksGot: text,
  marksTotal: text,
  percentage: text,
  address: text.min(6),
  pin: text.max(6),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  email: text,
  knowledge: text,
  batch: text,
  photo: z.string().max(2_500_000),
  documentName: z.string().trim().max(180),
  documentData: z.string().max(7_500_000),
  aadhaarName: z.string().trim().max(180),
  aadhaarData: z.string().max(7_500_000),
  signUpload: z.string().max(2_500_000),
  studentSign: z.string().max(1_600_000),
  parentSign: z.string().max(1_600_000),
  declareTruth: z.literal(true),
  declareParent: z.literal(true),
  paymentStatus: z.enum(["Paid", "Not paid"]),
  paymentMethod: text,
  paymentAmount: text,
  paymentAt: text,
  payerUpi: text.max(80),
});

export type AdmissionForm = z.infer<typeof admissionSchema>;

export type AdmissionRow = {
  id: number;
  serial: number;
  student: string;
  father: string;
  mobile: string;
  fee: string;
};

export type Slip = {
  serial: number;
  student: string;
  mobile: string;
  amount: string;
  method: string;
  status: "Paid" | "Not paid";
  at: string;
  payerUpi: string;
};

const feeInput = z.object({
  serial: z.number().int().min(0).max(1_000_000),
  mobile: z.string().regex(/^[6-9]\d{9}$/),
  student: z.string().trim().max(120),
  amount: z.string().regex(/^\d{1,6}(\.\d{1,2})?$/),
  method: z.string().trim().min(2).max(40),
  payerUpi: z.string().trim().max(80),
});

export const saveUploadChunk = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().min(8).max(48), idx: z.number().int().min(0).max(40), part: z.string().max(700_000) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { keepUploadChunk } = await import("./admissions.server");
    await keepUploadChunk(data.token, data.idx, data.part);
    return { ok: true as const };
  });

export const submitAdmission = createServerFn({ method: "POST" })
  .validator((input: unknown) => admissionSchema.parse(input))
  .handler(async ({ data }) => {
    const { saveAdmission } = await import("./admissions.server");
    return saveAdmission(data);
  });

export const adminLogin = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ password: z.string().min(4).max(80) }).parse(input))
  .handler(async ({ data }) => {
    const { loginAdmin } = await import("./admissions.server");
    return loginAdmin(data.password);
  });

export const adminList = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(20) }).parse(input))
  .handler(async ({ data }) => {
    const { listAdmissions } = await import("./admissions.server");
    return listAdmissions(data.token);
  });

export const adminOne = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(20), id: z.coerce.number().int().positive() }).parse(input))
  .handler(async ({ data }) => {
    const { readAdmission } = await import("./admissions.server");
    return readAdmission(data.token, data.id);
  });

const tokenId = z.object({ token: z.string().min(20), id: z.coerce.number().int().positive() });

export const adminTrash = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(20) }).parse(input))
  .handler(async ({ data }) => {
    const { listTrash } = await import("./admissions.server");
    return listTrash(data.token);
  });

export const adminSoftDelete = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenId.parse(input))
  .handler(async ({ data }) => {
    const { softDeleteAdmission } = await import("./admissions.server");
    return softDeleteAdmission(data.token, data.id);
  });

export const adminRecover = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenId.parse(input))
  .handler(async ({ data }) => {
    const { recoverAdmission } = await import("./admissions.server");
    return recoverAdmission(data.token, data.id);
  });

export const adminPurge = createServerFn({ method: "POST" })
  .validator((input: unknown) => tokenId.parse(input))
  .handler(async ({ data }) => {
    const { purgeAdmission } = await import("./admissions.server");
    return purgeAdmission(data.token, data.id);
  });

export const adminPassword = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().min(20), password: z.string().min(6).max(80) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { changePassword } = await import("./admissions.server");
    return changePassword(data.token, data.password);
  });

export const readFeeGate = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({}).parse(input ?? {}))
  .handler(async () => {
    const { feeGateOn } = await import("./admissions.server");
    return { required: await feeGateOn() };
  });

export const setFeeGate = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(20), enabled: z.boolean() }).parse(input))
  .handler(async ({ data }) => {
    const { writeFeeGate } = await import("./admissions.server");
    return writeFeeGate(data.token, data.enabled);
  });

export const readSignGate = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({}).parse(input ?? {}))
  .handler(async () => {
    const { signGates } = await import("./admissions.server");
    return signGates();
  });

export const setSignGate = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(20), enabled: z.boolean() }).parse(input))
  .handler(async ({ data }) => {
    const { writeSignGate } = await import("./admissions.server");
    return writeSignGate(data.token, data.enabled);
  });

export const setSignPart = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().min(20), part: z.enum(["applicant", "parent"]), enabled: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { writeSignPart } = await import("./admissions.server");
    return writeSignPart(data.token, data.part, data.enabled);
  });

export const readManagerSign = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ token: z.string().min(20).optional() }).parse(input ?? {}))
  .handler(async ({ data }) => {
    const { readManagerSign: read } = await import("./admissions.server");
    return read(data.token);
  });

export const setManagerSign = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        token: z.string().min(20),
        enabled: z.boolean(),
        image: z.string().max(2_000_000).optional(),
        padEnabled: z.boolean().optional(),
        padImage: z.string().max(2_000_000).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { writeManagerSign } = await import("./admissions.server");
    return writeManagerSign(data.token, data.enabled, data.image, data.padEnabled, data.padImage);
  });

const uploadKey = z.enum(["upload_photo", "upload_document", "upload_aadhaar", "upload_signature"]);

export const readUploadGates = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({}).parse(input ?? {}))
  .handler(async () => {
    const { uploadGates } = await import("./admissions.server");
    return uploadGates();
  });

export const setUploadGate = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ token: z.string().min(20), key: uploadKey, enabled: z.boolean() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { writeUploadGate } = await import("./admissions.server");
    return writeUploadGate(data.token, data.key, data.enabled);
  });

export const recordFee = createServerFn({ method: "POST" })
  .validator((input: unknown) => feeInput.parse(input))
  .handler(async ({ data }) => {
    const { recordFeePayment } = await import("./admissions.server");
    return recordFeePayment(data);
  });

export const readSlip = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z.object({ serial: z.number().int().positive(), mobile: z.string().regex(/^[6-9]\d{9}$/) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { findSlip } = await import("./admissions.server");
    return findSlip(data.serial, data.mobile);
  });
