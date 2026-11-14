import "regenerator-runtime/runtime.js";
import type { AdmissionForm } from "@/lib/admissions";
import { PHONE_DISPLAY } from "@/lib/site";

function dataUrlBytes(dataUrl: string) {
  const base = dataUrl.split(",")[1] ?? "";
  const bin = atob(base);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function cropCover(dataUrl: string, boxW: number, boxH: number) {
  if (!dataUrl.startsWith("data:image/")) return "";
  const raw = dataUrlBytes(dataUrl);
  const targetW = 280;
  const targetH = Math.max(1, Math.round(targetW * (boxH / Math.max(1, boxW))));
  const paint = (loaded: { width: number; height: number }, ctx: CanvasRenderingContext2D) => {
    const scale = Math.max(targetW / loaded.width, targetH / loaded.height);
    const dw = loaded.width * scale;
    const dh = loaded.height * scale;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(loaded as CanvasImageSource, (targetW - dw) / 2, (targetH - dh) / 2, dw, dh);
  };
  try {
    if (import.meta.env.SSR) {
      const { createCanvas, loadImage } = await import("@napi-rs/canvas");
      const loaded = await loadImage(Buffer.from(raw));
      const canvas = createCanvas(targetW, targetH);
      paint(loaded, canvas.getContext("2d") as unknown as CanvasRenderingContext2D);
      return `data:image/jpeg;base64,${Buffer.from(canvas.toBuffer("image/jpeg", 72)).toString("base64")}`;
    }
    const bmp = await createImageBitmap(new Blob([raw]));
    const canvas = document.createElement("canvas");
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bmp.close?.();
      return dataUrl;
    }
    paint(bmp, ctx);
    bmp.close?.();
    return canvas.toDataURL("image/jpeg", 0.72);
  } catch {
    return dataUrl;
  }
}

async function compactDoc(dataUrl: string) {
  if (!dataUrl.startsWith("data:image/")) return dataUrl;
  const raw = dataUrlBytes(dataUrl);
  if (raw.byteLength < 120_000) return dataUrl;
  const maxSide = 900;
  try {
    if (import.meta.env.SSR) {
      const { createCanvas, loadImage } = await import("@napi-rs/canvas");
      const loaded = await loadImage(Buffer.from(raw));
      const scale = Math.min(1, maxSide / Math.max(loaded.width, loaded.height));
      const w = Math.max(1, Math.round(loaded.width * scale));
      const h = Math.max(1, Math.round(loaded.height * scale));
      const canvas = createCanvas(w, h);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(loaded, 0, 0, w, h);
      const jpg = canvas.toBuffer("image/jpeg", 68);
      return `data:image/jpeg;base64,${Buffer.from(jpg).toString("base64")}`;
    }
    const bmp = await createImageBitmap(new Blob([raw]));
    const scale = Math.min(1, maxSide / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bmp.width * scale));
    canvas.height = Math.max(1, Math.round(bmp.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bmp.close?.();
      return dataUrl;
    }
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    bmp.close?.();
    return canvas.toDataURL("image/jpeg", 0.68);
  } catch {
    return dataUrl;
  }
}

const assetCache = new Map<string, Promise<ArrayBuffer>>();

const publicRoots = () => {
  const path = process.cwd();
  return [`${path}/public`, `${path}/.output/public`, `${path}/.vercel/output/static`];
};

async function readPublic(rel: string) {
  const { readFile } = await import("node:fs/promises");
  const { join } = await import("node:path");
  for (const root of publicRoots()) {
    try {
      const file = join(root, rel);
      const buf = await readFile(file);
      return { file, bytes: buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer };
    } catch {
      /* try the next published folder */
    }
  }
  return null;
}

function siteOrigin() {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL || process.env.VERCEL_BRANCH_URL || "";
  if (!host) return "";
  return host.startsWith("http") ? host.replace(/\/$/, "") : `https://${host}`;
}

function loadAsset(path: string) {
  const cached = assetCache.get(path);
  if (cached) return cached;
  const pending = (async () => {
    const rel = path.replace(/^\/+/, "");
    const absolute = path.startsWith("/") ? path : `/${path}`;
    if (import.meta.env.SSR) {
      const found = await readPublic(rel);
      if (found) return found.bytes;
      const origin = siteOrigin();
      if (origin) {
        const file = await fetch(`${origin}${absolute}`);
        if (file.ok) return file.arrayBuffer();
      }
    }
    const file = await fetch(absolute);
    if (!file.ok) throw new Error(path);
    return file.arrayBuffer();
  })();
  assetCache.set(path, pending);
  return pending;
}

