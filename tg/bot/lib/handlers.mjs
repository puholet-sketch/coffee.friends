import { getSession, resetSession, clearDraft } from "./session.mjs";
import { postOrderToGroup } from "./orders.mjs";
import { findOrderByReply } from "./order-registry.mjs";
import { formatCustomerStatusMessage } from "./status-notify.mjs";
import {
  drinkByIndex,
  foodByIndex,
  volumeOptions,
  cartTotal,
  formatRub,
  orderSumLine,
} from "./menu-data.mjs";
import { formatCartLines } from "./format.mjs";
import { createCartItem } from "./cart-line.mjs";
import {
  orderTypeKeyboard,
  floorKeyboard,
  nameKeyboard,
  preorderDateKeyboard,
  mainKeyboard,
  cartKeyboard,
  drinksGroupsKeyboard,
  drinksListKeyboard,
  volumeKeyboard,
  foodGroupsKeyboard,
  foodListKeyboard,
  fillingKeyboard,
  qtyKeyboard,
  grillKeyboard,
  hotHeatKeyboard,
  sandwichMoreKeyboard,
  feedbackKeyboard,
  welcomeTypeText,
  askFloorText,
  askNameText,
  askDateText,
  mainMenuText,
  cartText,
  commentPrompt,
  floorLabel,
  EMPTY_CART_ALERT,
} from "./ui.mjs";
import {
  sendBotReport,
  FEEDBACK_PROMPT,
  feedbackThanksText,
} from "./mail-report.mjs";

function tomorrowLabel(offset = 1) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

function heatFromMode(mode) {
  if (mode === "grill") return { grill: true, microwave: false };
  if (mode === "micro") return { grill: false, microwave: true };
  if (mode === "both") return { grill: true, microwave: true };
  return { grill: false, microwave: false };
}

