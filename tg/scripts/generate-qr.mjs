import QRCode from "qrcode";
import { readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const config = JSON.parse(
  readFileSync(join(root, "tg/config.json"), "utf8"),
);
const url = config.links?.bot || "https://t.me/coffeefriends_orders_bot";
const outDir = join(root, "assets/images/order");
if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });

const opts = { type: "svg", margin: 1, color: { dark: "#121212", light: "#f5f0e6" } };

await QRCode.toFile(join(outDir, "bot-qr.svg"), url, opts);
await QRCode.toFile(join(outDir, "bot-qr.png"), url, {
  ...opts,
  type: "png",
  width: 400,
});

console.log("QR сохранён:", join(outDir, "bot-qr.svg"), "и bot-qr.png");
console.log("Ссылка:", url);
