/**
 * Собирает assets/js/static-embed.js из JSON — чтобы галерея и календарь
 * работали при открытии index.html через file:// (без fetch к локальным файлам).
 * Запуск: node tools/embed-static-data.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outFile = path.join(root, "assets", "js", "static-embed.js");
const manifestPath = path.join(root, "assets", "photos", "manifest.json");
const calendarPath = path.join(root, "assets", "data", "coffee-calendar-2026.json");

const galleryManifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const coffeeCalendar = JSON.parse(fs.readFileSync(calendarPath, "utf8"));

const payload = { galleryManifest, coffeeCalendar };
const body = `window.__COFEPOINT_EMBED = ${JSON.stringify(payload)};\n`;
const banner = `/* Автогенерация: node tools/embed-static-data.mjs — не править руками */\n`;

fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, banner + body, "utf8");
console.log(`Wrote ${outFile} (${(Buffer.byteLength(banner + body) / 1024).toFixed(1)} KB)`);
