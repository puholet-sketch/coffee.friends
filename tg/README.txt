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

5) Обновить меню из Excel
   python tools/import_catalog.py

6) Статусы для клиента
   Бариста отвечает в группе «ответом» на сообщение заказа от бота
   (в теме этажа или в Общей): «в работе», «готово», «отменено» или свой текст.
   Клиент получает уведомление в личку бота (нужен был /start у бота).

7) Бот с меню и заказами
   cd tg
   npm install
   npm start
   (компьютер + VPN, пока бот не на сервере)

7) Почта: ошибки бота и пожелания (/feedback)
   Скопируйте tg/.env.example → tg/.env
   SMTP_USER=coffee.friends@yandex.ru
   SMTP_PASS=пароль приложения (Яндекс → Безопасность → Пароли приложений)
   Без .env пожелания сохраняются только в лог консоли.

8) QR для сайта
   cd tg && npm run qr
