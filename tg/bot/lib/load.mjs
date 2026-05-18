import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const tgRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const projectRoot = join(tgRoot, "..");

/** tg/.env — без зависимости dotenv (не перезаписывает уже заданные переменные) */
export function loadEnvFile() {
  const envPath = join(tgRoot, ".env");
  if (!existsSync(envPath)) return;
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 1) continue;
    const key = t.slice(0, i).trim();
    if (process.env[key]) continue;
    let val = t.slice(i + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

export function loadConfig() {
  const path = join(tgRoot, "config.json");
  if (!existsSync(path)) throw new Error("Нет tg/config.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

export function loadToken() {
  const path = join(tgRoot, "token", "token.txt");
  if (!existsSync(path)) throw new Error("Нет tg/token/token.txt");
  const token = readFileSync(path, "utf8").trim();
  if (!token) throw new Error("tg/token/token.txt пустой");
  return token;
}

export function loadMenu() {
  const path = join(projectRoot, "assets/data/menu.json");
  return JSON.parse(readFileSync(path, "utf8"));
}

export { projectRoot, tgRoot };
