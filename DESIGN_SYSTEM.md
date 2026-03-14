# WorkDesk — Design System & Theme Protection

> **This file is the single source of truth for all visual design decisions.**
> All future changes to styling, colour, typography, layout, or animation **must** align
> with the tokens and guidelines defined here. AI assistants and human contributors should
> reference this file before touching any CSS or UI code.

---

## 1. Brand Identity

| Property | Value |
|---|---|
| Product name | **WorkDesk** |
| Tagline | "HR made simple" |
| Primary brand colour | `#3A8F7B` (teal-green) |
| Logo type | SVG wordmark + checkmark icon |
| Tone | Professional, clean, trustworthy |

---

## 2. Colour Tokens

All colours are defined as CSS custom properties in `assets/css/styles.css` under `:root`.
**Never hard-code a hex value that already exists as a token.**

### Primary Palette
| Token | Value | Usage |
|---|---|---|
| `--primary` | `#3A8F7B` | Buttons, active states, links, accents |
| `--primary-dark` | `#2F7263` | Hover states for primary |
| `--primary-soft` | `#E7F4F1` | Backgrounds, pill badges, soft highlights |

### Accent Palette
| Token | Value | Usage |
|---|---|---|
| `--accent` | `#F4C86A` | Secondary highlights, warnings, stars |
| `--accent-soft` | `#FFF6DF` | Soft accent backgrounds |

### Neutral / Surface
| Token | Value | Usage |
|---|---|---|
| `--bg-main` | `#F5F7F6` | Page background |
| `--card-bg` | `#FFFFFF` | Cards, panels, modals |
| `--border-light` | `#E5E7EB` | Dividers, input borders |

### Semantic Colours
| Token | Value | Usage |
|---|---|---|
| `--text-main` | `#1F2933` | Body text, headings |
| `--text-muted` | `#6B7280` | Subtitles, labels, placeholders |
| `--success` | `#3CB371` | Active/present states |
| `--warning` | `#F5B041` | Late, pending, caution |
| `--danger` | `#E74C3C` | Errors, absent, critical |

### Login Page (overlay UI)
These values are used in `login.html` only, for the glassmorphism card on the background image.
| Property | Value |
|---|---|
| Background image | `Baground theme login page .png` (root-level asset) |
| Card background | `rgba(255,255,255,0.22)` with `backdrop-filter: blur(18px)` |
| Card border | `1px solid rgba(255,255,255,0.4)` |
| Brand green (login) | `#2e7d6b` (slightly darker than `--primary` for contrast on photo) |

---

## 3. Typography

| Token | Value |
|---|---|
| `--font-primary` | `"Inter", "Segoe UI", system-ui, sans-serif` |
| Base size | `16px` |
| Line height | `1.5` |
| Font smoothing | `-webkit-font-smoothing: antialiased` |

### Scale
| Role | Size | Weight |
|---|---|---|
| Page title / H1 | `22–28px` | `700` |
| Section heading / H2 | `18–20px` | `600–700` |
| Card title | `15px` | `600` |
| Body | `14px` | `400–500` |
| Label / meta | `13px` | `400–600` |
| Small / caption | `11–12px` | `400–600` |

---

## 4. Spacing & Sizing

| Token | Value | Usage |
|---|---|---|
| `--radius-lg` | `16px` | Cards, modals |
| `--radius-md` | `12px` | Inputs, stat icons |
| `--radius-sm` | `8px` | Buttons, tags, small chips |
| Base unit | `8px` | All spacing is a multiple of 8px |

### Card Padding
- Standard card: `22px`
- Compact card: `14–16px`
- Modal: `28–36px`

### Grid System
| Class | Columns | Gap |
|---|---|---|
| `.grid` | 3 (responsive: 2 → 1) | `20px` |
| `.grid-4` | 4 (responsive: 2 → 1) | `20px` |
| `.grid-2` | 2 (responsive: 1) | `20px` |

---

## 5. Shadows

| Token | Value | Usage |
|---|---|---|
| `--shadow-soft` | `0 10px 25px rgba(0,0,0,0.05)` | Modals, dropdowns |
| `--shadow-card` | `0 8px 20px rgba(0,0,0,0.06)` | Default card shadow |

---

## 6. Animation & Motion

All animations must be **CSS-only** (no JavaScript animation libraries) to ensure
compatibility with **Cloudflare Pages** (static delivery, no Node.js runtime on the edge).

| Interaction | Duration | Easing |
|---|---|---|
| Hover colour change | `200ms` | `ease` |
| Button press (scale) | `100ms` | `ease` |
| Sidebar transition | `300ms` | `ease` |
| Modal/panel enter | `220ms` | `cubic-bezier(0.16,1,0.3,1)` |
| Fade-in on load | `400ms` | `ease-out` |
| Slide-up on load | `350ms` | `cubic-bezier(0.16,1,0.3,1)` |

