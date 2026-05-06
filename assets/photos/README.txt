CoffeeFriends — фото для блока «Атмосфера» на сайте
==================================================

Имя файла (в начале) задаёт этаж:

  2-zal.jpg, 2floor_1.jpg   →  2 этаж
  11-bar.jpg, 11floor_2.png →  11 этаж

Допустимо: этаж-2-..., этаж-11-... Поддерживаются .jpg .jpeg .png .webp .gif

Обновить manifest.json
----------------------
Из корня проекта COFEPOINT в PowerShell:

  powershell -NoProfile -ExecutionPolicy Bypass -File tools/generate-photo-manifest.ps1

Скрипт перечисляет все изображения в этой папке (кроме manifest.json) и перезаписывает manifest.json с путями вида assets/photos/имяфайла.

Сайт открывайте через HTTP (локальный сервер или хостинг), не как file:// — иначе fetch(manifest.json) не сработает.
