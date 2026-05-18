export function createTelegramApi(token) {
  const base = `https://api.telegram.org/bot${token}/`;

  async function call(method, body = {}) {
    const res = await fetch(base + method, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!data.ok) {
      const err = new Error(data.description || "Telegram API error");
      err.telegram = data;
      throw err;
    }
    return data.result;
  }

  return {
    call,
    sendMessage: (body) => call("sendMessage", body),
    editMessageText: (body) => call("editMessageText", body),
    editMessageReplyMarkup: (body) => call("editMessageReplyMarkup", body),
    answerCallbackQuery: (body) => call("answerCallbackQuery", body),
    setMyCommands: (commands) => call("setMyCommands", { commands }),
    getUpdates: (params) => call("getUpdates", params),
  };
}
