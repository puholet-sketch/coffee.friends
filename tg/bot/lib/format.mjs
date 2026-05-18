import { formatCostBlockForBarista, formatCartLines, orderTotalLine } from "./cart-line.mjs";

export { formatCartLines, orderTotalLine };

export function orderTypeLabel(orderType) {
  return orderType === "preorder" ? "Предзаказ на дату" : "Заказ сейчас";
}

export function formatOrderMessage({ orderType, floor, cart, comment, customerName, pickupDate, from }) {
  const floorLabel = floor === 11 ? "11 этаж" : "2 этаж";
  const who = [];
  if (customerName) who.push(customerName);
  else {
    if (from.username) who.push("@" + from.username);
    if (from.first_name) who.push(from.first_name);
  }
  const whoLine = who.length ? who.join(" · ") : "Гость";

  const lines = [
    orderType === "preorder" ? "📅 Предзаказ на дату" : "☕ Заказ сейчас",
    "📍 " + floorLabel,
    "👤 " + whoLine,
  ];
  if (orderType === "preorder" && pickupDate) {
    lines.push("🗓 " + pickupDate);
  }
  lines.push("", formatCostBlockForBarista(cart));
  if (comment?.trim()) lines.push("", "💬 " + comment.trim());
  lines.push("", "⏱ " + new Date().toLocaleString("ru-RU", { timeZone: "Europe/Moscow" }));
  lines.push(
    "",
    "↩️ Ответьте на это сообщение («в работе», «готово», «отменено» или свой текст) — клиент получит уведомление в боте.",
  );
  return lines.join("\n");
}
