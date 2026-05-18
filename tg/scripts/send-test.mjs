/**
 * Одноразовая проверка: бот пишет в тему группы.
 * Запуск из корня COFEPOINT: node tg/scripts/send-test.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const tokenPath = join(root, "tg", "token", "token.txt");
const configPath = join(root, "tg", "config.json");
const configExamplePath = join(root, "tg", "config.example.json");

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
const threadId = config.topics.floor_2;
const text =
  "✅ Тест от CoffeeFriends\n\nЕсли вы видите это в теме «2 этаж» — бот может писать в группу.";

const url = `https://api.telegram.org/bot${token}/sendMessage`;
const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: chatId,
    message_thread_id: threadId,
    text,
  }),
});

const data = await res.json();
if (!data.ok) {
  console.error("Telegram ответил ошибкой:", data.description || data);
  process.exit(1);
}

console.log("Готово: сообщение отправлено в тему «2 этаж» (thread", threadId + ").");
console.log("Проверьте группу CoffeeFriends — Заказы → вкладка 2 этаж.");
