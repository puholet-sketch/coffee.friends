/** Основное меню напитков — iconId: компактная иконка в таблице */
const drinksMenu = [
  { iconId: "espresso", name: "Эспрессо", detail: "30 мл", price: "от 180 ₽" },
  { iconId: "americano", name: "Американо", detail: "250 мл", price: "от 180 ₽" },
  { iconId: "cappuccino", name: "Капучино", detail: "250 мл", price: "от 250 ₽" },
  { iconId: "latte", name: "Латте", detail: "350 мл", price: "от 300 ₽" },
  { iconId: "flatwhite", name: "Флет уайт", detail: "250 мл", price: "от 270 ₽" },
  { iconId: "raf", name: "Раф", detail: "350 мл", price: "от 340 ₽" },
  { iconId: "matcha", name: "Матча латте", detail: "350 мл", price: "от 300 ₽" },
  { iconId: "cocoa", name: "Какао и горячий шоколад", detail: "350 мл", price: "от 280 ₽" },
  { iconId: "tea", name: "Чай в ассортименте", detail: "пакетированный / листовой", price: "от 80 ₽" }
];

/**
 * Остальной ассортимент — та же таблица, что напитки. iconId — SVG как раньше.
 */
const assortmentCategories = [
  { iconId: "pastry", title: "Выпечка и десерты", blurb: "Сладкое и снеки в витрине", price: "от 70 ₽" },
  { iconId: "sandwich", title: "Сэндвичи и готовая еда", blurb: "Сэндвичи, салаты, роллы и горячее", price: "от 270 ₽" },
  { iconId: "tea", title: "Фруктовые чаи (горячие)", blurb: "Сезонный формат, чаще в холодный период", price: "от 300 ₽" },
  { iconId: "tea", title: "Лимонады и фреши (холодные)", blurb: "Освежающие позиции на тёплый сезон", price: "от 280 ₽" },
  { iconId: "coldbrew", title: "Холодный кофе", blurb: "Айс-латте, айс-мокко, глясе и фрапучино", price: "от 250 ₽" },
  { iconId: "smoothie", title: "Сезонные авторские напитки", blurb: "Напитки по текущему сезону", price: "от 320 ₽" }
];

/** Компактные иконки напитков (тот же хай-тек: stroke, currentColor) */
const ICONS_DRINK = {
  espresso: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.25" d="M9 24h14v5H9z"/><path fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" d="M11 24V14c0-2.5 2-4.5 5-4.5s5 2 5 4.5v3"/><path fill="none" stroke="currentColor" stroke-width="1.1" d="M10 12h16"/></svg>`,
  americano: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.25" d="M10 10h12l-1 20H11z"/><path fill="none" stroke="currentColor" stroke-width="1" d="M12 15h8M12 19h8M12 23h8"/></svg>`,
  cappuccino: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.25" d="M9 22h16v6H9z"/><ellipse cx="14" cy="16" rx="2" ry="1.5" fill="none" stroke="currentColor" stroke-width="1"/><ellipse cx="18" cy="14" rx="2" ry="1.5" fill="none" stroke="currentColor" stroke-width="1"/><ellipse cx="22" cy="16" rx="2" ry="1.5" fill="none" stroke="currentColor" stroke-width="1"/></svg>`,
  latte: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="miter" d="M11 8h12l-2 24H13z"/><path fill="none" stroke="currentColor" stroke-width="1" d="M13 14h8M13 18h8"/></svg>`,
  flatwhite: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.3" d="M8 20h18v5H8z"/><path fill="none" stroke="currentColor" stroke-width="1.15" d="M10 20V14c0-2 1.8-3.5 4-3.5h6c2.2 0 4 1.5 4 3.5v2"/></svg>`,
  raf: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.25" d="M11 8h12l-1.5 22h-9z"/><path fill="none" stroke="currentColor" stroke-width="1" d="M13 11h8M13 15h8M13 19h8M13 23h8"/></svg>`,
  matcha: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.25" d="M10 22h14v5H10z"/><path fill="none" stroke="currentColor" stroke-width="1.2" d="M17 22V12"/><circle cx="17" cy="9" r="3" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>`,
  cocoa: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" d="M12 9c2 2 3 4 2 6"/><path fill="none" stroke="currentColor" stroke-width="1.25" d="M9 22h16v6H9z"/><path fill="none" stroke="currentColor" stroke-width="1.1" d="M11 22V15c0-2 1.5-3.5 3.5-3.5h5"/></svg>`,
  tea: `<svg class="icon-ht icon-ht--table" viewBox="0 0 36 36" width="32" height="32" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="1.25" d="M10 12h14l-1.5 18H11.5z"/><path fill="none" stroke="currentColor" stroke-width="1" d="M24 11v-3h3"/><circle cx="25.5" cy="7" r="1.2" fill="none" stroke="currentColor" stroke-width="1"/></svg>`
};

