import QRCode from "qrcode";
import { mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const url = "https://puholet-sketch.github.io/coffee.friends/";
const outDir = join(root, "target banner", "site-qr");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

await QRCode.toFile(join(outDir, "site-qr-light.png"), url, {
  type: "png",
  width: 900,
  margin: 2,
  errorCorrectionLevel: "H",
  color: { dark: "#1e2a44", light: "#ffffff" },
});

console.log("Light banner QR:", join(outDir, "site-qr-light.png"));
