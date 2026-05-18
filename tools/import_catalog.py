# -*- coding: utf-8 -*-
"""Импорт catalog.xlsx → assets/data/menu.json"""
import json
import re
from collections import defaultdict
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parents[1]
XLSX = ROOT / "docs/assortment/catalog.xlsx"
OUT = ROOT / "assets/data/menu.json"

VOL_RE = re.compile(r"\s+(\d{2,3})\s*$")
SKIP_GROUPS = {"Допы", "Росгосстрах"}


def slugify(text: str) -> str:
    t = text.lower()
    tr = {
        "а": "a", "б": "b", "в": "v", "г": "g", "д": "d", "е": "e", "ё": "e",
        "ж": "zh", "з": "z", "и": "i", "й": "y", "к": "k", "л": "l", "м": "m",
        "н": "n", "о": "o", "п": "p", "р": "r", "с": "s", "т": "t", "у": "u",
        "ф": "f", "х": "h", "ц": "ts", "ч": "ch", "ш": "sh", "щ": "sch",
        "ъ": "", "ы": "y", "ь": "", "э": "e", "ю": "yu", "я": "ya",
    }
    t = "".join(tr.get(c, c) for c in t)
    return re.sub(r"[^a-z0-9]+", "_", t).strip("_") or "item"


def title_name(name: str) -> str:
    if name.isupper() or name.istitle():
        return name
  # короткие слова как в прайсе — с заглавной
    return name[:1].upper() + name[1:]


def parse_name(raw: str):
    name = str(raw).strip()
    m = VOL_RE.search(name)
    if m:
        return name[: m.start()].strip(), int(m.group(1))
    return name, None


def map_group_label(label: str, base_name: str) -> str:
    if label in SKIP_GROUPS or not label:
        return "skip"
    if label == "Кофе":
        return "coffee"
    if label in ("Чай", "Фруктовые чаи", "Шоколад"):
        return "tea"
    if label == "Холодный кофе":
        return "cold_coffee"
    if label == "Лимонады":
        return "lemonade"
    if label == "Сезонные напитки":
        return "seasonal"
    if label == "Десерты":
        return "pastry"
    if label == "Еда":
        low = base_name.lower()
        if "сэндвич" in low or base_name in ("Чиабатта", "Роллы"):
            return "sandwich"
        if base_name in ("Горячее", "Завтраки", "Салаты"):
            return "hot"
        return "food"
    return "other"


def main():
    wb = openpyxl.load_workbook(XLSX, data_only=True)
    ws = wb.active
    rows = list(ws.iter_rows(values_only=True))

    items = []
    for r in rows[1:]:
        if not r or not r[0]:
            continue
        price = r[3]
        if not isinstance(price, (int, float)):
            continue
        base, vol = parse_name(str(r[0]))
        group_label = str(r[6] or "").strip() if len(r) > 6 else ""
        g = map_group_label(group_label, title_name(base))
        if g == "skip":
            continue
        items.append(
            {
                "base": title_name(base),
                "volumeMl": vol,
                "price": int(price),
                "group": g,
                "groupLabel": group_label,
            }
        )

    by_base = defaultdict(
        lambda: {"volumes": {}, "prices": [], "group": "", "groupLabel": ""}
    )
    for it in items:
        key = (it["group"], it["base"])
        rec = by_base[key]
        rec["group"] = it["group"]
        rec["groupLabel"] = it["groupLabel"]
        rec["name"] = it["base"]
        rec["prices"].append(it["price"])
        if it["volumeMl"]:
            rec["volumes"][it["volumeMl"]] = it["price"]

    drinks_now = []
    preorder_food = []

    for (g, base), rec in sorted(by_base.items(), key=lambda x: x[0][1].lower()):
        entry = {
            "id": slugify(base),
            "name": base,
            "group": g,
            "groupLabel": rec["groupLabel"],
            "priceFrom": min(rec["prices"]),
        }
        if rec["volumes"]:
            entry["volumes"] = [
                {"ml": ml, "price": pr} for ml, pr in sorted(rec["volumes"].items())
            ]
        if g in ("sandwich", "hot"):
            entry["kind"] = g

        if g in ("coffee", "tea", "cold_coffee", "lemonade", "seasonal"):
            drinks_now.append(entry)
        elif g in ("sandwich", "hot", "pastry", "food", "other"):
            preorder_food.append(entry)

    def uniq(lst):
        seen = set()
        for it in lst:
            oid = it["id"]
            n = 2
            while it["id"] in seen:
                it["id"] = f"{oid}_{n}"
                n += 1
            seen.add(it["id"])

    uniq(drinks_now)
    uniq(preorder_food)

    menu = {
        "meta": {
            "source": "docs/assortment/catalog.xlsx",
            "standardVolumesMl": [250, 350, 450],
            "sandwichFillings": ["Говядина", "Индейка", "Курица", "Рыба"],
            "orderTypes": {
                "now": {
                    "label": "Заказ сейчас",
                    "hint": "Напитки и еда — забрать через 5–10 минут",
                },
                "preorder": {
                    "label": "Предзаказ на дату",
                    "hint": "Еда и сладкое на завтра или другую дату (без напитков)",
                },
            },
        },
        "drinksNow": drinks_now,
        "preorderFood": preorder_food,
    }

    OUT.write_text(json.dumps(menu, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("OK", OUT)
    print("drinksNow", len(drinks_now), "preorderFood", len(preorder_food))


if __name__ == "__main__":
    main()
