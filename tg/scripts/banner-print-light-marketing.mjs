/**
 * Печать light-marketing: 600×1600 mm, 150 dpi, CMYK Coated FOGRA39.
 * cd tg && npm run banner:print:light-marketing
 */
import QRCode from "qrcode";
import sharp from "sharp";
import { mkdirSync, existsSync, writeFileSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const bannerRoot = join(root, "target banner");
const sourceDir = join(bannerRoot, "source");
const printDir = join(bannerRoot, "print");
const iccDir = join(bannerRoot, "icc");

const SITE_URL = "https://puholet-sketch.github.io/coffee.friends/";
const SOURCE_NAME = "coffee-friends-banner-vertical-light-marketing-source.png";
const MM_W = 600;
const MM_H = 1600;
const DPI = 150;
const px = (mm) => Math.round((mm / 25.4) * DPI);
const OUT_W = px(MM_W);
const OUT_H = px(MM_H);
const TARGET_RATIO = MM_W / MM_H;

const sourcePath = join(sourceDir, SOURCE_NAME);
const masterRgb = join(
  printDir,
  "coffee-friends-banner-light-marketing-600x1600mm-150dpi-rgb.png",
);
const masterTiff = join(
  printDir,
  "coffee-friends-banner-light-marketing-600x1600mm-150dpi-cmyk.tiff",
);
const masterPdf = join(
  printDir,
  "coffee-friends-banner-light-marketing-600x1600mm-150dpi-cmyk.pdf",
);

mkdirSync(printDir, { recursive: true });
mkdirSync(iccDir, { recursive: true });

if (!existsSync(sourcePath)) {
  console.error("Нет исходника:", sourcePath);
  process.exit(1);
}

// QR в нижнем CTA (доли от исходника до масштабирования)
const qrRelW = 0.14;
const qrRelLeft = 0.07;
const qrRelTop = 0.735;

async function buildQrPng(sizePx) {
  return QRCode.toBuffer(SITE_URL, {
    type: "png",
    width: sizePx,
    margin: 1,
    errorCorrectionLevel: "H",
    color: { dark: "#1e2a44", light: "#ffffff" },
  });
}

function findMagick() {
  const candidates = [
    process.env.IMAGEMAGICK_BINARY,
    "magick",
    "C:\\Program Files\\ImageMagick-7.1.2-Q16-HDRI\\magick.exe",
    "C:\\Program Files\\ImageMagick-7.1.1-Q16-HDRI\\magick.exe",
    "C:\\Program Files\\ImageMagick-7.1.2-24-Q16-HDRI\\magick.exe",
  ].filter(Boolean);
  for (const cmd of candidates) {
    try {
      const out = execSync(`"${cmd}" -version`, { encoding: "utf8" });
      if (/ImageMagick/i.test(out)) return cmd;
    } catch {
      /* next */
    }
  }
  return null;
}

function resolveFograIcc() {
  const winIcc =
    "C:\\Windows\\System32\\spool\\drivers\\color\\CoatedFOGRA39.icc";
  if (existsSync(winIcc)) return winIcc;
  const local = join(iccDir, "CoatedFOGRA39.icc");
  if (existsSync(local) && readFileSync(local).length > 50000) return local;
  throw new Error(
    "Нет CoatedFOGRA39.icc (ожидался " + winIcc + ")",
  );
}

async function compositeRgb() {
  const meta = await sharp(sourcePath).metadata();
  const w = meta.width;
  const h = meta.height;
  const ratio = w / h;
  const qrSize = Math.round(w * qrRelW);
  const left = Math.round(w * qrRelLeft);
  const top = Math.round(h * qrRelTop);
  const qr = await buildQrPng(qrSize);

  const withQr = await sharp(sourcePath)
    .composite([{ input: qr, left, top }])
    .png()
    .toBuffer();

  const fit =
    Math.abs(ratio - TARGET_RATIO) <= 0.04 ? "fill" : "contain";

  if (fit === "contain") {
    console.warn(
      `Исходник ${w}×${h} → вписываем в ${OUT_W}×${OUT_H} (3:8) без растягивания (contain).`,
    );
  }

  await sharp(withQr)
    .resize(OUT_W, OUT_H, {
      fit,
      position: "centre",
      background: { r: 255, g: 255, b: 255, alpha: 1 },
      kernel: sharp.kernel.lanczos3,
    })
    .withMetadata({ density: DPI })
    .png()
    .toFile(masterRgb);

  console.log("RGB:", masterRgb, `${OUT_W}×${OUT_H} @ ${DPI} dpi, fit=${fit}`);
  console.log("QR на исходнике @", left, top, "size", qrSize);
  return { w, h, fit };
}

async function exportCmykMagick() {
  const magick = findMagick();
  if (!magick) return false;

  const fogra = resolveFograIcc();
  console.log("ICC:", fogra);
  const srgb = "C:\\Windows\\System32\\spool\\drivers\\color\\sRGB Color Space Profile.icm";
  const hasSrgb = existsSync(srgb);
  const cmd = [
    `"${magick}"`,
    `"${masterRgb}"`,
    "-units",
    "PixelsPerInch",
    "-density",
    String(DPI),
    hasSrgb ? ["-profile", `"${srgb}"`] : [],
    "-intent",
    "Relative",
    "-black-point-compensation",
    "-colorspace",
    "CMYK",
    "-profile",
    `"${fogra}"`,
    `"${masterTiff}"`,
  ]
    .flat()
    .join(" ");
  execSync(cmd, { stdio: "inherit", shell: true });
  execSync(
    `"${magick}" "${masterTiff}" -density ${DPI} "${masterPdf}"`,
    { stdio: "inherit", shell: true },
  );
  console.log("CMYK TIFF (ImageMagick + FOGRA39):", masterTiff);
  console.log("CMYK PDF:", masterPdf);
  return true;
}

async function exportCmykSharp() {
  try {
    await sharp(masterRgb)
      .withMetadata({ density: DPI })
      .toColourspace("cmyk")
      .tiff({ compression: "lzw", xres: DPI, yres: DPI })
      .toFile(masterTiff);
    console.log("CMYK TIFF (sharp, без вложенного ICC — проверьте в Rip):", masterTiff);
    return true;
  } catch (err) {
    console.error("sharp CMYK:", err.message);
    return false;
  }
}

await compositeRgb();
let cmyk = await exportCmykMagick();
if (!cmyk) cmyk = await exportCmykSharp();
console.log("Готово. CMYK:", cmyk ? "да" : "нет");
