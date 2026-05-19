import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const bannerPath = join(root, "assets/images/banner/coffee-friends-banner-vertical.png");
const qrPath = join(root, "assets/images/banner/site-qr.png");
const masterPath = join(root, "assets/images/banner/coffee-friends-banner-vertical.png");
const outPath = join(root, "assets/images/banner/coffee-friends-banner-vertical-print.png");

const TARGET_WIDTH = 3072;

const banner = sharp(bannerPath);
const meta = await banner.metadata();
const w = meta.width;
const h = meta.height;

// QR block: left area in contact section (~72% from top)
const qrSize = Math.round(w * 0.28);
const left = Math.round(w * 0.08);
const top = Math.round(h * 0.58);

const qr = await sharp(qrPath)
  .resize(qrSize, qrSize, { fit: "contain", background: { r: 18, g: 16, b: 24, alpha: 1 } })
  .png()
  .toBuffer();

const composited = await banner
  .composite([{ input: qr, left, top }])
  .png()
  .toBuffer();

await sharp(composited).toFile(masterPath);

let img = sharp(composited);
if (w < TARGET_WIDTH) {
  img = img.resize(TARGET_WIDTH, null, { kernel: sharp.kernel.lanczos3 });
}
await img.toFile(outPath);

const outMeta = await sharp(outPath).metadata();
const masterMeta = await sharp(masterPath).metadata();
console.log("Master:", masterPath, `${masterMeta.width}x${masterMeta.height}`);
console.log("Print:", outPath, `${outMeta.width}x${outMeta.height}`);
