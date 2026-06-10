# CoffeeFriends бот на Android (Termux) — бесплатно, без карты

Мини‑сервер из **старого телефона**: бот работает, пока телефон в сети и на питании.

**Корень проекта на ПК:** `D:\projects\COFEPOINT`

---

## Что нужно

- Android 7+ (лучше 9+)
- Wi‑Fi (SIM не обязательна)
- Зарядка постоянно
- ~500 MB свободного места
- Токен бота, `config.json`, при желании `.env` для почты

---

## 1. Установка Termux

1. Установите **[F-Droid](https://f-droid.org/)**, затем **Termux** отсюда:  
   https://f-droid.org/packages/com.termux/  
   *(В Google Play Termux устарел — не используйте.)*
2. По желанию: **Termux:Boot** (автозапуск) — https://f-droid.org/packages/com.termux.boot/

---

## 2. Батарея и фон

На телефоне:

- **Настройки → Приложения → Termux → Батарея** → «Не оптимизировать» / «Без ограничений».
- Wi‑Fi → «Не отключать в режиме сна» (если есть такая опция).

---

## 3. Пакеты в Termux

Откройте Termux:

```bash
pkg update && pkg upgrade -y
pkg install -y git nodejs-lts openssh
node -v    # v20+ или v22
npm -v
```

Проверка Telegram:

```bash
curl -sI https://api.telegram.org | head -3
```

Если таймаут — другая сеть или VPN (на телефоне).

---

## 4. Код проекта

### Вариант A — git (если репозиторий публичный)

```bash
cd ~
git clone https://github.com/puholet-sketch/coffee.friends.git COFEPOINT
cd COFEPOINT/tg
```

### Вариант B — с ПК по USB / облаку

Скопируйте на телефон (через USB, Telegram «Избранное», Google Drive):

- папку `tg/` целиком
- файл `assets/data/menu.json` → путь `~/COFEPOINT/assets/data/menu.json`

Структура:

```text
~/COFEPOINT/
  assets/data/menu.json
  tg/
    bot/
    package.json
    config.json
    token/token.txt
    .env
```

---

## 5. Секреты

```bash
mkdir -p ~/COFEPOINT/tg/token
nano ~/COFEPOINT/tg/token/token.txt
```

Одна строка — токен от @BotFather.

```bash
cp ~/COFEPOINT/tg/config.example.json ~/COFEPOINT/tg/config.json
nano ~/COFEPOINT/tg/config.json
```

Почта (опционально):

```bash
cp ~/COFEPOINT/tg/.env.example ~/COFEPOINT/tg/.env
nano ~/COFEPOINT/tg/.env
```

---

## 6. Запуск

```bash
cd ~/COFEPOINT/tg
npm install
npm start
```

В Telegram: `/start`, пробный заказ.  
**На ПК в это время не запускайте** второй `npm start`.

Остановка в Termux: `Ctrl+C`.

---

## 7. Фоновый режим (пока Termux открыт)

```bash
cd ~/COFEPOINT/tg
nohup npm start >> ~/bot.log 2>&1 &
```

Лог:

```bash
tail -f ~/bot.log
```

Остановить:

```bash
pkill -f "node bot/index.mjs"
```

---

## 8. Автозапуск после перезагрузки (Termux:Boot)

1. Установите **Termux:Boot** из F-Droid.
2. В Termux:

```bash
mkdir -p ~/.termux/boot
nano ~/.termux/boot/coffeefriends-bot.sh
```

Содержимое:

```bash
#!/data/data/com.termux/files/usr/bin/bash
sleep 30
cd /data/data/com.termux/files/home/COFEPOINT/tg || exit 1
nohup npm start >> /data/data/com.termux/files/home/bot.log 2>&1 &
```

```bash
chmod +x ~/.termux/boot/coffeefriends-bot.sh
```

3. Перезагрузите телефон → через ~1 мин проверьте бота.

*(Путь `home` — стандарт для Termux; если проект в другом каталоге — поправьте.)*

---

## 9. Обновление меню

С ПК залить новый `menu.json` в `~/COFEPOINT/assets/data/` → в Termux:

```bash
pkill -f "node bot/index.mjs"
cd ~/COFEPOINT/tg && nohup npm start >> ~/bot.log 2>&1 &
```

---

## 10. Частые проблемы

| Симптом | Решение |
|---------|---------|
| Бот молчит | `tail ~/bot.log`; проверьте Wi‑Fi; не запущен ли бот на ПК |
| Termux убит системой | Отключить оптимизацию батареи для Termux |
| `Нет tg/token/token.txt` | создать файл с токеном |
| После reboot не стартует | Termux:Boot установлен? скрипт `chmod +x`? |
| Почта не уходит | `.env`, пароль приложения Яндекс |

---

## Альтернатива

Если телефона нет — единственный устойчивый бесплатный облачный путь **без карты** — перенос бота на **webhook + Cloudflare Workers** (отдельная разработка). См. `free-no-card.md`.
