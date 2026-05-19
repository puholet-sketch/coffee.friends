import sharp from "sharp";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const photosDir = join(root, "assets/photos");
const manifestPath = join(photosDir, "manifest.json");
const MAX_WIDTH = 1400;
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 80;

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const out = [];

for (const p of manifest.photos || []) {
  const rel = (p.src || "").replace(/^assets\/photos\//, "");
  const input = join(photosDir, rel);
  const webpRel = rel.replace(/\.jpe?g$/i, ".webp");
  const webpPath = join(photosDir, webpRel);

  const meta = await sharp(input).metadata();
  const tmp = `${input}.opt.jpg`;
  await sharp(input)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(tmp);
  await sharp(tmp).webp({ quality: WEBP_QUALITY }).toFile(webpPath);
  const { renameSync } = await import("node:fs");
  renameSync(tmp, input);

  const jpgStat = await sharp(input).metadata();
  out.push({
    src: `assets/photos/${rel}`,
    webp: `assets/photos/${webpRel}`,
    alt: p.alt || rel,
    floor: p.floor,
    width: jpgStat.width,
    height: jpgStat.height,
  });
  console.log(rel, meta.width, "→", jpgStat.width, "+ webp");
}

writeFileSync(manifestPath, JSON.stringify({ photos: out }, null, 2) + "\n", "utf8");
console.log("OK", out.length, "photos");