export function warmAdmissionPdf() {
  void import("pdf-lib");
  void import("@pdf-lib/fontkit");
  void import("pdf-lib/cjs/api/operators.js");
  for (const path of ["/fonts/Mukta-Regular.ttf", "/fonts/Mukta-Bold.ttf", "/fonts/CenturyBold.otf", "/form-watermark.png", "/form-icon-phone.png"]) {
    void loadAsset(path).catch(() => assetCache.delete(path));
  }
}

function plain(value: string) {
  return value.replaceAll("—", "-").replaceAll("’", "'").replaceAll("₹", "Rs ");
}

let muktaReady: Promise<void> | null = null;

async function nonAsciiPng(text: string, maxPt: number, fontPt: number) {
  if (!/[^\u0000-\u007f]/.test(text)) return null;
  const scale = 4;
  const px = fontPt * scale;
  if (typeof document !== "undefined") {
    try {
      await document.fonts?.load?.("16px Mukta");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.font = `${px}px Mukta, "Noto Sans Devanagari", sans-serif`;
      const measured = ctx.measureText(text).width;
      canvas.width = Math.max(8, Math.ceil(Math.min(measured + 8, maxPt * scale)));
      canvas.height = Math.ceil(px * 1.5);
      ctx.font = `${px}px Mukta, "Noto Sans Devanagari", sans-serif`;
      ctx.fillStyle = "#1a2332";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 2, canvas.height / 2);
      return dataUrlBytes(canvas.toDataURL("image/png"));
    } catch {
      return null;
    }
  }
  if (import.meta.env.SSR) {
    try {
      const { createCanvas, GlobalFonts } = await import("@napi-rs/canvas");
      if (!muktaReady) {
        const found = await readPublic("fonts/Mukta-Regular.ttf");
        if (found) GlobalFonts.registerFromPath(found.file, "Mukta");
        muktaReady = Promise.resolve();
      }
      await muktaReady;
      const probe = createCanvas(8, 8);
      const probeCtx = probe.getContext("2d");
      probeCtx.font = `${px}px Mukta`;
      const measured = probeCtx.measureText(text).width;
      const width = Math.max(8, Math.ceil(Math.min(measured + 8, maxPt * scale)));
      const height = Math.ceil(px * 1.5);
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
      ctx.font = `${px}px Mukta`;
      ctx.fillStyle = "#1a2332";
      ctx.textBaseline = "middle";
      ctx.fillText(text, 2, height / 2);
      return canvas.toBuffer("image/png");
    } catch {
      return null;
    }
  }
  return null;
}

let centreFontsReady: Promise<void> | null = null;

function prepareCentreFonts() {
  if (centreFontsReady) return centreFontsReady;
  centreFontsReady = (async () => {
    if (import.meta.env.SSR) {
      const { GlobalFonts } = await import("@napi-rs/canvas");
      const fraunces = await readPublic("fonts/Fraunces-600.ttf");
      const bodoni = await readPublic("fonts/LibreBodoni-Italic.ttf");
      if (!fraunces || !bodoni) throw new Error("fonts");
      GlobalFonts.registerFromPath(fraunces.file, "FrauncesPdf");
      GlobalFonts.registerFromPath(bodoni.file, "BodoniPdf");
      return;
    }
    const add = async (family: string, url: string, descriptors: FontFaceDescriptors) => {
      const ready = [...document.fonts].some((face) => face.family.replaceAll('"', "") === family);
      if (ready) return;
      const face = new FontFace(family, await loadAsset(url), descriptors);
      await face.load();
      document.fonts.add(face);
    };
    await add("FrauncesPdf", "/fonts/Fraunces-600.ttf", { weight: "600", style: "normal" });
    await add("BodoniPdf", "/fonts/LibreBodoni-Italic.ttf", { weight: "700", style: "italic" });
  })().catch((error) => {
    centreFontsReady = null;
    throw error;
  });
  return centreFontsReady;
}