/** HUD-рамка + глиф для ассортимента (как раньше) */
const ICONS_HT = {
  /** круассан / выпечка */
  pastry: `<svg class="icon-ht" viewBox="0 0 44 44" width="40" height="40" aria-hidden="true" focusable="false"><path class="icon-ht__hud" fill="none" stroke="currentColor" stroke-width="1.15" stroke-linejoin="miter" d="M3 10V3H10M34 3H41V10M41 34V41H34M3 34V41H10"/><path fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" d="M9 31c4-14 10-18 13-18s9 4 13 18c-4-3-8-4-13-4s-9 1-13 4z"/><path fill="none" stroke="currentColor" stroke-width="1.05" stroke-linecap="round" d="M15 27l7-14 7 14"/></svg>`,
  /** сэндвич: хлеб + начинка + хлеб */
  sandwich: `<svg class="icon-ht" viewBox="0 0 44 44" width="40" height="40" aria-hidden="true" focusable="false"><path class="icon-ht__hud" fill="none" stroke="currentColor" stroke-width="1.15" d="M3 10V3H10M34 3H41V10M41 34V41H34M3 34V41H10"/><path fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round" d="M7 14h30v3.5H7z"/><path fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" d="M9 20h3l2.5-1.8 2.5 1.8 2.5-1.8 2.5 1.8 2.5-1.8 2.5 1.8 2.5-1.8H35"/><path fill="none" stroke="currentColor" stroke-width="1.35" stroke-linejoin="round" d="M7 23h30v3.5H7zM7 28h30v3.5H7z"/></svg>`,
  /** яичница */
  breakfast: `<svg class="icon-ht" viewBox="0 0 44 44" width="40" height="40" aria-hidden="true" focusable="false"><path class="icon-ht__hud" fill="none" stroke="currentColor" stroke-width="1.15" d="M3 10V3H10M34 3H41V10M41 34V41H34M3 34V41H10"/><ellipse cx="22" cy="25" rx="13" ry="7.5" fill="none" stroke="currentColor" stroke-width="1.35"/><circle cx="22" cy="23" r="4" fill="none" stroke="currentColor" stroke-width="1.25"/><path fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" d="M13 16c1.5-2 4-3.5 6-3"/></svg>`,
  /** стакан со смузи: купол, трубочка, ягодки */
  smoothie: `<svg class="icon-ht" viewBox="0 0 44 44" width="40" height="40" aria-hidden="true" focusable="false"><path class="icon-ht__hud" fill="none" stroke="currentColor" stroke-width="1.15" d="M3 10V3H10M34 3H41V10M41 34V41H34M3 34V41H10"/><path fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" d="M15 19h14l-1.5 15H16.5z"/><path fill="none" stroke="currentColor" stroke-width="1.15" d="M13 19c0-5 4-8.5 9-8.5s9 3.5 9 8.5"/><path fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" d="M22 6v13"/><circle cx="17.5" cy="26" r="1.35" fill="currentColor"/><circle cx="22" cy="28.5" r="1.35" fill="currentColor"/><circle cx="26.5" cy="26" r="1.35" fill="currentColor"/></svg>`,
  /** холодный чай: стакан, лёд, листик */
  tea: `<svg class="icon-ht" viewBox="0 0 44 44" width="40" height="40" aria-hidden="true" focusable="false"><path class="icon-ht__hud" fill="none" stroke="currentColor" stroke-width="1.15" d="M3 10V3H10M34 3H41V10M41 34V41H34M3 34V41H10"/><path fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" d="M13 13h14l2 19H15z"/><path fill="none" stroke="currentColor" stroke-width="1" d="M27 13c3.5 0 6 2.5 6 6s-2.5 6-6 6"/><rect x="16" y="18" width="3.2" height="3.2" fill="none" stroke="currentColor" stroke-width="0.95" transform="rotate(-12 17.6 19.6)"/><rect x="21" y="21" width="3.2" height="3.2" fill="none" stroke="currentColor" stroke-width="0.95" transform="rotate(8 22.6 22.6)"/><path fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" d="M28 9c2 1 3.5 3 4 5"/><path fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" d="M30 7l2-2"/></svg>`,
  /** колд-брю: стакан на вынос, лёд, волна напитка */
  coldbrew: `<svg class="icon-ht" viewBox="0 0 44 44" width="40" height="40" aria-hidden="true" focusable="false"><path class="icon-ht__hud" fill="none" stroke="currentColor" stroke-width="1.15" d="M3 10V3H10M34 3H41V10M41 34V41H34M3 34V41H10"/><path fill="none" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round" d="M14 11h16l-1.5 22H15.5z"/><path fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" d="M13 11h18"/><rect x="16.5" y="15" width="2.8" height="2.8" fill="none" stroke="currentColor" stroke-width="0.9"/><rect x="20.5" y="17.5" width="2.8" height="2.8" fill="none" stroke="currentColor" stroke-width="0.9"/><rect x="24.5" y="15" width="2.8" height="2.8" fill="none" stroke="currentColor" stroke-width="0.9"/><path fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" d="M15 29c2.5 2 5 3 7 3s4.5-1 7-3"/></svg>`
};