### Keyframes (defined in `styles.css`)
- `@keyframes fadeIn` — opacity 0 → 1
- `@keyframes slideUp` — translateY(16px) → 0 + opacity 0 → 1
- `@keyframes pulse` — subtle scale pulse for notification badges

---

## 7. Component Catalogue

### Sidebar
- Width: `250px` (collapsed: `64px` on mobile — hidden on `≤768px`)
- Background: `#ffffff`
- Active item: filled `--primary` bg, white text
- Hover item: `--primary-soft` bg, `--primary` text

### Topbar
- Height: `70px`, background `#fff`, bottom border `--border-light`
- Left: page title + search box
- Right: notification bell (with badge), user avatar

### Cards
- White background, `--radius-lg`, `--shadow-card`, `22px` padding
- Header row: title (left) + action link (right)

### Stat Cards
- Same card base + icon block (52×52, `--radius-md`) + details column
- Icon colour sets: `green`, `yellow`, `red`, `blue` (see CSS)

### Buttons
| Class | Style |
|---|---|
| `.btn-primary` | Filled `--primary`, white text |
| `.btn-soft` | `--primary-soft` bg, `--primary` text |
| `.btn-accent` | `--accent` bg, dark text |
| `.btn-danger` | `#FDECEA` bg, `--danger` text |
| `.btn-sm` | Compact padding (`7px 14px`) |

### Tags / Pills
`.tag-green`, `.tag-yellow`, `.tag-red`, `.tag-blue` — inline pill badges.

### Forms
- Input padding: `12px 14px`, border `--border-light`, focus ring `--primary-soft`
- Labels: `13px`, weight `500`, colour `--text-muted`

### Messaging (new in v1.1)
- Chat list panel: `320px` left column, white bg, border-right
- Message bubble (outbound): `--primary` bg, white text, radius `18px 18px 4px 18px`
- Message bubble (inbound): `#F3F4F6` bg, `--text-main` text, radius `18px 18px 18px 4px`
- Group badge: pill showing member count

### Timeline (new in v1.1)
- Post card: white card, full-width, `--radius-lg`, `--shadow-card`
- Leader badge: `--primary` bg, white text, `role: "Leader"` label
- Reaction bar: emoji reactions row at card footer
- Leader-only compose bar: shown only when `data-role="leader"` on `<body>`

---

## 8. Cloudflare Compatibility Rules

> These rules apply to **every** file in this repository.

1. **No Node.js / server-side rendering** — all HTML files are static; JS is plain ES5/ES6 with no bundler.
2. **No npm dependencies in the browser bundle** — use CDN links (Google Fonts is the only external dependency currently allowed).
3. **All API calls must target Cloudflare Worker endpoints** (`/api/*` routes defined in `wrangler.toml`).
4. **No `localStorage` for sensitive data** — use Cloudflare KV via the Worker API for session tokens.
5. **Images must be served from the repo root or Cloudflare Images** — no base64-embedded large images.
6. **CSS animations only** — no GSAP, Framer Motion, or other animation libraries.
7. **Forms must `fetch()` to Worker endpoints** — no traditional form POST that requires server rendering.
8. **`Content-Security-Policy`** headers are managed via `_headers` file (Cloudflare Pages feature).

---

## 9. File Structure

```
WorkDesk/
├── DESIGN_SYSTEM.md        ← this file (design protection)
├── wrangler.toml           ← Cloudflare Workers/Pages config
├── _headers                ← Cloudflare Pages HTTP headers
├── login.html              ← Login / sign-in page
├── dashboard.html          ← Main HRIS dashboard
├── messaging.html          ← Direct & group messaging
├── timeline.html           ← Company-wide timeline feed
├── Baground theme login page .png   ← Login background image
└── assets/
    ├── css/
    │   └── styles.css      ← All styles (single stylesheet, CSS variables)
    └── js/
        ├── dashboard.js    ← Dashboard interactivity
        ├── messaging.js    ← Messaging UI logic
        └── timeline.js     ← Timeline UI logic
```

---

## 10. Do & Don't

### ✅ Do
- Always use CSS variables from `:root` for colours, radii, and shadows.
- Keep all pages self-contained (HTML + `<link>` to `assets/css/styles.css`).
- Write animations as CSS keyframes in `styles.css`.
- Use semantic HTML5 elements (`<main>`, `<aside>`, `<header>`, `<nav>`, etc.).
- Ensure all interactive elements have `aria-label` attributes.
- Test on Cloudflare Pages preview before merging.

### ❌ Don't
- Don't introduce new colour hex values without adding them as CSS tokens first.
- Don't use `!important` unless overriding a browser default.
- Don't add npm packages or a build step — this is intentionally zero-build.
- Don't change the Inter font family without updating this document.
- Don't break the glassmorphism login card design.
- Don't add server-side templating (Handlebars, Jinja, etc.).
