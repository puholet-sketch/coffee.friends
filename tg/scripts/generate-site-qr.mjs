import QRCode from "qrcode";
import { mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const url = "https://puholet-sketch.github.io/coffee.friends/";
const outDir = join(root, "assets/images/banner");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const colors = {
  dark: "#f0c84a",
  light: "#121018",
};

await QRCode.toFile(join(outDir, "site-qr.png"), url, {
  type: "png",
  width: 900,
  margin: 2,
  errorCorrectionLevel: "H",
  color: colors,
});

await QRCode.toFile(join(outDir, "site-qr.svg"), url, {
  type: "svg",
  margin: 2,
  errorCorrectionLevel: "H",
  color: colors,
});

console.log("Site QR:", join(outDir, "site-qr.png"));
console.log(url);
