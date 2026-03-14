# Каталог анимаций (motions)

## Средства реализации

| Средство | Когда использовать | Плюсы | Минусы |
|----------|-------------------|-------|--------|
| **CSS** (keyframes, transition) | hover/active, shimmer, ripple mask, border-beam | Дёшево, без JS | Сложные траектории |
| **SVG** | трещины, обводки, морфинг | Вектор, резкость | Много путей — следить за perf |
| **Canvas 2D** | частицы, разлёт пикселей (со снимком) | Полный контроль | Снимок DOM — тяжёлый шаг |
| **DOM layout** | магнит, stagger, «логический» рассып детей | Доступность, без canvas | Не настоящие пиксели |
| **html2canvas** (опционально) | «всё включая детей» в текстуру → частицы | Визуально как распад | Вес, async, не идеален с CSS |
| **Framer Motion** (опционально) | оркестрация, layout, жесты | Удобно | Зависимость |
| **Lottie** | готовые ролики | Дизайн из After Effects | Бинарь, не процедурно |

## Пресеты → цели

См. `registry.ts` (`MOTION_CATALOG`). Кратко:

- **button:** none, crack, ripple, pulse-glow, press-scale, border-beam, magnetic-hover  
- **block:** ripple, shimmer, border-beam, stagger-children, logical-burst, particle-surface  
- **media / text:** в основном CSS + будущие обёртки  

## Инжект из темы

В теме можно хранить строку, например `motion.buttonCta: "crack"`. Рендерер передаёт в `MotionButton motion={theme.motion?.buttonCta}`. Невалидные id → `none` (`normalizeMotionId`).

## Полный пиксельный распад детей

1. Снять `html2canvas(node)` → ImageData.  
2. Разбить на сетку / сэмплы пикселей → спрайты на canvas.  
3. Анимировать vx, vy, rotation, alpha.  

Текущий **particle-surface** — упрощение без снимка (цвета с `getComputedStyle`).