/** Резерв, если manifest недоступен (например file://) */
const galleryPhotosFallback = [];

const MANIFEST_URL = "assets/photos/manifest.json";

/** Данные из static-embed.js — для file:// и офлайна, когда fetch к JSON недоступен */
function readEmbedGalleryManifest() {
  const raw = typeof window !== "undefined" ? window.__COFEPOINT_EMBED : null;
  const m = raw && raw.galleryManifest;
  if (!m || !Array.isArray(m.photos) || m.photos.length === 0) return null;
  return m;
}

function readEmbedCoffeeCalendar() {
  const raw = typeof window !== "undefined" ? window.__COFEPOINT_EMBED : null;
  const c = raw && raw.coffeeCalendar;
  if (!c || !Array.isArray(c.items) || c.items.length === 0) return null;
  return c;
}

function inferFloor(photo) {
  const explicit = photo && typeof photo.floor === "number" ? photo.floor : null;
  if (explicit === 2 || explicit === 11) return explicit;

  const src = (photo && (photo.src || photo.path)) || "";
  const base = src.split(/[/\\]/).pop() || "";
  const lower = base.toLowerCase();

  if (/^этаж[-_]?11([^0-9]|$)/i.test(lower) || /^11([^0-9]|$)/.test(lower) || /^11floor/i.test(lower)) {
    return 11;
  }
  if (/^этаж[-_]?2([^0-9]|$)/i.test(lower) || /^02([^0-9]|$)/.test(lower)) {
    return 2;
  }
  if (/^2([^0-9]|$)/.test(lower) || /^2floor/i.test(lower)) {
    return 2;
  }
  return null;
}

function isImageIcon(icon) {
  return /^(\.|\/|https?:)/i.test(icon || "");
}

function drinkIconMarkup(iconId) {
  const id = iconId || "espresso";
  return ICONS_DRINK[id] || ICONS_DRINK.espresso;
}

function svgAsTableIcon(svg) {
  return svg
    .replace('class="icon-ht"', 'class="icon-ht icon-ht--table"')
    .replace(/width="40" height="40"/g, 'width="32" height="32"');
}

function assortmentTableIcon(cat) {
  if (cat.icon && isImageIcon(cat.icon)) {
    return `<img class="icon-ht icon-ht--table" src="${escapeAttr(cat.icon)}" alt="" width="32" height="32" loading="lazy">`;
  }
  const id = cat.iconId || "pastry";
  return svgAsTableIcon(ICONS_HT[id] || ICONS_HT.pastry);
}

function renderDrinks() {
  const body = document.getElementById("drinksBody");
  if (!body) return;

  body.innerHTML = drinksMenu
    .map(
      (row) => `<tr>
        <td class="drinks-table__cell-icon"><span class="drinks-table__icon-wrap">${drinkIconMarkup(row.iconId)}</span></td>
        <td>${escapeHtml(row.name)}</td>
        <td class="drinks-table__col-detail">${escapeHtml(row.detail)}</td>
        <td>${escapeHtml(row.price)}</td>
      </tr>`
    )
    .join("");
}

