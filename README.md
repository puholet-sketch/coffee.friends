# CoffeeFriends — статическая визитка

Репозиторий: **github.com/puholet-sketch/coffee.friends**. Корень деплоя — эта папка: **`index.html`** в корне, пути латиницей.

## Структура

| Путь | Назначение |
|------|------------|
| `index.html` | Точка входа |
| `assets/css/main.css` | Стили |
| `assets/js/main.js` | Меню, галерея, календарь 2026 |
| `assets/data/coffee-calendar-2026.json` | Подсказки календаря (JSON) |
| `assets/images/banner/` | PNG/SVG баннеров |
| `assets/photos/` | Фото точек, `manifest.json` |
| `docs/` | Материалы к макетам и меню |
| `tools/` | Скрипты генерации manifest и календаря |

## Публичный сайт (GitHub Pages)

В настройках репозитория: **Settings → Pages → Build and deployment → Branch `main`, folder `/ (root)`**. Тогда адрес:

**https://puholet-sketch.github.io/coffee.friends/**

## Локальный просмотр

Нужен HTTP-сервер (`fetch` для `manifest.json` и календаря):

```bash
npx --yes serve .
```

## Фото по этажам

Префиксы **`2-`** / **`11-`** или **`2floor_`** / **`11floor_`**. После добавления снимков: `tools/generate-photo-manifest.ps1`.