export function createHandlers(api, menu, config) {
  async function reply(chatId, text, extra = {}) {
    return api.sendMessage({ chat_id: chatId, text, parse_mode: "HTML", ...extra });
  }

  async function edit(chatId, messageId, text, reply_markup) {
    try {
      await api.editMessageText({
        chat_id: chatId,
        message_id: messageId,
        text,
        parse_mode: "HTML",
        reply_markup,
      });
    } catch (e) {
      if (!String(e.message || "").includes("not modified")) {
        await reply(chatId, text, { reply_markup });
      }
    }
  }

  function userFrom(ctx) {
    return ctx.from || {};
  }

  function suggestedName(from) {
    if (from.first_name) return from.first_name;
    if (from.username) return "@" + from.username;
    return "";
  }

  async function showScreen(chatId, messageId, text, markup) {
    if (messageId) await edit(chatId, messageId, text, markup);
    else await reply(chatId, text, { reply_markup: markup });
  }

  async function showType(chatId, messageId = null) {
    await showScreen(chatId, messageId, welcomeTypeText(), orderTypeKeyboard());
  }

  async function showFloor(chatId, messageId, session) {
    await showScreen(chatId, messageId, askFloorText(session), floorKeyboard());
  }

  async function showName(chatId, messageId, session, from) {
    await showScreen(
      chatId,
      messageId,
      askNameText(session, suggestedName(from)),
      nameKeyboard(suggestedName(from)),
    );
  }

  async function showDate(chatId, messageId) {
    await showScreen(chatId, messageId, askDateText(), preorderDateKeyboard());
  }

  async function showMain(chatId, messageId, session) {
    await showScreen(chatId, messageId, mainMenuText(session), mainKeyboard(session));
  }

  function feedbackBackNav(session) {
    if (session.orderType && session.floor && session.customerName) return "nav:main";
    if (session.orderType) return "nav:type";
    return "nav:type";
  }

  async function beginFeedback(chatId, messageId, session) {
    session.step = "feedback";
    await showScreen(chatId, messageId, FEEDBACK_PROMPT, feedbackKeyboard(feedbackBackNav(session)));
  }

  async function submitFeedback(chatId, from, session, text) {
    const body = text.slice(0, 4000);
    const sent = await sendBotReport({
      kind: "feedback",
      config,
      from,
      chatId,
      text: body,
    });
    session.step = "idle";
    await reply(chatId, feedbackThanksText(sent));
    if (session.orderType && session.floor && session.customerName) {
      await showMain(chatId, null, session);
    } else if (session.orderType) {
      await showType(chatId);
    }
  }

  function pushCartItem(session, name, price, heating) {
    session.cart.push(createCartItem(name, price, heating));
  }

  function finalizeSandwich(session) {
    const d = session.draft;
    if (!d?.sandwich) return;
    const s = d.sandwich;
    const name = `${s.foodName} ×${s.qty} — ${s.filling}`;
    const price = (s.unitPrice || 0) * s.qty;
    pushCartItem(session, name, price, { grill: s.grill });
  }

  async function submitOrder(chatId, from) {
    const session = getSession(chatId);
    if (!session.orderType || !session.floor) {
      await reply(chatId, "Начните с /start");
      return;
    }
    if (!session.customerName) {
      await reply(chatId, "Укажите имя: /start");
      return;
    }
    if (session.orderType === "preorder" && !session.pickupDate) {
      await reply(chatId, "Укажите дату предзаказа: /start");
      return;
    }
    if (!session.cart.length) {
      await reply(chatId, "Заказ пустой. Добавьте позиции.");
      return;
    }

    await postOrderToGroup(api, config, {
      orderType: session.orderType,
      floor: session.floor,
      cart: session.cart,
      comment: session.comment,
      customerName: session.customerName,
      pickupDate: session.pickupDate,
      from,
      customerChatId: chatId,
    });

    const sumLine = orderSumLine(session.cart);
    const fl = floorLabel(session.floor);
    resetSession(chatId);
    await reply(
      chatId,
      `✅ <b>Отправлено бариста</b>\n\n${sumLine}\n\nЖдём вас на ${fl}.\n\nКогда бариста <b>ответит на заказ в группе</b> (ответом на сообщение бота — «в работе», «готово», «отменено»), вам придёт уведомление сюда.\n\nНовый заказ: /start`,
    );
  }

  async function handleGroupMessage(msg) {
    if (msg.chat?.id !== config.group_chat_id) return;
    const replyTo = msg.reply_to_message;
    if (!replyTo?.message_id) return;
    if (msg.from?.is_bot) return;

    const text = (msg.text || msg.caption || "").trim();
    if (!text) return;

    const order = findOrderByReply(config.group_chat_id, replyTo.message_id);
    if (!order) return;

    const barista =
      [msg.from.first_name, msg.from.last_name].filter(Boolean).join(" ") ||
      (msg.from.username ? "@" + msg.from.username : "Бариста");

    try {
      await api.sendMessage({
        chat_id: order.customerChatId,
        text: formatCustomerStatusMessage(order, text, barista),
        parse_mode: "HTML",
      });
    } catch (err) {
      console.error("notify customer:", err.message);
    }
  }

  async function handleCallback(cb) {
    const chatId = cb.message.chat.id;
    const messageId = cb.message.message_id;
    const data = cb.data || "";
    const session = getSession(chatId);
    const from = userFrom(cb);

    const ack = (opts) =>
      api.answerCallbackQuery({ callback_query_id: cb.id, ...opts }).catch(() => {});

    if (data === "type:now") {
      session.orderType = "now";
      await ack();
      await showFloor(chatId, messageId, session);
      return;
    }
    if (data === "type:pre") {
      session.orderType = "preorder";
      await ack();
      await showFloor(chatId, messageId, session);
      return;
    }

    if (data.startsWith("floor:")) {
      session.floor = parseInt(data.split(":")[1], 10);
      session.step = "name";
      await ack({ text: floorLabel(session.floor) });
      await showName(chatId, messageId, session, from);
      return;
    }

    if (data === "name:use") {
      session.customerName = suggestedName(from) || "Гость";
      await ack();
      if (session.orderType === "preorder") await showDate(chatId, messageId);
      else await showMain(chatId, messageId, session);
      return;
    }

    if (data === "date:tomorrow") {
      session.pickupDate = "Завтра, " + tomorrowLabel(1);
      await ack();
      await showMain(chatId, messageId, session);
      return;
    }
    if (data === "date:dayafter") {
      session.pickupDate = "Послезавтра, " + tomorrowLabel(2);
      await ack();
      await showMain(chatId, messageId, session);
      return;
    }
    if (data === "date:custom") {
      session.step = "preorder_date";
      await ack();
      await edit(chatId, messageId, askDateText() + "\n\nНапишите дату сообщением.", {
        inline_keyboard: [[{ text: "← Назад", callback_data: "nav:main" }]],
      });
      return;
    }

    if (data === "nav:type") {
      clearDraft(session);
      session.step = "idle";
      await ack();
      await showType(chatId, messageId);
      return;
    }
    if (data === "nav:floor") {
      await ack();
      await showFloor(chatId, messageId, session);
      return;
    }
    if (data === "nav:name") {
      await ack();
      await showName(chatId, messageId, session, from);
      return;
    }
    if (data === "nav:main") {
      clearDraft(session);
      session.step = "idle";
      await ack();
      await showMain(chatId, messageId, session);
      return;
    }
    if (data === "nav:drinks") {
      await ack();
      await edit(chatId, messageId, "Выберите раздел напитков:", drinksGroupsKeyboard(menu));
      return;
    }
    if (data === "nav:food") {
      await ack();
      await edit(chatId, messageId, "Выберите раздел меню:", foodGroupsKeyboard(menu));
      return;
    }
    if (data === "nav:cart") {
      await ack();
      await edit(chatId, messageId, cartText(session), cartKeyboard(session));
      return;
    }
    if (data === "nav:feedback") {
      await ack();
      await beginFeedback(chatId, messageId, session);
      return;
    }

    if (data === "nav:comment") {
      session.step = "comment";
      await ack();
      await edit(chatId, messageId, commentPrompt(), {
        inline_keyboard: [[{ text: "← В меню", callback_data: "nav:main" }]],
      });
      return;
    }

    if (data.startsWith("dg:")) {
      const gi = parseInt(data.split(":")[1], 10);
      session.ui.drinksGroup = gi;
      session.ui.drinksPage = 0;
      await ack();
      await edit(chatId, messageId, "Выберите напиток:", drinksListKeyboard(menu, gi, 0));
      return;
    }
    if (data.startsWith("dp:")) {
      const [, gi, pg] = data.split(":").map(Number);
      await ack();
      await edit(chatId, messageId, "Выберите напиток:", drinksListKeyboard(menu, gi, pg));
      return;
    }

    if (data.startsWith("fg:")) {
      const gi = parseInt(data.split(":")[1], 10);
      session.ui.foodGroup = gi;
      session.ui.foodPage = 0;
      await ack();
      await edit(chatId, messageId, "Выберите позицию:", foodListKeyboard(menu, gi, 0));
      return;
    }
    if (data.startsWith("fp:")) {
      const [, gi, pg] = data.split(":").map(Number);
      await ack();
      await edit(chatId, messageId, "Выберите позицию:", foodListKeyboard(menu, gi, pg));
      return;
    }

    if (data.startsWith("pick:d:")) {
      const idx = parseInt(data.split(":")[2], 10);
      const drink = drinkByIndex(menu, idx);
      if (!drink) return;
      const vols = volumeOptions(drink);
      if (!vols) {
        pushCartItem(session, drink.name, drink.priceFrom);
        await ack({ text: "Добавлено" });
        await showMain(chatId, messageId, session);
        return;
      }
      session.draft = { kind: "drink", drinkIdx: idx };
      await ack();
      await edit(
        chatId,
        messageId,
        `<b>${drink.name}</b>\n\nВыберите объём:`,
        volumeKeyboard(idx, vols),
      );
      return;
    }

    if (data.startsWith("vol:")) {
      const [, idx, ml] = data.split(":");
      const drink = drinkByIndex(menu, parseInt(idx, 10));
      const vol = drink?.volumes?.find((v) => String(v.ml) === ml);
      if (!drink || !vol) return;
      pushCartItem(session, `${drink.name}, ${vol.ml} мл`, vol.price);
      clearDraft(session);
      await ack({ text: "Добавлено" });
      await showMain(chatId, messageId, session);
      return;
    }

    if (data.startsWith("pick:f:")) {
      const idx = parseInt(data.split(":")[2], 10);
      const food = foodByIndex(menu, idx);
      if (!food) return;
      if (food.kind === "sandwich") {
        session.draft = {
          kind: "sandwich",
          foodIdx: idx,
          foodName: food.name,
          unitPrice: food.priceFrom,
          sandwich: null,
        };
        await ack();
        await edit(
          chatId,
          messageId,
          `<b>${food.name}</b>\n\nС чем сэндвич?`,
          fillingKeyboard(menu),
        );
        return;
      }
      if (food.kind === "hot") {
        session.draft = { kind: "hot", foodIdx: idx, foodName: food.name, unitPrice: food.priceFrom };
        session.step = "hot_text";
        await ack();
        await edit(chatId, messageId, `<b>${food.name}</b>\n\nНапишите одним сообщением, какое блюдо нужно:`, {
          inline_keyboard: [[{ text: "← Отмена", callback_data: "nav:main" }]],
        });
        return;
      }
      session.draft = {
        kind: "simple",
        foodIdx: idx,
        foodName: food.name,
        unitPrice: food.priceFrom,
        foodGroup: food.group,
      };
      await ack();
      await edit(chatId, messageId, `<b>${food.name}</b>\n\nСколько порций?`, qtyKeyboard("fq"));
      return;
    }

    if (data.startsWith("fill:")) {
      const part = data.split(":")[1];
      if (part === "other") {
        session.step = "sandwich_filling";
        await ack();
        await edit(chatId, messageId, "Напишите начинку (с чем сэндвич):", {
          inline_keyboard: [[{ text: "← Отмена", callback_data: "nav:main" }]],
        });
        return;
      }
      const fillings = menu.meta?.sandwichFillings || [];
      const filling = fillings[parseInt(part, 10)] || "—";
      session.draft.sandwich = {
        foodName: session.draft.foodName,
        unitPrice: session.draft.unitPrice,
        filling,
        qty: 1,
        grill: false,
      };
      await ack();
      await edit(chatId, messageId, "Сколько порций?", qtyKeyboard("qty"));
      return;
    }

    if (data.startsWith("qty:")) {
      const q = parseInt(data.split(":")[1], 10);
      if (!session.draft?.sandwich) return;
      session.draft.sandwich.qty = q;
      await ack();
      await edit(chatId, messageId, "Погреть на гриле?", grillKeyboard());
      return;
    }

    if (data.startsWith("fq:")) {
      const q = parseInt(data.split(":")[1], 10);
      const d = session.draft;
      if (!d || d.kind !== "simple") return;
      d.simpleQty = q;
      pushCartItem(session, `${d.foodName} ×${q}`, d.unitPrice * q, {});
      clearDraft(session);
      await ack({ text: "Добавлено" });
      await showMain(chatId, messageId, session);
      return;
    }

    if (data.startsWith("grill:")) {
      if (!session.draft?.sandwich) return;
      session.draft.sandwich.grill = data.split(":")[1] === "1";
      await ack();
      await edit(chatId, messageId, "Добавить ещё один сэндвич?", sandwichMoreKeyboard());
      return;
    }

    if (data.startsWith("heat:")) {
      const d = session.draft;
      if (!d || d.kind !== "hot" || !d.hotName) return;
      const mode = data.split(":")[1];
      const heating = heatFromMode(mode);
      pushCartItem(session, d.hotName, d.unitPrice, heating);
      clearDraft(session);
      await ack({ text: "Добавлено" });
      await showMain(chatId, messageId, session);
      return;
    }

    if (data.startsWith("smore:")) {
      if (data.split(":")[1] === "1") {
        finalizeSandwich(session);
        session.draft.sandwich = null;
        await ack();
        await edit(chatId, messageId, `<b>${session.draft.foodName}</b>\n\nС чем следующий?`, fillingKeyboard(menu));
        return;
      }
      finalizeSandwich(session);
      clearDraft(session);
      await ack({ text: "Добавлено" });
      await showMain(chatId, messageId, session);
      return;
    }

    if (data === "cart:clear") {
      session.cart = [];
      session.comment = "";
      await ack();
      await edit(chatId, messageId, cartText(session), cartKeyboard(session));
      return;
    }

    if (data === "cart:submit") {
      if (!session.cart.length) {
        await ack({ text: EMPTY_CART_ALERT, show_alert: true });
        return;
      }
      await ack();
      await submitOrder(chatId, from);
      return;
    }

    await ack();
  }

  async function handleMessage(msg) {
    if (msg.chat?.type !== "private") {
      await handleGroupMessage(msg);
      return;
    }

    const chatId = msg.chat.id;
    const text = (msg.text || "").trim();
    const session = getSession(chatId);
    const from = userFrom(msg);

    if (text === "/cancel") {
      if (session.step === "feedback") {
        session.step = "idle";
        if (session.orderType && session.floor && session.customerName) {
          await showMain(chatId, null, session);
        } else {
          await showType(chatId);
        }
        return;
      }
      resetSession(chatId);
      await reply(chatId, "Сброшено. /start — заново.");
      return;
    }

    if (text === "/feedback") {
      await beginFeedback(chatId, null, session);
      return;
    }

    if (session.step === "feedback" && text && !text.startsWith("/")) {
      await submitFeedback(chatId, from, session, text);
      return;
    }

    if (text === "/start") {
      resetSession(chatId);
      await showType(chatId);
      return;
    }

    if (text === "/menu" || text === "/cart") {
      if (!session.orderType) {
        await showType(chatId);
        return;
      }
      if (text === "/cart") {
        await reply(chatId, cartText(session), { reply_markup: cartKeyboard(session) });
        return;
      }
      if (session.floor && session.customerName) {
        await showMain(chatId, null, session);
        return;
      }
      await showType(chatId);
      return;
    }

    if (session.step === "comment" && text && !text.startsWith("/")) {
      session.comment = text.slice(0, 500);
      session.step = "idle";
      await reply(chatId, "Комментарий сохранён.\n\n" + cartText(session), { reply_markup: cartKeyboard(session) });
      return;
    }

    if (session.step === "preorder_date" && text && !text.startsWith("/")) {
      session.pickupDate = text.slice(0, 80);
      session.step = "idle";
      await showMain(chatId, null, session);
      return;
    }

    if (session.step === "name" || (!session.customerName && session.floor && text && !text.startsWith("/"))) {
      session.customerName = text.slice(0, 80);
      session.step = "idle";
      if (session.orderType === "preorder" && !session.pickupDate) {
        await showDate(chatId, null);
        return;
      }
      await showMain(chatId, null, session);
      return;
    }

    if (session.step === "sandwich_filling" && text && !text.startsWith("/")) {
      session.draft.sandwich = {
        foodName: session.draft.foodName,
        unitPrice: session.draft.unitPrice,
        filling: text.slice(0, 120),
        qty: 1,
        grill: false,
      };
      session.step = "idle";
      await reply(chatId, "Сколько порций?", { reply_markup: qtyKeyboard("qty") });
      return;
    }

    if (session.step === "hot_text" && text && !text.startsWith("/")) {
      const d = session.draft;
      d.hotName = `${d.foodName}: ${text.slice(0, 200)}`;
      session.step = "idle";
      await reply(chatId, `<b>${d.hotName}</b>\n\nКак разогреть?`, {
        reply_markup: hotHeatKeyboard(),
      });
      return;
    }

    if (!session.orderType) {
      await reply(chatId, "Нажмите /start");
      return;
    }

    await reply(chatId, "Используйте кнопки под сообщением или /menu.");
  }

  return { handleCallback, handleMessage, handleGroupMessage, showType };
}
