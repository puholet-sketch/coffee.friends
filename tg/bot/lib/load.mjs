import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const tgRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const projectRoot = join(tgRoot, "..");

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