async function paintCentreName() {
  await prepareCentreFonts();
  const scale = 4;
  const main = 18 * scale;
  const ampSize = main;
  const parts = [
    { text: "SK COMPUTER", font: `600 ${main}px FrauncesPdf`, track: -0.025 * main },
    { text: "&", font: `italic 700 ${ampSize}px BodoniPdf`, track: 0 },
    { text: "EDUCATION CENTRE", font: `600 ${main}px FrauncesPdf`, track: -0.025 * main },
  ];
  const gaps = [Math.round(main * 0.16), Math.round(main * 0.16)];
  const height = Math.ceil(ampSize * 1.12);
  const scratch = await makeSurface(1600, height);
  let width = 8;
  parts.forEach((part, index) => {
    scratch.ctx.font = part.font;
    scratch.ctx.letterSpacing = `${part.track}px`;
    width += scratch.ctx.measureText(part.text).width + (index < gaps.length ? gaps[index] : 0);
  });
  width = Math.ceil(width + 8);
  const surface = await makeSurface(width, height);
  const ctx = surface.ctx;
  ctx.clearRect(0, 0, width, height);
  const shine = ctx.createLinearGradient(0, 0, 0, height);
  shine.addColorStop(0, "#4a4a4a");
  shine.addColorStop(0.16, "#000000");
  shine.addColorStop(1, "#000000");
  ctx.fillStyle = shine;
  ctx.textBaseline = "middle";
  let x = 4;
  parts.forEach((part, index) => {
    ctx.font = part.font;
    ctx.letterSpacing = `${part.track}px`;
    const yText = height / 2 + ampSize * 0.04;
    ctx.fillText(part.text, x, yText);
    ctx.fillText(part.text, x, yText);
    x += ctx.measureText(part.text).width + (index < gaps.length ? gaps[index] : 0);
  });
  return surface.png();
}

