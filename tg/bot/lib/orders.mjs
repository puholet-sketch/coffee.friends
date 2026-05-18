import { formatOrderMessage } from "./format.mjs";
import { registerOrder } from "./order-registry.mjs";
import { cartTotal } from "./menu-data.mjs";

export async function postOrderToGroup(api, config, order) {
  const topicKey = order.floor === 11 ? "floor_11" : "floor_2";
  const threadId = config.topics[topicKey];
  const text = formatOrderMessage({
    orderType: order.orderType,
    floor: order.floor,
    cart: order.cart,
    comment: order.comment,
    customerName: order.customerName,
    pickupDate: order.pickupDate,
    from: order.from,
  });
  const body = {
    chat_id: config.group_chat_id,
    text,
  };
  if (threadId != null) body.message_thread_id = threadId;

  const sent = await api.sendMessage(body);

  if (order.customerChatId && sent?.message_id) {
    const summary = order.cart
      .slice(0, 2)
      .map((i) => i.name)
      .join("; ");
    const more = order.cart.length > 2 ? ` (+${order.cart.length - 2})` : "";
    registerOrder({
      groupChatId: config.group_chat_id,
      messageId: sent.message_id,
      threadId: threadId ?? null,
      customerChatId: order.customerChatId,
      customerName: order.customerName,
      orderType: order.orderType,
      floor: order.floor,
      pickupDate: order.pickupDate || "",
      summary: `${summary}${more} · ${cartTotal(order.cart)} ₽`,
    });
  }

  return sent;
}
