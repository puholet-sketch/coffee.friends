import { cartTotal } from "./menu-data.mjs";

/** @typedef {{ name: string, label?: string, price: number, heating?: { grill?: boolean, microwave?: boolean } }} CartItem */

export function createCartItem(name, price, heating = {}) {
  const item = {
    name,
    price: Number(price) || 0,
    heating: normalizeHeating(heating),
  };
  item.label = formatItemLabel(item);
  return item;
}

export function normalizeHeating(h) {
  if (!h || (h.grill === undefined && h.microwave === undefined)) return {};
  const out = {};
  if (h.grill !== undefined) out.grill = Boolean(h.grill);
  if (h.microwave !== undefined) out.microwave = Boolean(h.microwave);
  return out;
}

export function formatItemLabel(item) {
  return item.name;
}

export function formatHeatingDetail(heating) {
  if (!heating) return [];
  const lines = [];
  if (heating.grill !== undefined) {
    lines.push(`   🔥 Гриль: ${heating.grill ? "да" : "нет"}`);
  }
  if (heating.microwave !== undefined) {
    lines.push(`   📻 Микроволновка: ${heating.microwave ? "да" : "нет"}`);
  }
  return lines;
}

/** Строки корзины для пользователя */
export function formatCartLines(cart) {
  if (!cart?.length) return "Пока пусто — добавьте позиции.";
  return cart
    .map((item, i) => {
      const base = `${i + 1}. ${item.name} — ${item.price} ₽`;
      const extra = formatHeatingDetail(item.heating);
      return extra.length ? base + "\n" + extra.join("\n") : base;
    })
    .join("\n\n");
}

/** Блок стоимости для сообщения бариста */
export function formatCostBlockForBarista(cart) {
  if (!cart?.length) return "";
  const lines = ["Стоимость заказа ~", ""];
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];
    lines.push(`${i + 1}. ${item.name} — ${item.price} ₽`);
    lines.push(...formatHeatingDetail(item.heating));
    if (i < cart.length - 1) lines.push("");
  }
  lines.push("", `Итого: ${cartTotal(cart)} ₽`);
  return lines.join("\n");
}

export function orderTotalLine(cart) {
  if (!cart?.length) return "";
  return `Стоимость заказа ~ ${cartTotal(cart)} ₽`;
}
