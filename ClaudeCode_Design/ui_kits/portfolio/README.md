# Portfolio UI Kit

Recreates Max DeSouza's portfolio as a click-thru prototype across three
surfaces — **Home**, **Projects**, **Me** — plus a sample **Case Study**
that demonstrates the project-mode color takeover.

## Files

| | |
|---|---|
| `index.html` | The kit's entry point. Loads React, Babel, Lucide, and every component below. Renders `<App />`. |
| `App.jsx` | Top-level router (`home / projects / me / case-study`). Hash-based, no React Router. |
| `data.js` | Sample project data (`PROJECTS`, `SKILLS`, `EXPERIENCE`). Edit here to swap content. |
| `Icon.jsx` | Lucide wrapper. Thin stroke (1.25). |
| `Controls.jsx` | `GlassButton`, `SolidButton`, `GhostButton`, `IconButton`, `Chip`. All read from CSS tokens. |
| `Chrome.jsx` | `Nav`, `Logo`, `Footer`. Always glass — never recolored by project mode (the brief). |
| `ProjectCard.jsx` | `ProjectCover` (a flat tile placeholder) + `ProjectCard` (cover + meta). |
| `Home.jsx` | The full vertical snap-scroll feed. Intro → Highlight → Skills → Experience → snap per project. |
| `Projects.jsx` | Index grid — `auto-fit, minmax(420px, 1fr)`. 1 col mobile, 2 desktop, 3 ultra-wide. |
| `Me.jsx` | About + Experience + Skills + Contact, single 720px column. |
| `CaseStudy.jsx` | Sets `data-mode="project"` on `<html>` and inlines `--project`. Every glass element recolors automatically. |

## How the takeover works

When `CaseStudy` mounts it sets:

```js
html.setAttribute("data-mode", "project");
html.style.setProperty("--project", project.project);
```

`colors_and_type.css` watches that attribute and remaps `--bg`, `--fg`,
`--glass-bg`, `--border` etc. Every component in the kit reads those vars,
so the recolor is automatic. The nav and footer use the `glass` mechanic
too, but their copy is always white — they look right against any
background.

The transition is intentionally slow (`var(--dur-3)` = 520ms) — the page
*pours* into the new palette rather than snapping.

## Known placeholders

- **Project covers** are flat color tiles right now. Drop real screenshots
  into `../../assets/covers/<slug>.jpg` and update `ProjectCover` to
  prefer them when present.
- **Logo** is a wordmark only. If Max has a custom mark, drop an SVG into
  `../../assets/logo.svg` and swap the `<Logo>` body.
- **Per-project type overrides** are wired but not used by any sample
  project. Set `displayFont` / `bodyFont` (any Google Font name) on a
  project in `data.js` to demo the swap.
