# Развёртывание бота CoffeeFriends на Oracle Cloud Always Free (Ubuntu)

**Проект:** `D:\projects\COFEPOINT`  
**Бот:** `@coffeefriends_orders_bot` (long polling, без webhook).

Полная пошаговая инструкция — см. историю задачи в чате; краткий чеклист:

1. Oracle Cloud Free → Ubuntu VM, SSH-ключ, Security List порт 22.
2. Node.js 20, `git clone` репозитория в `~/COFEPOINT`.
3. `tg/token/token.txt`, `tg/config.json`, `tg/.env` (SMTP Яндекс).
4. `cd tg && npm install && npm start` — тест.
5. `systemd` unit `coffeefriends-bot.service` → `enable` + `start`.
6. На ПК не запускать второй `npm start` с тем же токеном.

Меню бота читает `assets/data/menu.json` относительно корня репозитория.

---

## Если Oracle недоступен (карта / регион)

См. **[free-no-card.md](./free-no-card.md)** — бесплатно без карты:

- **Рекомендуется:** [termux-android.md](./termux-android.md) (старый Android + Termux).
- VPS в РФ ~200 ₽/мес — те же шаги systemd, что ниже.