function renderCategories() {
  const body = document.getElementById("categoryBody");
  if (!body) return;

  body.innerHTML = assortmentCategories
    .map(
      (cat) => `<tr>
        <td class="drinks-table__cell-icon"><span class="drinks-table__icon-wrap">${assortmentTableIcon(cat)}</span></td>
        <td>${escapeHtml(cat.title)}</td>
        <td class="drinks-table__col-detail">${escapeHtml(cat.blurb)}</td>
        <td>${escapeHtml(cat.price)}</td>
      </tr>`
    )
    .join("");
}

function escapeHtml(text) {
  const s = String(text ?? "");
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(text) {
  return escapeHtml(text).replace(/'/g, "&#39;");
}

const CALENDAR_DATA_URL = "assets/data/coffee-calendar-2026.json";

const CAL_MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь"
];

const CAL_WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function calPad2(n) {
  return String(n).padStart(2, "0");
}

function calYmd(y, m, d) {
  return `${y}-${calPad2(m)}-${calPad2(d)}`;
}

function calMondayPad(year, monthIndex) {
  const dow = new Date(year, monthIndex, 1).getDay();
  return (dow + 6) % 7;
}

function calDaysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

/** data-cal-from / data-cal-to в формате YYYY-MM */
function parseCalYearMonth(str) {
  if (!str || typeof str !== "string") return null;
  const parts = str.trim().split("-");
  if (parts.length !== 2) return null;
  const y = Number(parts[0]);
  const m = Number(parts[1]);
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return null;
  return { y, m };
}

function initCoffeeCalendarTooltips(itemsByDate) {
  const root = document.getElementById("coffeeCalendarRoot");
  const tip = document.getElementById("coffeeCalTooltip");
  const titleEl = document.getElementById("coffeeCalTooltipTitle");
  const bodyEl = document.getElementById("coffeeCalTooltipBody");
  const closeBtn = document.getElementById("coffeeCalTooltipClose");
  const live = document.getElementById("coffee-cal-live");
  if (!root || !tip || !titleEl || !bodyEl) return;

  const prefersFinePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  let hideTimer = null;
  let activeBtn = null;

  function fillLive(item) {
    if (live) live.textContent = `${item.title}. ${item.text}`;
  }

  function clearLive() {
    if (live) live.textContent = "";
  }

  function positionNear(anchor) {
    const r = anchor.getBoundingClientRect();
    const margin = 10;
    tip.classList.remove("cal-tooltip--dock");
    tip.style.left = "";
    tip.style.right = "";
    tip.style.bottom = "";
    tip.style.top = "";
    tip.style.width = "";

    const tw = tip.offsetWidth || 320;
    const th = tip.offsetHeight || 120;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - tw - margin));
    let top = r.bottom + margin;
    if (top + th > window.innerHeight - margin) {
      top = r.top - th - margin;
    }
    top = Math.max(margin, Math.min(top, window.innerHeight - th - margin));
    tip.style.left = `${Math.round(left)}px`;
    tip.style.top = `${Math.round(top)}px`;
    tip.classList.add("cal-tooltip--interactive");
  }

  function positionDocked() {
    tip.classList.add("cal-tooltip--dock");
    tip.style.left = "";
    tip.style.right = "";
    tip.style.top = "";
    tip.style.bottom = "";
    tip.style.width = "";
    tip.classList.add("cal-tooltip--interactive");
  }

  function showTip(btn) {
    const item = itemsByDate.get(btn.dataset.date);
    if (!item) return;
    activeBtn = btn;
    titleEl.textContent = item.title;
    bodyEl.textContent = item.text;
    tip.removeAttribute("hidden");
    fillLive(item);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (tip.hasAttribute("hidden")) return;
        if (prefersFinePointer()) {
          positionNear(btn);
        } else {
          positionDocked();
        }
      });
    });
  }

  function hideTip() {
    tip.setAttribute("hidden", "");
    activeBtn = null;
    clearLive();
    tip.classList.remove("cal-tooltip--interactive");
    tip.classList.remove("cal-tooltip--dock");
    tip.style.left = "";
    tip.style.top = "";
    tip.style.right = "";
    tip.style.bottom = "";
    tip.style.width = "";
  }

  function scheduleHide() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!prefersFinePointer()) return;
      hideTip();
    }, 180);
  }

  root.querySelectorAll(".cal-day--fact").forEach((btn) => {
    btn.addEventListener("mouseenter", () => {
      if (!prefersFinePointer()) return;
      clearTimeout(hideTimer);
      showTip(btn);
    });
    btn.addEventListener("mouseleave", scheduleHide);
    btn.addEventListener("focus", () => {
      showTip(btn);
    });
    btn.addEventListener("blur", (e) => {
      if (!prefersFinePointer()) return;
      const rt = e.relatedTarget;
      if (rt && (tip === rt || tip.contains(rt))) return;
      setTimeout(() => {
        if (document.activeElement && tip.contains(document.activeElement)) return;
        hideTip();
      }, 60);
    });
    btn.addEventListener("click", () => {
      if (prefersFinePointer()) {
        showTip(btn);
        return;
      }
      if (tip.hasAttribute("hidden") || activeBtn !== btn) {
        showTip(btn);
      } else {
        hideTip();
      }
    });
  });

  tip.addEventListener("mouseenter", () => {
    if (!prefersFinePointer()) return;
    clearTimeout(hideTimer);
  });
  tip.addEventListener("mouseleave", () => {
    if (!prefersFinePointer()) return;
    scheduleHide();
  });

  closeBtn?.addEventListener("click", () => hideTip());

  document.addEventListener(
    "pointerdown",
    (e) => {
      if (tip.hasAttribute("hidden")) return;
      if (prefersFinePointer()) return;
      if (tip.contains(e.target)) return;
      if (e.target.closest?.(".cal-day--fact")) return;
      hideTip();
    },
    true
  );

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") hideTip();
  });

  window.addEventListener("scroll", () => {
    if (!activeBtn || tip.hasAttribute("hidden")) return;
    if (prefersFinePointer()) positionNear(activeBtn);
  });

  window.addEventListener("resize", () => {
    if (!activeBtn || tip.hasAttribute("hidden")) return;
    if (prefersFinePointer()) positionNear(activeBtn);
  });
}

