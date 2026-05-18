import { orderTypeLabel } from "./format.mjs";
import { floorLabel } from "./ui.mjs";

/** Распознать тип статуса по тексту бариста */
export function detectStatus(text) {
  const t = (text || "").toLowerCase().trim();
  if (!t) return { emoji: "📢", title: "Сообщение от бариста" };
  if (/готов|можно забирать|ждём вас/.test(t)) return { emoji: "🟢", title: "Готово" };
  if (/в работе|готовим|делаем|принят/.test(t)) return { emoji: "🟡", title: "В работе" };
  if (/отмен|нет в наличии|не сможем/.test(t)) return { emoji: "🔴", title: "Отменено" };
  return { emoji: "📢", title: "Сообщение от бариста" };
}

export function formatCustomerStatusMessage(order, baristaText, baristaName) {
  const status = detectStatus(baristaText);
  const fl = floorLabel(order.floor);
  const type = orderTypeLabel(order.orderType);
  const lines = [
    `${status.emoji} <b>${status.title}</b>`,
    "",
    `Заказ: ${type} · ${fl}`,
    `Имя: ${order.customerName || "—"}`,
  ];
  if (order.pickupDate) lines.push(`Дата: ${order.pickupDate}`);
  if (order.summary) {
    lines.push("", `<i>${order.summary}</i>`);
  }
  lines.push("", `Сообщение бариста${baristaName ? ` (${baristaName})` : ""}:`);
  lines.push(baristaText.trim());
  return lines.join("\n");
}
