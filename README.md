# The Compiled Narrative v1.0

A coding-journal portfolio with an IDE-inspired design system: semantic HTML, CSS variables, and high-readability typography for recruiters and admissions officers.

## Quick start

Open `index.html` in a browser, or serve the folder locally:

```bash
npx serve .
# or
python -m http.server 8080
```

## Structure

| File        | Purpose |
|------------|---------|
| `index.html` | Semantic layout: `<nav>`, `<article>`, `<code>`, file cards, hero, buttons |
| `styles.css`  | Design system: variables, typography, sidebar, file cards, gutter, responsive |
| `script.js`   | Copy-to-clipboard (code/email), mobile sidebar toggle, active nav state |

## Design system summary

- **Colors:** All in `:root` (e.g. `--bg-canvas`, `--text-primary`, `--color-accent`). No hardcoded hex in components.
- **Typography:** Mono (JetBrains Mono) for headings/nav/code; Sans (Inter) for body. Mono scaled at `0.9em` relative to body.
- **Layout:** 4px grid, max-width 800px content, 40px line-number gutter (desktop only), sidebar 256px fixed left.
- **Components:** Sidebar with hover/active states, file cards with hover lift + shadow, TL;DR blockquote, primary/secondary buttons.
- **Responsive:** Mobile hides gutter, sidebar becomes hamburger + overlay.

## Customization

1. Replace `[Name]` and role in the hero.
2. Set `data-email` on the contact code block to the value copied when clicking "Copy".
3. Add/remove `.nav-item` links and `.file-card` entries; keep one `.nav-item.active` by default or rely on `script.js` hash-based active state.
