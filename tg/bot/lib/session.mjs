const sessions = new Map();

export function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, emptySession());
  }
  return sessions.get(chatId);
}

export function emptySession() {
  return {
    orderType: null,
    floor: null,
    customerName: "",
    pickupDate: "",
    cart: [],
    comment: "",
    step: "idle",
    draft: null,
    ui: { drinksGroup: 0, drinksPage: 0, foodGroup: 0, foodPage: 0 },
  };
}

export function resetSession(chatId) {
  sessions.set(chatId, emptySession());
  return sessions.get(chatId);
}

export function clearDraft(session) {
  session.draft = null;
  session.step = "idle";
}