function renderCoffeeCalendarShell(itemsByDate) {
  const root = document.getElementById("coffeeCalendarRoot");
  if (!root) return;

  const from = parseCalYearMonth(root.dataset.calFrom) || { y: 2026, m: 5 };
  const to = parseCalYearMonth(root.dataset.calTo) || { y: 2027, m: 12 };

  const weekdaysRow = CAL_WEEKDAYS.map((w) => `<div class="cal-grid__wd">${w}</div>`).join("");

  const months = [];
  let y = from.y;
  let mo = from.m;
  while (y < to.y || (y === to.y && mo <= to.m)) {
    const mi = mo - 1;
    const pad = calMondayPad(y, mi);
    const dim = calDaysInMonth(y, mi);
    let cells = "";
    for (let i = 0; i < pad; i++) {
      cells += `<div class="cal-cell--pad" aria-hidden="true"></div>`;
    }
    for (let day = 1; day <= dim; day++) {
      const ds = calYmd(y, mo, day);
      const item = itemsByDate.get(ds);
      const wd = new Date(y, mi, day, 12, 0, 0).getDay();
      const isWeekend = wd === 0 || wd === 6;
      const wk = isWeekend ? " cal-day--weekend" : "";
      if (item) {
        const mon = CAL_MONTH_NAMES[mi];
        const al = `${day} ${mon} ${y}: ${item.title}. Подсказка скрыта до наведения или нажатия.`;
        cells += `<button type="button" class="cal-day cal-day--fact${wk}" data-date="${ds}" aria-label="${escapeAttr(al)}">${day}<span class="cal-day__dot" aria-hidden="true"></span></button>`;
      } else {
        cells += `<div class="cal-day cal-day--empty${wk}" aria-hidden="true"><span class="cal-day__num">${day}</span></div>`;
      }
    }
    months.push(
      `<article class="cal-month surface-card neon-frame">
        <header class="cal-month__head">
          <h3 class="cal-month__title">${CAL_MONTH_NAMES[mi]} <span class="text-accent-gold">${y}</span></h3>
        </header>
        <div class="cal-grid__weekdays">${weekdaysRow}</div>
        <div class="cal-grid">${cells}</div>
      </article>`
    );
    mo++;
    if (mo > 12) {
      mo = 1;
      y++;
    }
  }
  root.innerHTML = months.join("");
  initCoffeeCalendarTooltips(itemsByDate);
}

