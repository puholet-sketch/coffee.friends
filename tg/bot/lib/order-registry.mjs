import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const tgRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DATA_DIR = join(tgRoot, "data");
const FILE = join(DATA_DIR, "orders-registry.json");
const MAX_AGE_MS = 48 * 60 * 60 * 1000;
const MAX_ENTRIES = 300;

function load() {
  if (!existsSync(FILE)) return { orders: {} };
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return { orders: {} };
  }
}

function save(data) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(FILE, JSON.stringify(data, null, 2), "utf8");
}

function key(chatId, messageId) {
  return `${chatId}:${messageId}`;
}

function prune(orders) {
  const now = Date.now();
  const entries = Object.entries(orders).filter(([, o]) => now - o.createdAt < MAX_AGE_MS);
  entries.sort((a, b) => b[1].createdAt - a[1].createdAt);
  const kept = entries.slice(0, MAX_ENTRIES);
  return Object.fromEntries(kept);
}

export function registerOrder(record) {
  const data = load();
  const id = key(record.groupChatId, record.messageId);
  data.orders[id] = {
    ...record,
    createdAt: Date.now(),
  };
  data.orders = prune(data.orders);
  save(data);
  return id;
}

export function findOrderByReply(groupChatId, replyToMessageId) {
  if (!replyToMessageId) return null;
  const data = load();
  return data.orders[key(groupChatId, replyToMessageId)] || null;
}
