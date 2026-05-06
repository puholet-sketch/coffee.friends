# CoffeeFriends — статическая визитка

Репозиторий: **github.com/puholet-sketch/coffee.friends**. Корень деплоя — эта папка: **`index.html`** в корне, пути латиницей.

## Структура

| Путь | Назначение |
|------|------------|
| `index.html` | Точка входа |
| `assets/css/main.css` | Стили |
| `assets/js/main.js` | Меню, галерея, календарь (май 2026 — дек. 2027) |
| `assets/js/static-embed.js` | Копия manifest + календаря для `file://` (см. ниже) |
| `assets/data/coffee-calendar-2026.json` | Подсказки календаря (JSON, источник для embed) |
| `assets/images/banner/` | PNG/SVG баннеров |
| `assets/photos/` | Фото точек, `manifest.json` |
| `docs/` | Материалы к макетам и меню |
| `tools/` | `generate-photo-manifest.ps1`, `generate-coffee-calendar-2026.mjs`, **`embed-static-data.mjs`** |

## Публичный сайт (GitHub Pages)

В настройках репозитория: **Settings → Pages → Build and deployment → Branch `main`, folder `/ (root)`**. Тогда адрес:

**https://puholet-sketch.github.io/coffee.friends/**

Если открываете ссылку и видите **почти пустую страницу с маленьким логотипом GitHub** — чаще всего это **404**: Pages ещё не включены, не тот репозиторий/ветка, или сайт **не запушен**. Проверьте: **Settings → Pages** — источник **Deploy from a branch**, ветка **`main`**, папка **`/` (root)**; репозиторий лучше сделать **Public**; подождите 2–5 минут после сохранения. В корне репозитория должен быть **`index.html`** (как в этом проекте).

## Локальный просмотр

**Двойной клик по `index.html`:** браузер не даёт `fetch()` читать соседние JSON (CORS / `file://`). Поэтому в страницу подключён **`assets/js/static-embed.js`** — те же данные, что в `manifest.json` и `coffee-calendar-2026.json`. После правок JSON пересоберите embed:

```bash
node tools/embed-static-data.mjs
```

Через **HTTP** (актуальные JSON без пересборки embed):

```bash
npx --yes serve .
```

## Фото по этажам

Префиксы **`2-`** / **`11-`** или **`2floor_`** / **`11floor_`**. После добавления снимков: `tools/generate-photo-manifest.ps1`, затем **`node tools/embed-static-data.mjs`**.
