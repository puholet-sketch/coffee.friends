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

Если открываете ссылку и видите **почти пустую страницу с маленьким логотипом GitHub** или вкладку **«Site not found · GitHub Pages»** — это **404**: сайт ещё не опубликован.

**Вариант A — из ветки (проще):** **Settings → Pages → Build and deployment** → **Deploy from a branch** → ветка **`main`**, папка **`/ (root)`** (не `/docs`, если `index.html` в корне). Репозиторий на бесплатном GitHub должен быть **Public**, иначе Pages для project site часто недоступен.

**Вариант B — GitHub Actions:** в репозитории есть workflow **«Deploy static content to Pages»**. После push откройте **Settings → Pages** и выберите источник **GitHub Actions** (появится после первого успешного запуска workflow во вкладке **Actions**).

Подождите 1–5 минут после сохранения. В корне должен быть **`index.html`**. Файл **`.nojekyll`** отключает Jekyll, чтобы не ломались пути с подчёркиваниями.

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
