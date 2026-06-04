# Max DeSouza Design System

> A neutral, translucent design language for a product / brand UX portfolio.
> The system disappears so the work can speak.

This is the design system for **Max DeSouza Design** — a personal portfolio
showcasing product UX, brand UX, and marketing work. The visual language is
modelled less on any single agency's aesthetic and more on the *posture* of a
trade-show booth or an editorial gallery: **white walls in the in-between
space, full takeover when you're inside the work.**

---

## The core idea

There are two modes, and every component in the system reads from them.

| | **Default mode** | **Project mode** |
|---|---|---|
| Where it lives | Home, Projects index, Me, navigation chrome | Inside a project case study |
| Background | Cool off-white (`#f7f9fc`) | The project's dominant color (full bleed) |
| Ink | Cool near-black `#0c1116` | White |
| Buttons / chips / inputs | Subtle dark tint on white | **Translucent glass** — white at 10–26% over the project color, with `backdrop-filter: blur` so the project bleeds through every control |
| Typography | Urbanist (display) + Outfit (body) | Same — *unless* the project supplies its own type, in which case the project case study scope overrides `--font-project-display` and `--font-project-body`. Nav and global chrome never swap. |

The mechanic is implemented as CSS custom properties in
[`colors_and_type.css`](./colors_and_type.css). A project page sets
`data-mode="project"` on the root and inline-styles `--project: <hex>;` —
every glass surface, border, hover state and focus ring updates from those
two values.

---

## Index — what's in this folder

```
README.md                     ← you are here
SKILL.md                      ← agent-skill entry point
colors_and_type.css           ← canonical token + type file
fonts/                        ← Outfit + Urbanist (variable + static)
preview/                      ← cards for the Design System tab
ui_kits/
  portfolio/
    README.md                 ← kit-level notes
    index.html                ← interactive walkthrough
    *.jsx                     ← components (Nav, GlassButton, etc.)
assets/                       ← logo, icons, project covers
```

There is one UI kit — **portfolio** — covering all three surfaces
(Home, Projects, Me) plus a sample project page demonstrating the takeover.

---

## Sources & context

The brand owner is **Max DeSouza**, a product UX designer. Provided materials:

- **Fonts:** Outfit (variable + static, weights 100–900) and Urbanist (variable
  + italic variable + static, weights 100–900). Both SIL OFL 1.1 — see
  [`fonts/OFL.txt`](./fonts/OFL.txt).
- **Sample projects** (from the briefing) used to demo project-mode takeover:
  - **Cadence** — thesis project, internal system that surfaces files for
    employees to reduce redundant navigation, switching, stitching.
  - **Pay** — payment wallet UX, digital payment flows.
  - **Mode** — multi-modal travel application; moving between transit forms.
  - **CF Welcomes** — welcoming new Canadians, positioning malls as third
    spaces.
  - **McCaul Orde Parkette / City of Toronto Parks Trail** — brand design,
    driving new users to parks in Toronto.

No codebase, Figma file, or production design system was provided — this
system is the first one. If you have an existing portfolio repo or Figma,
attach it via the Import menu and I'll reconcile.

---

## CONTENT FUNDAMENTALS

**Voice.** First person, lowercase confidence. No exclamation marks. No "I'm
passionate about..." filler. Sentences are short and end on the noun, not the
adjective. The work does the talking; the writing names the work and gets
out of the way.

**Casing.**
- Project titles: Title Case (`Cadence`, `CF Welcomes`).
- Section labels / eyebrows: ALL CAPS, tracked +14% (`SELECTED WORK`,
  `ROLE`, `YEAR`).
- Body copy and CTAs: sentence case (`See the project`, not `See The Project`).
- Years and numbers: never spelled out — `2024`, `3 months`, `2 designers`.

**Tone.**
- *Editorial, not promotional.* Frame projects like an exhibition wall label,
  not a pitch.
- *Specific, not heroic.* "Reduced switching across 4 tools" > "transformed
  the workflow".