async function loadCoffeeCalendar() {
  const section = document.getElementById("coffee-calendar");
  if (section && section.hasAttribute("hidden")) return;

  const root = document.getElementById("coffeeCalendarRoot");
  if (!root) return;

  const itemsByDate = new Map();
  let loaded = false;

  function ingestItems(arr) {
    if (!Array.isArray(arr)) return;
    for (const it of arr) {
      if (it && it.date && it.title && it.text) {
        itemsByDate.set(it.date, { title: it.title, text: it.text });
      }
    }
  }

  try {
    const res = await fetch(CALENDAR_DATA_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        ingestItems(data.items);
        loaded = itemsByDate.size > 0;
      }
    }
  } catch {
    /* file:// или сеть */
  }

  if (!loaded) {
    const emb = readEmbedCoffeeCalendar();
    if (emb && Array.isArray(emb.items) && emb.items.length > 0) {
      ingestItems(emb.items);
    }
  }

  const status = document.getElementById("coffee-calendar-status");
  if (itemsByDate.size === 0 && status) {
    status.classList.remove("visually-hidden");
    status.textContent =
      "Календарь без подсказок: нет static-embed.js или данных. Запустите node tools/embed-static-data.mjs или откройте сайт через локальный сервер.";
  } else if (status) {
    status.classList.add("visually-hidden");
    status.textContent = "";
  }

  renderCoffeeCalendarShell(itemsByDate);
}

function encodePath(src) {
  return String(src || "")
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function renderGalleryPhotos(photos) {
  const root = document.getElementById("galleryFloorRoot");
  if (!root) return;

  const list = Array.isArray(photos) ? photos : [];
  const floor2 = [];
  const floor11 = [];
  const other = [];

  for (const p of list) {
    const f = inferFloor(p);
    if (f === 2) floor2.push(p);
    else if (f === 11) floor11.push(p);
    else other.push(p);
  }

  const tile = (p) => {
    const src = encodePath(p.src || p.path || "");
    const alt = escapeAttr(p.alt || "CoffeeFriends");
    return `<figure class="gallery-tile">
      <img src="${src}" alt="${alt}" loading="lazy" decoding="async" sizes="(min-width: 900px) 42vw, 92vw" width="800" height="600">
    </figure>`;
  };

  const column = (title, badgeClass, items, emptyText) => {
    const inner =
      items.length > 0
        ? `<div class="gallery-masonry">${items.map(tile).join("")}</div>`
        : `<p class="gallery-empty">${escapeHtml(emptyText)}</p>`;
    return `<div class="gallery-floor-col">
      <header class="gallery-floor-head">
        <span class="floor-badge ${badgeClass}">${escapeHtml(title)}</span>
      </header>
      ${inner}
    </div>`;
  };

  let html = `<div class="gallery-floor-grid">
    ${column("2 этаж", "floor-2", floor2, "Добавьте снимки с префиксом 2- или 2floor_ в assets/photos и обновите manifest.")}
    ${column("11 этаж", "floor-11", floor11, "Добавьте снимки с префиксом 11- или 11floor_ в assets/photos и обновите manifest.")}
  </div>`;

  if (other.length > 0) {
    html += `<div class="gallery-other">
      <p class="gallery-other-title">Без метки этажа в имени</p>
      <p class="gallery-other-hint">Переименуйте в 2-… или 11-… (или укажите поле \"floor\": 2 в manifest.json)</p>
      <div class="gallery-masonry gallery-masonry--compact">${other.map(tile).join("")}</div>
    </div>`;
  }

  root.innerHTML = html;
}

async function loadGalleryManifest() {
  let photos = galleryPhotosFallback.slice();
  let loaded = false;

  try {
    const res = await fetch(MANIFEST_URL, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.photos) && data.photos.length > 0) {
        photos = data.photos;
        loaded = true;
      }
    }
  } catch {
    /* file:// или сеть */
  }

  if (!loaded) {
    const emb = readEmbedGalleryManifest();
    if (emb) {
      photos = emb.photos;
    }
  }

  renderGalleryPhotos(photos);
}

