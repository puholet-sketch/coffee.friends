import sharp from "sharp";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const sourcePath =
  join(root, "assets/images/banner/coffee-friends-banner-vertical-source-v7.png");
const qrPath = join(root, "assets/images/banner/site-qr.png");
const masterPath = join(root, "assets/images/banner/coffee-friends-banner-vertical.png");
const outPath = join(root, "assets/images/banner/coffee-friends-banner-vertical-print.png");
const TARGET_WIDTH = 3072;

const banner = sharp(sourcePath);
const meta = await banner.metadata();
const w = meta.width;
const h = meta.height;

// Нижний блок: QR в рамке слева (не трогать ассортимент выше)
const qrSize = Math.round(w * 0.165);
const left = Math.round(w * 0.088);
const top = Math.round(h * 0.755);

const qr = await sharp(qrPath)
  .resize(qrSize, qrSize, { fit: "fill" })
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

const masterMeta = await sharp(masterPath).metadata();
const outMeta = await sharp(outPath).metadata();
console.log("Source:", sourcePath);
console.log(`QR @ ${left},${top} size ${qrSize}`);
console.log("Master:", `${masterMeta.width}x${masterMeta.height}`);
console.log("Print:", `${outMeta.width}x${outMeta.height}`);