- *Plain.* Avoid "leverage", "passionate", "ecosystem", "delightful". Avoid
  em-dash word salads. Avoid AI-flavoured tricolons.

**Person.** First person ("I designed", "I worked with…") in the Me tab and
in project intros. Project descriptions on cards are written in third-person
sentence fragments ("A wallet that…", "A travel app for…").

**Emoji / unicode.** None. The brand is neutral; emoji are noise.

**Examples (good).**
> Cadence  
> A thesis project. Internal tooling that surfaces files in
> place — so people stop tab-hopping to find what they already have.  
> Role: Product UX · 2024

> Mode  
> Travel, one screen. A multi-modal transit app that hands you the next
> step without making you ask.

**Examples (avoid).**
> 🚀 Cadence is an INNOVATIVE solution that leverages AI to revolutionize
> how teams collaborate — delightful, scalable, and human-centered!

---

## VISUAL FOUNDATIONS

### Color
Two modes, described above. The default neutral set is intentionally narrow
and intentionally **cool** — a slight blue undertone runs through every grey
so the page reads awake rather than somber. `#f7f9fc` paper, `#ffffff`
surface, `#0c1116` ink, three blue-leaning greys (`#3a414d`, `#7a818e`,
`#bdc2cb`), two hairline lines (`#e6e9ef`, `#d2d6de`). No accent in default
mode — the system is colorless until a project loads. In project mode the
project color *is* the palette; everything else is white-on-color at varying
alpha.

### Typography
- **Display: Urbanist** at 500 weight. Tight tracking (`-0.022em` at h1,
  `-0.025em` at hero). Used for project titles, section headers, hero copy.
  Urbanist reads with more confidence at display sizes — its tight apertures
  and humanist forms give the page a presence without shouting.
- **Body: Outfit** at 400 / 500 / 600. Set at 17/26 for paragraphs, 14/21
  for meta. Outfit's open counters and even rhythm hold up at small sizes.
- **Mono:** system stack (`ui-monospace`) — only for code samples, never UI.
- **Eyebrows / labels:** Outfit 500 12px, `letter-spacing: 0.14em`,
  uppercased. This is the only place we type-case.
- **Project type override:** a case-study scope can override
  `--font-project-display` / `--font-project-body`. Nav, footer, and global
  chrome never participate in the swap.

### Spacing
4pt base scale: `4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128`. Section
padding on desktop is `var(--s-9)` (96px) vertical, `var(--s-7)` (48px)
horizontal. Snap sections on Home are full-viewport-height with content
centered.

### Backgrounds
- Default: flat cool off-white. No gradients, no textures.
- Project mode: flat project color, full-bleed. No gradients.
- Full-bleed project imagery is allowed *inside* a case study but should be
  treated as content, not chrome.
- Never use a gradient as decoration. Never repeating patterns.

### Animation
Editorial. Slow and considered.
- Durations: `180ms` (hover), `320ms` (state), `520ms` (page transitions),
  `840ms` (hero reveal staggers).
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for "out" (entrances) and
  `cubic-bezier(0.65, 0, 0.35, 1)` for "in-out" (mode swaps).
- Project-mode transition: `background-color` and `color` cross-fade across
  `var(--dur-3)` — the page literally pours into the new palette.
- No bounces. No springs. No parallax effects that twitch.

### Hover & press
- Links: opacity 0.6 over 180ms.
- Glass controls: hover lifts the bg one alpha step
  (`0.10 → 0.18`); active lifts another (`0.26`) and scales `0.985`.
- Icons: hover reveals a quiet tooltip after `~200ms`; the icon itself
  doesn't change color.

### Borders
Hairline only — `1px` solid. In default mode use `--line` (`#e8e6df`); in
project mode borders are white at 14–28% alpha. Never use double-borders or
colored accent borders.

### Shadows
Three levels, all quiet:
- `--shadow-1` for resting cards (almost invisible).
- `--shadow-2` for hovered cards / modals.
- `--shadow-3` for floating UI / focused overlays.

