---
name: max-desouza-design
description: Use this skill to generate well-branded interfaces and assets for Max DeSouza Design — a neutral, translucent product UX portfolio system — either for production or throwaway prototypes/mocks. Contains essential design guidelines, colors, type tokens, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `README.md` file within this skill, and explore the other available files.

The system has two modes you must always preserve when designing inside it:

- **default** — white walls, ink type. Used for the in-between space: nav,
  home, projects index, the "Me" page. Calm and almost-invisible.
- **project** — full takeover. The page background becomes the project's
  dominant color; every "greyscale" UI element becomes translucent glass
  (white at 10–26% over the project color, with a `backdrop-filter: blur`).

Set the mode via `data-mode="default" | "project"` on `<html>` and inline-style
`--project: <hex>; --project-fg: #fff;` to pick the takeover color. Every
component in `ui_kits/portfolio/` reads from CSS custom properties and
recolors automatically.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy
assets out of this folder and create static HTML files for the user to view.
The canonical token + type file is `colors_and_type.css`. The fonts live in
`fonts/` — Outfit (display) and Urbanist (body), both SIL OFL 1.1.

If working on production code, you can copy assets and read the rules in
`README.md` to become an expert in designing with this brand. Pay particular
attention to the **CONTENT FUNDAMENTALS** and **VISUAL FOUNDATIONS** sections
— the voice and motion rules are as important as the color tokens.

If the user invokes this skill without any other guidance, ask them what they
want to build or design, ask some questions, and act as an expert designer
who outputs HTML artifacts _or_ production code, depending on the need.