async function makeSurface(width: number, height: number) {
  if (import.meta.env.SSR) {
    const { createCanvas } = await import("@napi-rs/canvas");
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    return {
      ctx,
      png: () => new Uint8Array(canvas.toBuffer("image/png")),
    };
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas");
  return {
    ctx,
    png: () => dataUrlBytes(canvas.toDataURL("image/png")),
  };
}

export async function buildAdmissionPdf(form: AdmissionForm, serial: number, includeDocuments = false, managerSign = "", mode: "sheet" | "detail" = "sheet", managerPad = "") {
  const { PDFDocument, rgb, BlendMode } = await import("pdf-lib");
  const fontkitMod = await import("@pdf-lib/fontkit");
  const fontkit = "default" in fontkitMod ? fontkitMod.default : fontkitMod;
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  const fontBytes = await loadAsset("/fonts/Mukta-Regular.ttf");
  const boldBytes = await loadAsset("/fonts/Mukta-Bold.ttf");
  const centuryBytes = await loadAsset("/fonts/CenturyBold.otf");
  const font = await pdf.embedFont(fontBytes, { subset: false });
  const labelFont = await pdf.embedFont(boldBytes, { subset: false });
  const century = await pdf.embedFont(centuryBytes, { subset: false });
  const navy = rgb(0.047, 0.137, 0.251);
  const ink = rgb(0.1, 0.14, 0.2);
  const dark = rgb(0.067, 0.067, 0.067);
  const detail = mode === "detail";
  const pageW = 595.28;
  const pageH = detail ? 7200 : 841.89;
  const size: [number, number] = [pageW, pageH];
  const margin = 36;
  let page = pdf.addPage(size);
  let y = pageH - margin - 20;
  const left = margin;

  async function embedPublic(path: string) {
    try {
      return await pdf.embedPng(await loadAsset(path));
    } catch {
      assetCache.delete(path);
      return null;
    }
  }

  async function embedSolidPhone() {
    const path = "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25z";
    const draw = (ctx: CanvasRenderingContext2D, Path: new (d: string) => Path2D, s: number) => {
      ctx.clearRect(0, 0, s, s);
      ctx.fillStyle = "#000000";
      const icon = new Path(path);
      const pad = s * 0.04;
      ctx.save();
      ctx.translate(pad, pad);
      ctx.scale((s - pad * 2) / 24, (s - pad * 2) / 24);
      ctx.fill(icon);
      ctx.restore();
    };
    try {
      const s = 128;
      if (import.meta.env.SSR) {
        const { createCanvas, Path2D } = await import("@napi-rs/canvas");
        const canvas = createCanvas(s, s);
        const ctx = canvas.getContext("2d");
        draw(ctx as unknown as CanvasRenderingContext2D, Path2D as unknown as new (d: string) => Path2D, s);
        return await pdf.embedPng(new Uint8Array(canvas.toBuffer("image/png")));
      }
      const canvas = document.createElement("canvas");
      canvas.width = s;
      canvas.height = s;
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      draw(ctx, Path2D, s);
      return await pdf.embedPng(dataUrlBytes(canvas.toDataURL("image/png")));
    } catch {
      return embedPublic("/form-icon-phone.png");
    }
  }

  const [wm, phoneIcon] = await Promise.all([embedPublic("/form-watermark.png"), embedSolidPhone()]);

  function stamp() {
    if (!wm) return;
    const w = 400;
    const h = w * (wm.height / wm.width);
    page.drawImage(wm, {
      x: (pageW - w) / 2,
      y: (pageH - h) / 2,
      width: w,
      height: h,
    });
  }

  function addPage() {
    page = pdf.addPage(size);
    y = pageH - margin - 16;
  }

  if (!detail) stamp();

  function draw(text: string, fontSize: number, color = ink, x = left) {
    page.drawText(plain(text), { x, y, size: fontSize, font, color });
  }

  const titlePng = await paintCentreName().catch(() => null);
  const contentTop = pageH - margin;
  if (titlePng) {
    const title = await pdf.embedPng(titlePng);
    const mainPx = 72;
    const maxW = pageW - left * 2;
    let drawnH = 22 * (title.height / mainPx);
    let drawnW = drawnH * (title.width / title.height);
    if (drawnW > maxW) {
      drawnW = maxW;
      drawnH = drawnW * (title.height / title.width);
    }
    const pad = drawnH * 0.055;
    const titleTop = contentTop - 1 + pad;
    const titleY = titleTop - drawnH;
    page.drawImage(title, { x: (pageW - drawnW) / 2, y: titleY, width: drawnW, height: drawnH });
    y = titleY + pad - 16;
  } else {
    const fallback = "SK COMPUTER & EDUCATION CENTRE";
    const titleW = font.widthOfTextAtSize(fallback, 22);
    page.drawText(fallback, { x: (pageW - titleW) / 2, y: contentTop - 22, size: 22, font, color: navy });
    y = contentTop - 40;
  }
  const addrSize = 13;
  const addrLines = ["Defence Colony, Air Force Gate, Izzat Nagar", "Bareilly, UP-243122"];
  for (const line of addrLines) {
    const addrW = font.widthOfTextAtSize(line, addrSize);
    page.drawText(line, { x: (pageW - addrW) / 2, y, size: addrSize, font, color: dark });
    y -= 15.2;
  }
  y -= 5;
  const serialText = serial ? `S.No. ${serial}` : "S.No.";
  const metaSize = 15.5;
  page.drawText(serialText, { x: left, y, size: metaSize, font: labelFont, color: dark });
  const heading = "ADMISSION FORM";
  const admitSize = 15;
  const headingW = century.widthOfTextAtSize(heading, admitSize);
  page.drawText(heading, { x: (pageW - headingW) / 2, y: y - 1, size: admitSize, font: century, color: navy });
  const phoneText = PHONE_DISPLAY;
  const phoneW = century.widthOfTextAtSize(phoneText, metaSize);
  const icon = metaSize * 0.92;
  const phoneIconX = pageW - left - phoneW - (icon + 2.5);
  const iconY = y + metaSize * 0.36 - icon / 2;
  if (phoneIcon) page.drawImage(phoneIcon, { x: phoneIconX, y: iconY, width: icon, height: icon });
  page.drawText(phoneText, { x: pageW - left - phoneW, y, size: metaSize, font: century, color: navy });
  y -= 11;
  if (detail) return drawDetail();

  function measure(text: string, fontSize: number) {
    try {
      return font.widthOfTextAtSize(plain(text || "-"), fontSize);
    } catch {
      return (text || "-").length * fontSize * 0.5;
    }
  }

  function fit(text: string, fontSize: number, max: number) {
    let value = plain(text || "-").replace(/\s+/g, " ").trim() || "-";
    if (measure(value, fontSize) <= max) return value;
    while (value.length > 1 && measure(`${value}...`, fontSize) > max) value = value.slice(0, -1);
    return `${value}...`;
  }

  function say(text: string, x: number, top: number, fontSize: number, color = ink) {
    const clean = plain(text || "-");
    try {
      page.drawText(clean, { x, y: top, size: fontSize, font, color });
    } catch {
      const safe = clean.replace(/[^\x20-\x7E]/g, "") || "-";
      try {
        page.drawText(safe, { x, y: top, size: fontSize, font, color });
      } catch {
        /* leave the box if this glyph cannot be drawn */
      }
    }
  }

  const contentW = pageW - left * 2;
  const split = 168;
  const signCount = [form.studentSign, form.parentSign, form.signUpload, managerSign].filter((item) => item?.startsWith("data:image/")).length;
  const signTall = signCount ? 40 : 0;
  const signBlock = signCount ? 10 + signTall + 6 : 0;
  const declW = pageW - margin - (left + 14) - 2;
  const truthLine = "The information I have given is completely true. If any information is found to be false, the institute may cancel my form.";
  const parentLine = "The parent declares that if my son or daughter, while going from home to the coaching centre or while returning, goes somewhere else, goes out with a friend, or meets with any kind of accident, neither the coaching centre nor any person working there will be responsible. The parent alone will be responsible.";
  const declGap = 16;
  const declBlock = form.declareTruth ? declGap + 4 + (linesOf(truthLine, 8, declW).length * 10 + 3) + (linesOf(parentLine, 8, declW).length * 10 + 3) : 0;
  const room = y - margin - declBlock - signBlock;
  const rowH = Math.min(24, Math.max(14, room / 28));
  const labelSize = 12.5;
  const valueSize = 12.5;
  const photoW = 84;
  const photoRows = 5;
  const photoH = photoRows * rowH;
  const photoTop = y;
  const photoX = left + contentW - photoW;
  const photoPad = 3.4;
  const photoBoxW = photoW - photoPad * 2;
  const photoBoxH = photoH - photoPad * 2;
  const photo = await embedAny(await cropCover(form.photo || "", photoBoxW, photoBoxH));
  page.drawRectangle({ x: photoX, y: photoTop - photoH, width: photoW, height: photoH, borderWidth: 0.8, borderColor: navy });
  if (photo) {
    page.drawImage(photo, { x: photoX + photoPad, y: photoTop - photoH + photoPad, width: photoBoxW, height: photoBoxH });
  } else {
    say("Photo", photoX + 16, photoTop - photoH / 2, 8, navy);
  }

  function sayBold(text: string, x: number, top: number, fontSize: number) {
    const clean = plain(text || "-");
    const dark = rgb(0.067, 0.067, 0.067);
    try {
      page.drawText(clean, { x, y: top, size: fontSize, font: labelFont, color: dark });
    } catch {
      say(clean, x, top, fontSize, dark);
    }
  }

  function fitLabel(text: string, fontSize: number, max: number) {
    let value = plain(text || "-").replace(/\s+/g, " ").trim() || "-";
    const widthOf = (sample: string) => {
      try {
        return century.widthOfTextAtSize(sample, fontSize);
      } catch {
        return sample.length * fontSize * 0.52;
      }
    };
    if (widthOf(value) <= max) return value;
    while (value.length > 1 && widthOf(`${value}...`) > max) value = value.slice(0, -1);
    return `${value}...`;
  }

  function sayHead(text: string, x: number, top: number, fontSize: number) {
    const clean = plain(text || "-");
    try {
      page.drawText(clean, { x, y: top, size: fontSize, font: century, color: dark });
    } catch {
      sayBold(clean, x, top, fontSize);
    }
  }

  async function row(label: string, value: string) {
    const beside = y > photoTop - photoH + 0.5;
    const boxW = beside ? contentW - photoW : contentW;
    const bottom = y - rowH;
    const base = bottom + Math.max(3.2, rowH * 0.32);
    page.drawRectangle({ x: left, y: bottom, width: boxW, height: rowH, borderWidth: 0.7, borderColor: navy });
    page.drawLine({ start: { x: left + split, y: bottom }, end: { x: left + split, y }, thickness: 0.7, color: navy });
    page.drawLine({ start: { x: left + split + 1.55, y: bottom }, end: { x: left + split + 1.55, y }, thickness: 0.7, color: navy });
    sayHead(fitLabel(label, labelSize, split - 12), left + 5, base, labelSize);
    const shown = fit(value || "-", valueSize, boxW - split - 12);
    const painted = await valueImage(shown, boxW - split - 12, valueSize);
    if (painted) {
      const h = Math.max(8, rowH - 3.6);
      const w = Math.min(boxW - split - 12, painted.width * (h / painted.height));
      page.drawImage(painted, { x: left + split + 5, y: bottom + (rowH - h) / 2, width: w, height: h });
    } else {
      say(shown, left + split + 5, base, valueSize, ink);
    }
    y -= rowH;
  }
  async function valueImage(text: string, maxPt: number, fontPt: number) {
    const png = await nonAsciiPng(text, maxPt, fontPt);
    if (!png) return null;
    try {
      return await pdf.embedPng(png);
    } catch {
      return null;
    }
  }

  function linesOf(text: string, fontSize: number, max: number) {
    const words = plain(text || "-").split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (font.widthOfTextAtSize(next, fontSize) > max && line) {
        lines.push(line);
        line = word;
      } else line = next;
    }
    if (line) lines.push(line);
    return lines.length ? lines : ["-"];
  }

  async function embedAny(dataUrl: string) {
    if (!dataUrl.startsWith("data:image/")) return null;
    try {
      const bytes = dataUrlBytes(dataUrl);
      if (dataUrl.startsWith("data:image/png")) return await pdf.embedPng(bytes);
      if (dataUrl.includes("image/jp")) return await pdf.embedJpg(bytes);
    } catch {
      /* convert below */
    }
    if (import.meta.env.SSR) {
      try {
        const { createCanvas, loadImage } = await import("@napi-rs/canvas");
        const loaded = await loadImage(Buffer.from(dataUrlBytes(dataUrl)));
        const canvas = createCanvas(Math.max(1, loaded.width), Math.max(1, loaded.height));
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(loaded, 0, 0);
        return await pdf.embedPng(canvas.toBuffer("image/png"));
      } catch {
        return null;
      }
    }
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("image"));
        el.src = dataUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, img.naturalWidth || img.width);
      canvas.height = Math.max(1, img.naturalHeight || img.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) return null;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      return await pdf.embedPng(dataUrlBytes(canvas.toDataURL("image/png")));
    } catch {
      return null;
    }
  }

  async function paintCenteredSign(label: string, dataUrl: string, x: number, col: number, top: number) {
    const image = await embedAny(dataUrl);
    const size = 8;
    const text = fit(label, size, col - 2);
    let textW = text.length * size * 0.5;
    try {
      textW = font.widthOfTextAtSize(text, size);
    } catch {
      /* keep the estimate */
    }
    say(text, x + Math.max(0, (col - textW) / 2), top - 8, size, navy);
    if (!image) return 12;
    const maxH = 26;
    const scale = Math.min((col - 2) / image.width, maxH / image.height);
    const w = image.width * scale;
    const h = image.height * scale;
    const draw = { x: x + (col - w) / 2, y: top - 10 - h, width: w, height: h };
    if (label.startsWith("Manager")) page.drawImage(image, { ...draw, blendMode: BlendMode.Multiply });
    else page.drawImage(image, draw);
    return 12 + h;
  }

  async function placeSigns(slots: [string, string][], top: number) {
    const manager = managerSign.startsWith("data:image/") ? managerSign : "";
    const pad = managerPad.startsWith("data:image/") ? managerPad : "";
    const rightCol = 118;
    const hasRight = Boolean(manager || pad);
    const rightX = pageW - left - rightCol;
    const leftWidth = hasRight ? Math.max(80, rightX - left - 12) : pageW - left * 2;
    const count = slots.length;
    let used = 12;
    if (count) {
      if (count === 1) {
        const tall = await paintCenteredSign(slots[0][0], slots[0][1], left, 120, top);
        if (tall > used) used = tall;
      } else {
        const col = leftWidth / count;
        for (let index = 0; index < count; index += 1) {
          const tall = await paintCenteredSign(slots[index][0], slots[index][1], left + index * col, col, top);
          if (tall > used) used = tall;
        }
      }
    }
    if (!hasRight) return used;
    let cursor = top;
    if (manager) {
      const tall = await paintCenteredSign("Manager's Signature", manager, rightX, rightCol, cursor);
      cursor = top - tall - 1;
      if (tall > used) used = tall;
    }
    if (pad) {
      if (!manager) {
        const tall = await paintCenteredSign("Manager's Signature", pad, rightX, rightCol, cursor);
        if (tall > used) used = tall;
      } else {
        const image = await embedAny(pad);
        if (image) {
          const maxH = 24;
          const scale = Math.min((rightCol - 2) / image.width, maxH / image.height);
          const w = image.width * scale;
          const h = image.height * scale;
          page.drawImage(image, {
            x: rightX + (rightCol - w) / 2,
            y: cursor - h,
            width: w,
            height: h,
            blendMode: BlendMode.Multiply,
          });
          const total = top - (cursor - h);
          if (total > used) used = total;
        }
      }
    }
    return used;
  }

  await row("Student's Name", form.student);
  await row("Father's Name", form.father);
  await row("Mother's Name", form.mother);
  await row("Husband's Name", form.husband);
  await row("Gender", form.gender);
  await row("Marital Status", form.marital || "-");
  await row("Date Of Birth", form.dob);
  await row("Place", form.birthPlace);
  await row("Religion", form.religion);
  await row("Caste", form.caste);
  await row("Category", form.category);
  await row("Aadhaar Number", form.aadhaar);
  await row("Course", form.course);
  await row("Qualification", form.qualification);
  await row("School Or College", form.school);
  await row("Board", form.board);
  await row("Passing Year", form.passingYear);
  await row("Marks Obtained", form.marksGot);
  await row("Total Marks", form.marksTotal);
  await row("Percentage", form.percentage);
  await row("Mobile", form.mobile);
  await row("PIN", form.pin);
  await row("Email", form.email);
  await row("Batch", form.batch);
  await row("Address", form.address);
  await row("Computer Knowledge", form.knowledge);
  await row("Occupation", form.occupation);
  await row("Fee Status", form.paymentStatus === "Paid" ? `Paid  Rs ${form.paymentAmount}  ${form.paymentMethod}` : "Not Paid");
  page.drawRectangle({
    x: left - 1.55,
    y: y - 1.55,
    width: contentW + 3.1,
    height: photoTop - y + 3.1,
    borderWidth: 0.7,
    borderColor: navy,
  });

  if (form.declareTruth) {
    const note = (n: string, text: string) => {
      const textX = left + 14;
      const rows = linesOf(text, 8, pageW - margin - textX - 2);
      say(`${n}.`, left, y - 9, 8.5, navy);
      rows.forEach((line, index) => say(line, textX, y - 9 - index * 10, 8, ink));
      y -= rows.length * 10 + 3;
    };
    y -= declGap;
    sayBold("Declaration", left, y, 10);
    y -= 4;
    note("1", "The information I have given is completely true. If any information is found to be false, the institute may cancel my form.");
    note(
      "2",
      "The parent declares that if my son or daughter, while going from home to the coaching centre or while returning, goes somewhere else, goes out with a friend, or meets with any kind of accident, neither the coaching centre nor any person working there will be responsible. The parent alone will be responsible.",
    );
  }

  const signSlots: [string, string][] = [];
  if (form.studentSign?.startsWith("data:image/")) signSlots.push(["Applicant's Signature", form.studentSign]);
  if (form.parentSign?.startsWith("data:image/")) signSlots.push(["Parent's Signature", form.parentSign]);
  if (form.signUpload?.startsWith("data:image/")) signSlots.push(["Applicant's Signature", form.signUpload]);
  if (signSlots.length || managerSign.startsWith("data:image/") || managerPad.startsWith("data:image/")) {
    const used = await placeSigns(signSlots, y);
    y -= used + 6;
  }

  if (includeDocuments) {
    async function addImagePage(label: string, dataUrl: string) {
      const image = await embedAny(await compactDoc(dataUrl));
      if (!image) return;
      addPage();
      say(label, left, y, 14, navy);
      y -= 18;
      const maxW = pageW - left * 2;
      const maxH = pageH - margin * 2 - 28;
      const scale = Math.min(maxW / image.width, maxH / image.height, 1);
      page.drawImage(image, { x: left, y: y - image.height * scale, width: image.width * scale, height: image.height * scale });
    }
    async function addPdfPages(dataUrl: string) {
      if (!dataUrl.startsWith("data:application/pdf")) return;
      try {
        const other = await PDFDocument.load(dataUrlBytes(dataUrl));
        const copied = await pdf.copyPages(other, other.getPageIndices());
        copied.forEach((copiedPage) => pdf.addPage(copiedPage));
      } catch {
        addPage();
        say("A PDF document could not be attached.", left, y, 11, ink);
      }
    }
    if (form.aadhaarData.startsWith("data:application/pdf")) await addPdfPages(form.aadhaarData);
    else await addImagePage(`Aadhaar file: ${form.aadhaarName || "file"}`, form.aadhaarData);
    if (form.documentData.startsWith("data:application/pdf")) await addPdfPages(form.documentData);
    else await addImagePage(`Document: ${form.documentName || "file"}`, form.documentData);
  }

  async function drawDetail() {
    const photoW = 84;
    const photoH = 104;
    const pad = 3.4;
    const boxW = photoW - pad * 2;
    const boxH = photoH - pad * 2;
    const photo = await embedAny(await cropCover(form.photo || "", boxW, boxH));
    if (photo) {
      const x = pageW - margin - photoW;
      page.drawRectangle({ x, y: y - photoH, width: photoW, height: photoH, borderWidth: 0.8, borderColor: navy });
      page.drawImage(photo, { x: x + pad, y: y - photoH + pad, width: boxW, height: boxH });
    }
    const status = form.paymentStatus === "Paid" ? `Paid  Rs ${form.paymentAmount || ""}  ${form.paymentMethod || ""}`.trim() : "Not paid";
    sayBold("Fee Status", left, y - 16, 11);
    say(status, left, y - 32, 12.5, dark);
    y -= (photo ? photoH : 46) + 16;

    const fields: [string, string][] = [
      ["Course", form.course || "-"],
      ["Student's Name", form.student || "-"],
      ["Gender", form.gender || "-"],
      ["Marital Status", form.marital || "-"],
      ["Date Of Birth", form.dob || "-"],
      ["Place", form.birthPlace || "-"],
      ["Religion", form.religion || "-"],
      ["Caste", form.caste || "-"],
      ["Category", form.category || "-"],
      ["Aadhaar Number", form.aadhaar || "-"],
      ["Father's Name", form.father || "-"],
      ["Mother's Name", form.mother || "-"],
      ["Husband's Name", form.husband || "-"],
      ["Occupation", form.occupation || "-"],
      ["Qualification", form.qualification || "-"],
      ["School Or College", form.school || "-"],
      ["Board", form.board || "-"],
      ["Passing Year", form.passingYear || "-"],
      ["Marks Obtained", form.marksGot || "-"],
      ["Total Marks", form.marksTotal || "-"],
      ["Percentage", form.percentage || "-"],
      ["Address", form.address || "-"],
      ["PIN", form.pin || "-"],
      ["Mobile", form.mobile || "-"],
      ["Email", form.email || "-"],
      ["Computer Knowledge", form.knowledge || "-"],
      ["Batch", form.batch || "-"],
    ];
    for (const [label, value] of fields) {
      sayBold(label, left, y, 11);
      y -= 14;
      const lines = linesOf(value, 12.5, pageW - left * 2);
      for (const line of lines) {
        say(line, left, y, 12.5, dark);
        y -= 15;
      }
      y -= 2;
      page.drawLine({ start: { x: left, y }, end: { x: pageW - left, y }, thickness: 0.4, color: rgb(0.82, 0.78, 0.7) });
      y -= 11;
    }

    const signs: [string, string][] = [];
    if (form.studentSign?.startsWith("data:image/")) signs.push(["Applicant's Signature", form.studentSign]);
    if (form.parentSign?.startsWith("data:image/")) signs.push(["Parent's Signature", form.parentSign]);
    if (form.signUpload?.startsWith("data:image/")) signs.push(["Applicant's Signature", form.signUpload]);
    if (signs.length || managerSign.startsWith("data:image/") || managerPad.startsWith("data:image/")) {
      const used = await placeSigns(signs, y);
      y -= used + 8;
    }

    if (form.declareTruth) {
      const note = (n: string, text: string) => {
        const textX = left + 14;
        const rows = linesOf(text, 9, pageW - margin - textX - 2);
        say(`${n}.`, left, y - 11, 9, navy);
        rows.forEach((line, index) => say(line, textX, y - 11 - index * 11, 9, ink));
        y -= rows.length * 11 + 4;
      };
      y -= 8;
      sayBold("Declaration", left, y, 11);
      y -= 4;
      note("1", "The information I have given is completely true. If any information is found to be false, the institute may cancel my form.");
      note("2", "The parent declares that if my son or daughter, while going from home to the coaching centre or while returning, goes somewhere else, goes out with a friend, or meets with any kind of accident, neither the coaching centre nor any person working there will be responsible. The parent alone will be responsible.");
    }

    async function paintFile(label: string, dataUrl: string, name: string, large = false) {
      if (!dataUrl) return;
      y -= 8;
      sayBold(label, left, y, 11);
      y -= 14;
      if (dataUrl.startsWith("data:image/")) {
        const image = await embedAny(large ? await compactDoc(dataUrl) : dataUrl);
        if (!image) {
          say(name || "-", left, y, 10, ink);
          y -= 14;
          return;
        }
        const maxW = pageW - left * 2;
        const maxH = large ? 780 : 220;
        const scale = Math.min(maxW / image.width, maxH / image.height, 1);
        const w = image.width * scale;
        const h = image.height * scale;
        page.drawImage(image, { x: left, y: y - h, width: w, height: h });
        y -= h + 12;
        return;
      }
      say(name || "file", left, y, 10, ink);
      y -= 16;
    }
    await paintFile("Photo", form.photo || "", "photo.jpg");
    await paintFile(form.aadhaarName ? `Aadhaar file: ${form.aadhaarName}` : "Aadhaar file", form.aadhaarData || "", form.aadhaarName || "aadhaar", true);
    await paintFile(form.documentName ? `Document: ${form.documentName}` : "Document", form.documentData || "", form.documentName || "document", true);

    const bottom = Math.max(10, y - 18);
    const height = pageH - bottom;
    page.setMediaBox(0, bottom, pageW, height);
    page.setCropBox(0, bottom, pageW, height);
    const bytes = await pdf.save();
    return new Uint8Array(bytes);
  }

  const bytes = await pdf.save();
  return new Uint8Array(bytes);
}

function pdfBlob(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes.byteLength);
  copy.set(bytes);
  return new Blob([copy], { type: "application/pdf" });
}

export async function downloadAdmissionPdf(
  form: AdmissionForm,
  serial: number,
  includeDocuments: boolean,
  managerSign = "",
  managerPad = "",
  mode: "sheet" | "detail" = "sheet",
) {
  const bytes = await buildAdmissionPdf(form, serial, includeDocuments, managerSign, mode, managerPad);
  const url = URL.createObjectURL(pdfBlob(bytes));
  const link = document.createElement("a");
  link.href = url;
  link.download =
    mode === "detail"
      ? `SK-form-${serial}.pdf`
      : includeDocuments
        ? `SK-registration-${serial}-with-documents.pdf`
        : `SK-registration-${serial}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 20000);
}
