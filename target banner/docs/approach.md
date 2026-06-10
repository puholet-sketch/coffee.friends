# Баннер-инфографика CoffeeFriends

Подход: **одна горизонтальная сцена слева направо** — путь читается без длинного текста.

## Визуальный язык

- **Персонаж:** схематичный дружелюбный человечек; при желании — облачко-мысль с короткой фразой («Кофейку?»).
- **Маршрут:** лифт → явные подписи этажей (**2 этаж** / **11 этаж**) → неоновая вывеска **КОФЕ** + силуэт стакана (неон — главный цветовой акцент на тёмном или приглушённом фоне).
- **Смысл бренда:** человечек + кофе → **CoffeeFriends** (знак равенства, «плюс», рукопожатие или сердечко — на усмотрение макета).
- **Низ баннера:** блок «детали» — сайт (**www.cf.ru** или актуальный URL), место под **рабочий QR** (генерировать отдельно; декоративный QR с ИИ не сканируется).
- **Игривая строка** (под QR или рядом): короткая фраза про напитки — лёгкий шрифт, не конкурирует с этажами и неоном.

## Технические ориентиры

- Формат: горизонталь, например **1920×1080** или **1200×800**.
- Типографика: жирные чёткие цифры/этажи; облачко и «фраза дня» — мягче/игривее.

## Где лежат файлы

**Корень:** `D:\projects\COFEPOINT\target banner\` (см. `target banner/README.md`).

| Путь | Назначение |
|------|------------|
| `target banner/archive/coffee-friends-banner-infographic.png` | Горизонтальный баннер (OG на сайте) |
| `target banner/archive/coffee-friends-banner-vertical.png` | Вертикальный мастер v7 + QR |
| `target banner/print/coffee-friends-banner-vertical-print.png` | v7 для печати 3072×2048 |
| `target banner/source/coffee-friends-banner-vertical-source-v7.png` | v7 без QR |
| `target banner/source/coffee-friends-banner-vertical-light-v7-source.png` | Светлый v7 без QR |
| `target banner/archive/coffee-friends-banner-vertical-light-marketing.png` | Маркетинговый светлый (мастер) |
| `target banner/source/coffee-friends-banner-vertical-light-marketing-source.png` | Маркетинг без QR → `npm run banner:print:light-marketing` |
| `target banner/site-qr/site-qr.png` | QR сайт (тёмный фон) |
| `target banner/site-qr/site-qr-light.png` | QR для светлых баннеров |
| `target banner/archive/coffee-friends-order-a5.png` | A5 Telegram |
| `target banner/docs/` | Тексты; `print-light-marketing.md` — 600×1600 mm |
| `docs/banner/approach.md` | Копия этого документа в репозитории |

При смене макета обновите файлы в `target banner/` и при необходимости `index.html`.
