import nodemailer from "nodemailer";

const DEFAULT_TO = "coffee.friends@yandex.ru";

/** Контакт для обратной связи: @username и/или numeric id */
export function formatUserContact(from = {}, chatId) {
  const lines = [];
  const name = [from.first_name, from.last_name].filter(Boolean).join(" ").trim();
  if (name) lines.push(`Имя в Telegram: ${name}`);
  if (from.username) {
    lines.push(`Логин: @${from.username}`);
    lines.push(`Ссылка: https://t.me/${from.username}`);
  } else if (from.id) {
    lines.push("Логин: не указан (@username отсутствует)");
    lines.push(`Ссылка для ответа: tg://user?id=${from.id}`);
  }
  if (from.id) lines.push(`User id: ${from.id}`);
  if (from.language_code) lines.push(`Язык: ${from.language_code}`);
  if (chatId) lines.push(`Chat id: ${chatId}`);
  return lines.join("\n");
}

let transporter;

function getTransporter() {
  const user = process.env.SMTP_USER || process.env.REPORT_SMTP_USER;
  const pass = process.env.SMTP_PASS || process.env.REPORT_SMTP_PASS;
  if (!user || !pass) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.yandex.ru",
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE !== "false",
      auth: { user, pass },
    });
  }
  return transporter;
}

function reportTo(config) {
  return config?.report?.to || process.env.REPORT_EMAIL_TO || DEFAULT_TO;
}

/**
 * @param {{ kind: 'error'|'feedback', config?: object, from?: object, chatId?: number, text?: string, error?: Error, meta?: object }} opts
 */
export async function sendBotReport(opts) {
  const { kind, config, from, chatId, text, error, meta } = opts;
  const to = reportTo(config);
  const label = kind === "feedback" ? "Пожелание" : "Ошибка";
  const subject = `[CoffeeFriends] ${label}`;

  let body = `${label} — бот заказов\n\n--- Контакт ---\n${formatUserContact(from, chatId)}\n\n`;
  if (text) body += `--- Текст ---\n${text}\n\n`;
  if (error) {
    body += `--- Ошибка ---\n${error.message}\n`;
    if (error.stack) body += `${error.stack}\n`;
    body += "\n";
  }
  if (meta && Object.keys(meta).length) {
    body += `--- Детали ---\n${JSON.stringify(meta, null, 2)}\n`;
  }

  const transport = getTransporter();
  if (!transport) {
    console.warn("[report] SMTP не настроен (SMTP_USER, SMTP_PASS). Лог:\n", body);
    return false;
  }

  const fromAddr = process.env.SMTP_FROM || process.env.SMTP_USER || process.env.REPORT_SMTP_USER;
  try {
    await transport.sendMail({ from: fromAddr, to, subject, text: body });
    console.log(`[report] ${label} → ${to}`);
    return true;
  } catch (e) {
    console.error("[report] отправка не удалась:", e.message);
    return false;
  }
}

export function userFacingErrorText(mailSent) {
  const mailNote = mailSent
    ? "Отчёт отправлен на почту."
    : "Почта не настроена на сервере — опишите проблему через /feedback.";
  return (
    `⚠️ <b>Что-то пошло не так.</b> ${mailNote}\n\n` +
    "Попробуйте /start или напишите нам: /feedback"
  );
}

export const FEEDBACK_PROMPT =
  "✉️ <b>Пожелания и обратная связь</b>\n\n" +
  "Напишите одним сообщением идею, замечание или что пошло не так.\n\n" +
  "В письме на <b>coffee.friends@yandex.ru</b> будет ваш Telegram (@username или id) для ответа.\n\n" +
  "Отмена: /cancel";

export function feedbackThanksText(sent) {
  if (sent) {
    return "✅ Спасибо! Сообщение отправлено на coffee.friends@yandex.ru — ответим в Telegram, если указан @username.";
  }
  return (
    "⚠️ Не удалось отправить письмо (почта на сервере не настроена). " +
    "Напишите на coffee.friends@yandex.ru вручную или попробуйте позже."
  );
}
