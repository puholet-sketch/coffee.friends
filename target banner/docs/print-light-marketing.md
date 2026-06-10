# Печать банера light-marketing (600×1600 mm)

## Требования типографии

| Параметр | Значение |
|----------|----------|
| Размер | 600 × 1600 mm, масштаб 1:1 |
| Разрешение | 150 dpi (3543 × 9449 px) |
| Цвет | CMYK, профиль **Coated FOGRA39** |
| Формат | TIFF и/или PDF |

## Исходник

Файл **без декоративного QR**:

`target banner/source/coffee-friends-banner-vertical-light-marketing-source.png`

(портрет 3:8, белый фон, пустой квадрат под QR).

## Сборка

```powershell
cd D:\projects\COFEPOINT\tg
npm run banner:print:light-marketing
```

**Финальный макет (собран 2026-06-03):** отдавать в типографию **TIFF** или **PDF** из `print/` или `archive/`.

| Файл | Назначение |
|------|------------|
| `coffee-friends-banner-light-marketing-600x1600mm-150dpi-cmyk.tiff` | **Основной** — CMYK, FOGRA39, 3543×9449, 150 dpi |
| `coffee-friends-banner-light-marketing-600x1600mm-150dpi-cmyk.pdf` | Дубликат для просмотра/печати |
| `coffee-friends-banner-light-marketing-600x1600mm-150dpi-rgb.png` | Проверка на экране, скан QR |

Дубликаты в `archive/` с префиксом `coffee-friends-banner-vertical-light-marketing-...`.

CMYK — только если установлен **ImageMagick** (`magick` в PATH). ICC: `target banner/icc/CoatedFOGRA39.icc`.

## URL в QR

https://puholet-sketch.github.io/coffee.friends/

## Тексты (актуальная версия)

- Футер: **Мы топим за качество. Дедлайн — ваш. Эспрессо — наш.**
- Блок сайта: «Подробнее на сайте…» и **coffee.friends** в одной колонке (выровнены).
