# Soluris `pxl_image_box` PHP warning fix

Theme templates under:
`wp-content/themes/soluris/elements/templates/pxl_image_box/layout-{1..8}.php`

## Problem
Missing Elementor settings keys (`style`, `pxl_animate`, `pxl_animate_delay`, nested `link`/`image`, …) cause PHP notices/warnings that leak into page HTML, e.g.:

`.../pxl_image_box/layout-1.php on line 11" data-wow-delay="ms">`

Theme reinstall/update restores the stock templates and brings the warnings back.

## Fix
Each layout now normalizes `$settings` with safe defaults before render.

## Deploy
Copy `layout-1.php` … `layout-8.php` into the theme path above on the WordPress host.