In project mode the shadows lean black instead of warm-grey so they read
against saturated backgrounds.

### Transparency & blur
This is the system's signature.
- Every "greyscale" UI element in project mode is glass:
  `background: rgba(255,255,255, 0.10–0.26)` + `backdrop-filter: blur(14px)
  saturate(140%)`.
- Default mode glass is *dark on white* instead (rgba(14,14,14, 0.04–0.12)).
- Modals, sticky nav, tooltips, chips, buttons — all glass.
- Never apply blur to text containers larger than ~480px without testing
  perf on iOS Safari.

### Corner radii
Friendly bento — generous enough to feel modern, restrained enough to stay
editorial. `6px` for the smallest things (inputs, tiny chips), `10px` for
buttons and small cards, `12px` for project cards and panels, `16px` for
modals and containers, `24px` for hero containers, `999px` (`--r-pill`)
only for status chips and avatars. The system avoids rounded-pill buttons
in favour of the `10–12px` softness.

### Cards
- Default mode: 1px `--line` border, `--surface` (`#fff`) fill,
  `--r-md` (6px) radius, `--shadow-1` at rest, `--shadow-2` on hover.
- Project mode: glass (rgba white) instead of `--surface`, same radius,
  white border at 14% alpha.

### Layout rules
- Max content width: `1240px`.
- Side gutters: `clamp(20px, 5vw, 96px)`.
- Sticky nav is `64px` tall, always glass, always pinned.
- Home page is a `scroll-snap-type: y mandatory` column of full-viewport
  sections (Hero → Highlight → Skills → Experience → More projects).
- Projects index is `repeat(auto-fit, minmax(420px, 1fr))` — i.e. single
  column on mobile, two columns at ~880px+, three columns beyond `1240px`
  (rare).
- Me page is a single 720px-wide column for reading speed.

---

## ICONOGRAPHY

**Approach.** Thin, line-weight, generously padded. White (or `currentColor`)
fills, never multi-color. Always paired with a label or a tooltip — the icon
never carries meaning alone. Tap targets are at least `44×44`; the icon
itself sits at 18–20px inside that target.

**Set used.** [Lucide](https://lucide.dev) via CDN
(`https://unpkg.com/lucide@latest/dist/umd/lucide.js`), `stroke-width: 1.25`.
Lucide was chosen because:
- it has the thin/uniform stroke quality the brief calls for,
- it covers the utility set the portfolio needs (arrow, external, close,
  menu, sun/moon) without overshooting,
- it's CDN-friendly so the system doesn't ship its own icon font.

> **Substitution flagged:** if Max has his own custom icon marks, drop the
> SVGs into `assets/icons/` and the components in `ui_kits/portfolio/`
> will prefer them via the `<Icon name="...">` lookup.

**Tooltips.** All icon buttons render a label on hover after ~200ms via
the `<IconButton title="..."/>` component — see
`ui_kits/portfolio/IconButton.jsx`.

**Emoji.** Not used. Not in copy, not in UI.

**Unicode glyphs.** Allowed sparingly: `·` as a dot separator in metadata
(`2024 · Product UX · 3 months`), `→` only where it's part of a CTA label
(`See the project →`). The arrow glyph is preferred over an icon at small
sizes for inline use.

**Logo / wordmark.** A simple wordmark `Max DeSouza` set in Urbanist 600 at
tight tracking, sitting in the top-left of the nav. SVG version in
`assets/logo.svg`.

---

## How to use this system

If you're a designer or agent reading this to make something:

1. Drop `colors_and_type.css` into your file's `<head>`.
2. Set `data-mode="default"` on `<html>` for general pages, or
   `data-mode="project" style="--project: #c14a1a; --project-fg: #fff;"` to
   enter a case study.
3. Reach for the components in `ui_kits/portfolio/` — they read from the
   tokens, so they recolor automatically when you flip mode.
4. Match the voice rules in CONTENT FUNDAMENTALS.
5. When in doubt, less. The portfolio is a conduit.
