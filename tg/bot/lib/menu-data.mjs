export function drinksNow(menu) {
  return menu.drinksNow || menu.drinks || [];
}

export function preorderFood(menu) {
  return menu.preorderFood || menu.categories || [];
}

export function cartTotal(cart) {
  return cart.reduce((sum, line) => sum + (Number(line.price) || 0), 0);
}

export function formatRub(n) {
  return `~${n} ₽`;
}

/** Итог для коротких сообщений пользователю */
export function orderSumLine(cart) {
  if (!cart?.length) return "";
  return `Стоимость заказа ~ ${cartTotal(cart)} ₽`;
}

export function drinkByIndex(menu, index) {
  return drinksNow(menu)[index] ?? null;
}

export function foodByIndex(menu, index) {
  return preorderFood(menu)[index] ?? null;
}

/** Доступные объёмы для напитка */
export function volumeOptions(drink) {
  if (!drink?.volumes?.length) return null;
  return drink.volumes;
}

export function groupDrinks(menu) {
  const labels = {
    coffee: "Кофе",
    tea: "Чай",
    cold_coffee: "Холодный кофе",
    lemonade: "Лимонады",
    seasonal: "Сезонные",
  };
  const groups = new Map();
  for (const d of drinksNow(menu)) {
    const key = d.group || "other";
    if (!groups.has(key)) groups.set(key, { key, label: labels[key] || d.groupLabel || key, items: [] });
    groups.get(key).items.push(d);
  }
  return [...groups.values()];
}

export function groupFood(menu) {
  const labels = {
    sandwich: "Сэндвичи",
    hot: "Горячее и завтраки",
    pastry: "Сладкое",
    food: "Еда",
    other: "Прочее",
  };
  const groups = new Map();
  for (const f of preorderFood(menu)) {
    const key = f.kind || f.group || "other";
    if (!groups.has(key)) groups.set(key, { key, label: labels[key] || f.groupLabel || key, items: [] });
    groups.get(key).items.push(f);
  }
  return [...groups.values()];
}
