import { cartTotal, formatRub, groupDrinks, groupFood, drinksNow, preorderFood } from "./menu-data.mjs";
import { formatCartLines, orderTypeLabel } from "./format.mjs";
import { orderTotalLine } from "./cart-line.mjs";

const PAGE = 6;

export function floorLabel(floor) {
  return floor === 11 ? "11 этаж" : "2 этаж";
}

export function orderTypeKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "☕ Заказ сейчас (~5–10 мин)", callback_data: "type:now" }],
      [{ text: "📅 Предзаказ на дату", callback_data: "type:pre" }],
      [{ text: "✉️ Пожелания / обратная связь", callback_data: "nav:feedback" }],
    ],
  };
}

export function floorKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "2 этаж", callback_data: "floor:2" },
        { text: "11 этаж", callback_data: "floor:11" },
      ],
      [{ text: "← Назад", callback_data: "nav:type" }],
    ],
  };
}

export function nameKeyboard(suggested) {
  const rows = [];
  if (suggested) {
    rows.push([{ text: `✓ ${suggested}`, callback_data: "name:use" }]);
  }
  rows.push([{ text: "← Назад", callback_data: "nav:floor" }]);
  return { inline_keyboard: rows };
}

export function preorderDateKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "Завтра", callback_data: "date:tomorrow" }],
      [{ text: "Послезавтра", callback_data: "date:dayafter" }],
      [{ text: "✏️ Другая дата", callback_data: "date:custom" }],
      [{ text: "← Назад", callback_data: "nav:name" }],
    ],
  };
}

export function mainKeyboard(session) {
  const n = session.cart.length;
  const rows = [];
  if (session.orderType === "now") {
    rows.push([{ text: "☕ Напитки", callback_data: "nav:drinks" }]);
    rows.push([{ text: "🥪 Еда: сэндвичи, горячее…", callback_data: "nav:food" }]);
  } else {
    rows.push([{ text: "🍽 Меню предзаказа", callback_data: "nav:food" }]);
  }
  const sumHint = n ? ` · ${orderTotalLine(session.cart)}` : "";
  rows.push([{ text: n ? `🛒 Заказ (${n})${sumHint}` : "🛒 Заказ", callback_data: "nav:cart" }]);
  if (n) rows.push([{ text: "✅ Отправить бариста", callback_data: "cart:submit" }]);
  rows.push(
    [{ text: "💬 Комментарий", callback_data: "nav:comment" }],
    [{ text: "✉️ Пожелания", callback_data: "nav:feedback" }],
    [{ text: "↩ Сменить этаж", callback_data: "nav:floor" }],
    [{ text: "↩ Тип заказа", callback_data: "nav:type" }],
  );
  return { inline_keyboard: rows };
}

export function feedbackKeyboard(backData = "nav:main") {
  return {
    inline_keyboard: [[{ text: "← Назад", callback_data: backData }]],
  };
}

export function cartKeyboard(session) {
  const rows = [];
  if (session.cart.length) {
    rows.push([{ text: "✅ Отправить бариста", callback_data: "cart:submit" }]);
    rows.push([{ text: "🗑 Очистить", callback_data: "cart:clear" }]);
  }
  rows.push(
    [{ text: "💬 Комментарий", callback_data: "nav:comment" }],
    [{ text: "← В меню", callback_data: "nav:main" }],
  );
  return { inline_keyboard: rows };
}

export const EMPTY_CART_ALERT =
  "Корзина пуста. Сначала добавьте напитки или еду из меню.";

export function backMainRow() {
  return [{ text: "← В меню", callback_data: "nav:main" }];
}

export function drinksGroupsKeyboard(menu) {
  const groups = groupDrinks(menu);
  const rows = groups.map((g, i) => [{ text: g.label, callback_data: `dg:${i}` }]);
  rows.push(backMainRow());
  return { inline_keyboard: rows };
}

export function drinksListKeyboard(menu, groupIndex, page) {
  const groups = groupDrinks(menu);
  const group = groups[groupIndex];
  if (!group) return drinksGroupsKeyboard(menu);
  const all = drinksNow(menu);
  const indices = group.items.map((item) => all.indexOf(item)).filter((i) => i >= 0);
  const total = Math.max(1, Math.ceil(indices.length / PAGE));
  const p = Math.min(Math.max(0, page), total - 1);
  const slice = indices.slice(p * PAGE, p * PAGE + PAGE);
  const rows = slice.map((idx) => {
    const d = all[idx];
    const price = d.priceFrom ?? d.volumes?.[0]?.price ?? 0;
    return [{ text: `${d.name} · от ${price} ₽`, callback_data: `pick:d:${idx}` }];
  });
  const nav = [];
  if (p > 0) nav.push({ text: "←", callback_data: `dp:${groupIndex}:${p - 1}` });
  if (p < total - 1) nav.push({ text: "→", callback_data: `dp:${groupIndex}:${p + 1}` });
  if (nav.length) rows.push(nav);
  rows.push([{ text: "← К разделам", callback_data: "nav:drinks" }]);
  return { inline_keyboard: rows };
}

export function volumeKeyboard(drinkIndex, volumes) {
  const rows = volumes.map((v) => [
    { text: `${v.ml} мл — ${v.price} ₽`, callback_data: `vol:${drinkIndex}:${v.ml}` },
  ]);
  rows.push([{ text: "← Назад", callback_data: "nav:drinks" }]);
  return { inline_keyboard: rows };
}

export function foodGroupsKeyboard(menu) {
  const groups = groupFood(menu);
  const rows = groups.map((g, i) => [{ text: g.label, callback_data: `fg:${i}` }]);
  rows.push(backMainRow());
  return { inline_keyboard: rows };
}

