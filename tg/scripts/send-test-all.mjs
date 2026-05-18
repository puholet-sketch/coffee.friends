/**
 * Проверка отправки во все нужные места группы.
 * Запуск: node tg/scripts/send-test-all.mjs
 * Один адрес: node tg/scripts/send-test-all.mjs general|floor_2|floor_11
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const tokenPath = join(root, "tg", "token", "token.txt");
const configPath = join(root, "tg", "config.json");
const configExamplePath = join(root, "tg", "config.example.json");

const TARGETS = {
  general: {
    label: "Общая",
    text: "✅ Тест CoffeeFriends — тема «Общая».\n\nЕсли видите это здесь — бот пишет в общую тему.",
  },
  floor_2: {
    label: "2 этаж",
    text: "✅ Тест CoffeeFriends — тема «2 этаж».\n\nБот может писать на второй этаж.",
  },
  floor_11: {
    label: "11 этаж",
    text: "✅ Тест CoffeeFriends — тема «11 этаж».\n\nБот может писать на одиннадцатый этаж.",
  },
};

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

if (!existsSync(tokenPath)) {
  console.error("Нет файла tg/token/token.txt");
  process.exit(1);
}

const token = readFileSync(tokenPath, "utf8").trim();
if (!token) {
  console.error("Файл tg/token/token.txt пустой");
  process.exit(1);
}

const config = existsSync(configPath)
  ? loadJson(configPath)
  : loadJson(configExamplePath);

const chatId = config.group_chat_id;
const only = process.argv[2];
const keys = only ? [only] : Object.keys(TARGETS);

if (only && !TARGETS[only]) {
  console.error("Неизвестная цель:", only, "— используйте: general, floor_2, floor_11");
  process.exit(1);
}

const url = `https://api.telegram.org/bot${token}/sendMessage`;

for (const key of keys) {
  const threadId = config.topics[key];
  if (threadId === undefined) {
    console.error("В config.json нет topics." + key);
    process.exit(1);
  }

  const { label, text } = TARGETS[key];
  const payload = { chat_id: chatId, text };
  if (threadId != null) payload.message_thread_id = threadId;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!data.ok) {
    const where =
      threadId == null ? "общая лента группы" : "thread " + threadId;
    console.error("Ошибка для «" + label + "» (" + where + "):", data.description || data);
    process.exit(1);
  }

  const where =
    threadId == null ? "общая лента (без номера темы)" : "thread " + threadId;
  console.log("OK — «" + label + "» (" + where + ")");
  if (keys.length > 1) await new Promise((r) => setTimeout(r, 400));
}

console.log("\nГотово. Проверьте группу CoffeeFriends — Заказы и вкладки тем.");
