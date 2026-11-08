import { createFileRoute } from "@tanstack/react-router";

async function pdfResponse(token: string, id: number, docs: boolean, layout: string) {
  if (!token || !Number.isInteger(id) || id <= 0) return new Response("Bad request", { status: 400 });
  try {
    const { readAdmission, managerStamp, managerPadStamp, signGates } = await import("@/lib/admissions.server");
    const { buildAdmissionPdf } = await import("@/lib/admission-pdf");
    const row = await readAdmission(token, id);
    if (!row) return new Response("Not found", { status: 404 });
    const manager = await managerStamp();
    const pad = await managerPadStamp();
    const signs = await signGates();
    const form = {
      ...row.form,
      studentSign: signs.enabled && signs.applicant ? row.form.studentSign : "",
      parentSign: signs.enabled && signs.parent ? row.form.parentSign : "",
    };
    const detail = layout === "detail";
    const bytes = await buildAdmissionPdf(form, row.serial, docs, manager, detail ? "detail" : "sheet", pad);
    const copy = new Uint8Array(bytes.byteLength);
    copy.set(bytes);
    const name = detail ? `SK-form-${row.serial}.pdf` : docs ? `SK-registration-${row.serial}-with-documents.pdf` : `SK-registration-${row.serial}.pdf`;
    return new Response(copy, {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${name}"`,
        "content-length": String(copy.byteLength),
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    const locked = error instanceof Error && error.message === "locked";
    return new Response(locked ? "Locked" : "Could not build the form", { status: locked ? 401 : 500 });
  }
}

export const Route = createFileRoute("/api/admission-pdf")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);
        return pdfResponse(url.searchParams.get("token") || "", Number(url.searchParams.get("id")), url.searchParams.get("docs") === "1", url.searchParams.get("layout") || "");
      },
      POST: async ({ request }) => {
        const body = await request.formData().catch(() => null);
        if (!body) return new Response("Bad request", { status: 400 });
        return pdfResponse(String(body.get("token") || ""), Number(body.get("id")), String(body.get("docs") || "") === "1", String(body.get("layout") || ""));
      },
    },
  },
});