export function foodListKeyboard(menu, groupIndex, page) {
  const groups = groupFood(menu);
  const group = groups[groupIndex];
  if (!group) return foodGroupsKeyboard(menu);
  const all = preorderFood(menu);
  const indices = group.items.map((item) => all.indexOf(item)).filter((i) => i >= 0);
  const total = Math.max(1, Math.ceil(indices.length / PAGE));
  const p = Math.min(Math.max(0, page), total - 1);
  const slice = indices.slice(p * PAGE, p * PAGE + PAGE);
  const rows = slice.map((idx) => {
    const f = all[idx];
    return [{ text: `${f.name} · от ${f.priceFrom} ₽`, callback_data: `pick:f:${idx}` }];
  });
  const nav = [];
  if (p > 0) nav.push({ text: "←", callback_data: `fp:${groupIndex}:${p - 1}` });
  if (p < total - 1) nav.push({ text: "→", callback_data: `fp:${groupIndex}:${p + 1}` });
  if (nav.length) rows.push(nav);
  rows.push([{ text: "← К разделам", callback_data: "nav:food" }]);
  return { inline_keyboard: rows };
}

export function fillingKeyboard(menu) {
  const fillings = menu.meta?.sandwichFillings || ["Говядина", "Индейка", "Курица", "Рыба"];
  const rows = fillings.map((f, i) => [{ text: f, callback_data: `fill:${i}` }]);
  rows.push([{ text: "✏️ Другое (написать)", callback_data: "fill:other" }]);
  rows.push([{ text: "← Отмена", callback_data: "nav:main" }]);
  return { inline_keyboard: rows };
}

export function qtyKeyboard(prefix = "qty") {
  return {
    inline_keyboard: [
      [
        { text: "1", callback_data: `${prefix}:1` },
        { text: "2", callback_data: `${prefix}:2` },
        { text: "3", callback_data: `${prefix}:3` },
      ],
      [{ text: "← Отмена", callback_data: "nav:main" }],
    ],
  };
}

export function grillKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: "🔥 Да, на гриле", callback_data: "grill:1" },
        { text: "Без гриля", callback_data: "grill:0" },
      ],
      [{ text: "← Отмена", callback_data: "nav:main" }],
    ],
  };
}

export function microwaveKeyboard(prefix = "mw") {
  return {
    inline_keyboard: [
      [
        { text: "📻 Да, в микроволновке", callback_data: `${prefix}:1` },
        { text: "Не греть", callback_data: `${prefix}:0` },
      ],
      [{ text: "← Отмена", callback_data: "nav:main" }],
    ],
  };
}

/** Разогрев для горячих блюд */
export function hotHeatKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "🔥 На гриле", callback_data: "heat:grill" }],
      [{ text: "📻 В микроволновке", callback_data: "heat:micro" }],
      [{ text: "🔥+📻 Гриль и микроволновка", callback_data: "heat:both" }],
      [{ text: "❄️ Без разогрева", callback_data: "heat:none" }],
      [{ text: "← Отмена", callback_data: "nav:main" }],
    ],
  };
}

export function sandwichMoreKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "➕ Ещё один сэндвич", callback_data: "smore:1" }],
      [{ text: "Готово", callback_data: "smore:0" }],
    ],
  };
}

export function welcomeTypeText() {
  return (
    "CoffeeFriends\n\n" +
    "Выберите тип:\n\n" +
    "☕ <b>Заказ сейчас</b> — напитки, сэндвичи, горячее и др., забрать через 5–10 минут.\n\n" +
    "📅 <b>Предзаказ на дату</b> — еда и сладкое на завтра или другую дату (без напитков)."
  );
}

export function askFloorText(session) {
  return `${orderTypeLabel(session.orderType)}\n\nВыберите этаж, где заберёте заказ:`;
}

export function askNameText(session, suggested) {
  return (
    `${orderTypeLabel(session.orderType)} · ${session.floor ? floorLabel(session.floor) : ""}\n\n` +
    "Как к вам обращаться? (имя или ник для стойки)\n\n" +
    (suggested ? `Можно нажать кнопку «${suggested}» или написать своё.` : "Напишите имя одним сообщением.")
  );
}

export function askDateText() {
  return "На какую дату предзаказ?\n\nВыберите кнопку или напишите дату текстом (например: 20.05).";
}

export function mainMenuText(session) {
  const lines = [
    orderTypeLabel(session.orderType),
    `Этаж: ${floorLabel(session.floor)}`,
    `Имя: ${session.customerName}`,
  ];
  if (session.orderType === "preorder" && session.pickupDate) {
    lines.push(`Дата: ${session.pickupDate}`);
  }
  lines.push("", "Добавьте позиции и отправьте заказ.");
  if (session.cart.length) {
    lines.push("", formatCartLines(session.cart));
    lines.push("", orderTotalLine(session.cart));
  }
  if (session.comment) lines.push("", `💬 ${session.comment}`);
  return lines.join("\n");
}

export function cartText(session) {
  const head =
    `${orderTypeLabel(session.orderType)} · ${floorLabel(session.floor)}\n` +
    `Имя: ${session.customerName}\n\n`;
  if (!session.cart.length) {
    return head + "Корзина пуста. Добавьте позиции из меню (напитки или еда).";
  }
  return (
    head +
    formatCartLines(session.cart) +
    `\n\n${orderTotalLine(session.cart)}` +
    (session.comment ? `\n\n💬 ${session.comment}` : "")
  );
}

export function commentPrompt() {
  return "Напишите комментарий одним сообщением.\n\nОтмена: /cancel";
}
