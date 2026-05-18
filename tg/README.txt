Настройки Telegram для CoffeeFriends

1) Токен бота
   Файл: tg/token/token.txt (одна строка — ключ от BotFather)
   В GitHub не попадает — см. .gitignore

2) Публичные номера (из ссылок на темы)
   ID группы:     -1003739763407
   Тема Общая:    без номера (null) — сообщение без message_thread_id
   Тема 2 этаж:   3
   Тема 11 этаж:  4

3) Локальная копия настроек (без токена)
   Скопируйте config.example.json → config.json и при необходимости поправьте.

4) Проверка отправки (все темы)
   node tg/scripts/send-test-all.mjs
   Одна тема:
     node tg/scripts/send-test-all.mjs general
     node tg/scripts/send-test-all.mjs floor_11
     node tg/scripts/send-test-all.mjs floor_2

   Старый скрипт только для 2 этажа: node tg/scripts/send-test.mjs
   Если ошибка сети — VPN (api.telegram.org).
