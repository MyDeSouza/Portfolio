// data.js — sample project data for the portfolio kit
// Each project supplies its own `project` color (the dominant takeover
// color) and optional `displayFont` / `bodyFont` overrides (Google Font
// names; loaded on demand in case-study scope).

window.PROJECTS = [
  {
    slug: "cadence",
    title: "Cadence",
    subtitle: "Internal tooling that surfaces files in place — so people stop tab-hopping to find what they already have.",
    role: "Product UX · Thesis",
    year: "2024",
    duration: "8 months",
    team: "Solo",
    // Earth-horizon gradient — black space, deep ocean blue, atmosphere, white glow.
    // When `projectGradient` is set, it overrides the solid `project` for the
    // page background and cover tile. Glass alphas still read against it fine.
    project: "#03050a",
    projectFg: "#ffffff",
    projectGradient: "linear-gradient(180deg, #ffffff 0%, #dbeafe 7%, #3b82f6 22%, #1e3a8a 42%, #0a1530 72%, #03050a 100%)",
    summary: "A thesis project on reducing redundant navigation, switching, and stitching across enterprise tools. Cadence sits between the file and the worker.",
    tagline: "Surfacing files in place.",
  },
  {
    slug: "pay",
    title: "Pay",
    subtitle: "A wallet that hands you the right card before you reach for it.",
    role: "Product UX",
    year: "2024",
    duration: "5 months",
    team: "3 designers, 4 engineers",
    project: "#0eb5d6",
    projectFg: "#ffffff",
    summary: "New forms of payment in digital wallets — surfacing the right account, the right currency, the right method, at the right counter.",
    tagline: "The right card, ready first.",
  },
  {
    slug: "mode",
    title: "Mode",
    subtitle: "Travel, one screen. A multi-modal transit app that hands you the next step without making you ask.",
    role: "Product UX",
    year: "2023",
    duration: "4 months",
    team: "2 designers",
    project: "#ffb400",
    projectFg: "#ffffff",
    summary: "A travel application that moves users easily between different forms of transit. One unified screen for what was three apps.",
    tagline: "Travel, one screen.",
  },
  {
    slug: "cf-welcomes",
    title: "CF Welcomes",
    subtitle: "Welcoming new Canadians into their spaces. Positioning malls as third spaces first.",
    role: "Brand UX",
    year: "2023",
    duration: "3 months",
    team: "Studio of 4",
    // Cadillac Fairview — a lighter, more buoyant blue.
    project: "#2e7ce8",
    projectFg: "#ffffff",
    summary: "A brand and wayfinding effort that re-frames Cadillac Fairview properties as third spaces for newcomers — places to gather before they're places to shop.",
    tagline: "Malls as third spaces.",
  },
  {
    slug: "toronto-parks",
    title: "Toronto Parks Trail",
    subtitle: "Driving new users to places and parks in Toronto. McCaul/Orde Parkette and the wider trail brand.",
    role: "Brand Design",
    year: "2022",
    duration: "6 months",
    team: "Studio of 3",
    // Pastel sage — air, not forest.
    project: "#a8d5a8",
    projectFg: "#ffffff",
    summary: "Wayfinding and identity for a network of small parks in Toronto, with McCaul/Orde Parkette as the anchor pilot.",
    tagline: "Driving people to parks.",
  },
];

window.SKILLS = [
  { group: "Product",   items: ["Product UX", "Interaction design", "Prototyping (Figma, code)", "Design systems"] },
  { group: "Research",  items: ["Generative interviews", "Concept testing", "Usability studies", "Synthesis"] },
  { group: "Brand",     items: ["Identity", "Wayfinding", "Editorial layout"] },
  { group: "Craft",     items: ["HTML / CSS", "React (prototypes)", "Motion", "Type"] },
];

window.EXPERIENCE = [
  { role: "Product UX Designer", org: "Independent", years: "2024 — Now", note: "Selected client work in payments and internal tooling." },
  { role: "Design Intern",       org: "Cadillac Fairview", years: "2023", note: "Brand UX on CF Welcomes; wayfinding pilots." },
  { role: "BDes, Industrial",    org: "OCAD University", years: "2020 — 2024", note: "Thesis: Cadence." },
];
