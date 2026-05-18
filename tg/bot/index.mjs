import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { loadConfig, loadMenu, loadToken, tgRoot } from "./lib/load.mjs";
import { createTelegramApi } from "./lib/api.mjs";
import { createHandlers } from "./lib/handlers.mjs";

const config = loadConfig();
const menu = loadMenu();
const token = loadToken();
const api = createTelegramApi(token);
const { handleCallback, handleMessage } = createHandlers(api, menu, config);
const OFFSET_FILE = join(tgRoot, ".poll-offset");

async function setupBotProfile() {
  await api.setMyCommands([
    { command: "start", description: "Новый заказ" },
    { command: "menu", description: "Главное меню" },
    { command: "cart", description: "Мой заказ" },
    { command: "cancel", description: "Отменить" },
  ]);
}

function readOffset() {
  if (!existsSync(OFFSET_FILE)) return 0;
  const n = parseInt(readFileSync(OFFSET_FILE, "utf8"), 10);
  return Number.isFinite(n) ? n : 0;
}

function writeOffset(n) {
  writeFileSync(OFFSET_FILE, String(n), "utf8");
}

async function pollLoop() {
  let offset = readOffset();
  console.log("CoffeeFriends бот v2 — заказ / предзаказ на дату, статусы из группы");

  while (true) {
    try {
      const updates = await api.getUpdates({
        offset,
        timeout: 50,
        allowed_updates: ["message", "callback_query"],
      });
      for (const u of updates) {
        offset = u.update_id + 1;
        writeOffset(offset);
        try {
          if (u.callback_query) await handleCallback(u.callback_query);
          else if (u.message) await handleMessage(u.message);
        } catch (err) {
          console.error("update", u.update_id, err.message);
        }
      }
    } catch (err) {
      console.error("poll", err.message);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

await setupBotProfile();
await pollLoop();