function whenGallerySectionReady(done) {
  const el = document.getElementById("gallery");
  if (!el) {
    done();
    return;
  }

  const schedule = () => {
    try {
      if (typeof requestIdleCallback === "function") {
        requestIdleCallback(() => done(), { timeout: 2800 });
      } else {
        setTimeout(done, 24);
      }
    } catch {
      setTimeout(done, 24);
    }
  };

  if (!("IntersectionObserver" in window)) {
    schedule();
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        schedule();
      }
    },
    { rootMargin: "220px 0px", threshold: 0 }
  );
  io.observe(el);
}

function initJokesPager() {
  const grid = document.querySelector(".jokes-grid");
  const prevBtn = document.getElementById("jokesPrevBtn");
  const nextBtn = document.getElementById("jokesNextBtn");
  const indicator = document.getElementById("jokesPageIndicator");
  const toggleAllBtn = document.getElementById("jokesShowAllBtn");
  if (!grid || !nextBtn || !prevBtn || !toggleAllBtn) return;

  // Все шутки должны иметь категорию-бейдж в едином формате.
  Array.from(grid.querySelectorAll(".joke-card")).forEach((card) => {
    const p = card.querySelector("p");
    if (!p) return;
    if (p.querySelector(".joke-card__label")) return;
    const label = document.createElement("span");
    label.className = "joke-card__label";
    label.textContent = card.classList.contains("joke-card--so") ? "Со стойки" : "Из офиса";
    p.prepend(label);
  });

  const allCards = Array.from(grid.querySelectorAll(".joke-card"));
  if (allCards.length === 0) return;

  const fromCounter = allCards.filter((card) => card.classList.contains("joke-card--so"));
  const regular = allCards.filter((card) => !card.classList.contains("joke-card--so"));
  const pageSize = 3;
  const pageCount = Math.max(
    1,
    Math.ceil(regular.length / pageSize),
    Math.ceil(fromCounter.length / pageSize)
  );

  let page = 0;
  let expanded = false;

  function setPagerVisibility() {
    if (expanded) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      return;
    }
    const hidePager = pageCount <= 1;
    prevBtn.hidden = hidePager;
    nextBtn.hidden = hidePager;
  }

  function sliceFor(arr) {
    if (arr.length === 0) return [];
    const start = (page * pageSize) % arr.length;
    return arr.slice(start, start + pageSize);
  }

  function renderPage() {
    if (expanded) return;

    const regularSlice = new Set(sliceFor(regular));
    const soSlice = new Set(sliceFor(fromCounter));

    allCards.forEach((card) => {
      const visible = card.classList.contains("joke-card--so")
        ? soSlice.has(card)
        : regularSlice.has(card);
      card.classList.toggle("is-hidden", !visible);
    });

    const pageLabel = `Порция шуток ${page + 1} из ${pageCount}`;
    nextBtn.setAttribute("aria-label", `Следующая, ${pageLabel}`);
    prevBtn.setAttribute("aria-label", `Предыдущая, ${pageLabel}`);
    if (indicator) {
      indicator.textContent = `${page + 1} / ${pageCount}`;
    }
    setPagerVisibility();
  }

  prevBtn.addEventListener("click", () => {
    if (expanded) return;
    page = (page - 1 + pageCount) % pageCount;
    renderPage();
  });

  nextBtn.addEventListener("click", () => {
    if (expanded) return;
    page = (page + 1) % pageCount;
    renderPage();
  });

  toggleAllBtn.addEventListener("click", () => {
    expanded = !expanded;
    toggleAllBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    grid.classList.toggle("jokes-grid--expanded", expanded);

    if (expanded) {
      allCards.forEach((card) => card.classList.remove("is-hidden"));
      prevBtn.hidden = true;
      nextBtn.hidden = true;
      if (indicator) indicator.textContent = `Все · ${allCards.length}`;
      toggleAllBtn.textContent = "Свернуть";
    } else {
      toggleAllBtn.textContent = "Показать все";
      renderPage();
    }
  });

  renderPage();
}

renderDrinks();
renderCategories();
whenGallerySectionReady(() => {
  loadGalleryManifest();
});
loadCoffeeCalendar();
initJokesPager();
