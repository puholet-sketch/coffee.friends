# Target banner — все макеты CoffeeFriends

**Корень проекта:** `D:\projects\COFEPOINT` (не `E:\projects`).

| Папка | Содержимое |
|-------|------------|
| `source/` | Исходники **без** рабочего QR (для `npm run banner:print*`) |
| `print/` | Печатные выгрузки (в т.ч. 600×1600 mm @ 150 dpi) |
| `site-qr/` | QR на сайт (`site-qr.png`, `site-qr-light.png`) |
| `icc/` | Профили печати (Coated FOGRA39) |
| `docs/` | Тексты и инструкции к макетам |
| `archive/` | Готовые мастера с QR, A5, варианты тонов, старые файлы |

Скрипты: `tg/` → `npm run qr:site`, `banner:print`, `banner:print:light`, `banner:print:light-marketing`.

Старый путь `assets/images/banner/` не используется — см. `README.txt` там.
