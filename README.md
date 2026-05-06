# CoffeeFriends — статическая визитка (COFEPOINT)

Корень деплоя — эта папка: **`index.html`** лежит в корне, все пути латиницей.

## Структура

| Путь | Назначение |
|------|------------|
| `index.html` | Точка входа |
| `assets/css/main.css` | Стили |
| `assets/js/main.js` | Данные меню, рендер таблиц и галереи |
| `assets/images/banner/` | PNG/SVG баннеров и печати |
| `assets/photos/` | Фото точек, `manifest.json` для галереи |
| `docs/banner/` | Тексты и заметки к макетам баннера (Markdown) |
| `docs/assortment/` | PDF и внутренние материалы (не участвуют в сайте) |
| `tools/generate-photo-manifest.ps1` | Пересборка `assets/photos/manifest.json` |

## Локальный просмотр

Нужен HTTP-сервер (галерея читает `manifest.json` через `fetch`):

```bash
npx --yes serve .
```

Затем откройте URL, который выведет `serve`.

## Фото по этажам

Имена файлов: префикс **`2-`** / **`11-`** или **`2floor_`** / **`11floor_`**. После добавления снимков запустите `tools/generate-photo-manifest.ps1`.
