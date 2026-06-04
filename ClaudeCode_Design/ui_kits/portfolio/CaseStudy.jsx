// CaseStudy.jsx — demonstrates project-mode takeover.
// The outermost wrapper sets data-mode="project" and inline-styles
// --project + --project-fg. Every glass control + text color in the kit
// reads from these.
//
// To prove the type-override mechanic: each project may name a Google
// Font under `displayFont` / `bodyFont`. We inject it on mount via a
// dynamic <link> and set --font-project-display / --font-project-body
// on the wrapper element so only this scope picks it up — the nav and
// footer remain in Outfit / Urbanist.

function useProjectFont(displayFont, bodyFont) {
  React.useEffect(() => {
    const families = [];
    if (displayFont) families.push(displayFont.replace(/ /g, "+") + ":wght@400;500;600;700");
    if (bodyFont && bodyFont !== displayFont) families.push(bodyFont.replace(/ /g, "+") + ":wght@400;500;600;700");
    if (!families.length) return;
    const href = "https://fonts.googleapis.com/css2?" + families.map((f) => "family=" + f).join("&") + "&display=swap";
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    return () => { document.head.removeChild(link); };
  }, [displayFont, bodyFont]);
}

function CaseStudy({ slug, onBack }) {
  const project = window.PROJECTS.find((p) => p.slug === slug) || window.PROJECTS[0];
  useProjectFont(project.displayFont, project.bodyFont);

  // When this component mounts, flip the document into project mode.
  // When it unmounts, flip back to default mode.
  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-mode", "project");
    html.style.setProperty("--project", project.project);
    html.style.setProperty("--project-fg", project.projectFg || "#ffffff");
    // Gradients take precedence — paint them on the route container's
    // background via a custom property the App reads.
    if (project.projectGradient) {
      html.style.setProperty("--project-bg", project.projectGradient);
    } else {
      html.style.setProperty("--project-bg", project.project);
    }
    if (project.displayFont) html.style.setProperty("--font-project-display", `"${project.displayFont}", "Urbanist", system-ui, sans-serif`);
    if (project.bodyFont)    html.style.setProperty("--font-project-body",    `"${project.bodyFont}", "Outfit", system-ui, sans-serif`);
    return () => {
      html.setAttribute("data-mode", "default");
      html.style.removeProperty("--project");
      html.style.removeProperty("--project-fg");
      html.style.removeProperty("--project-bg");
      html.style.removeProperty("--font-project-display");
      html.style.removeProperty("--font-project-body");
    };
  }, [project]);

  return (
    <main
      style={{
        minHeight: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "calc(64px + var(--s-7)) clamp(20px, 5vw, 96px) var(--s-7)",
      }}
    >
      {/* Back — quiet, top-left */}
      <div
        style={{
          position: "absolute",
          top: "calc(var(--s-7) + 64px)",
          left: "clamp(20px, 5vw, 96px)",
        }}
      >
        <IconButton name="arrow-left" label="Back" onClick={onBack} />
      </div>

      {/* Centered name + tagline */}
      <h1
        style={{
          margin: 0,
          fontFamily: "var(--font-project-display)",
          fontWeight: 500,
          fontSize: "clamp(72px, 12vw, 200px)",
          lineHeight: 0.94,
          letterSpacing: "-0.04em",
          color: "var(--fg)",
        }}
      >
        {project.title}
      </h1>

      {project.tagline && (
        <p
          style={{
            margin: "24px 0 0",
            fontFamily: "var(--font-project-body)",
            fontWeight: 400,
            fontSize: "clamp(16px, 1.4vw, 20px)",
            lineHeight: 1.4,
            color: "var(--fg)",
            opacity: 0.78,
            maxWidth: "28ch",
          }}
        >
          {project.tagline}
        </p>
      )}

      {/* Quiet CTA cluster, bottom-center */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(var(--s-7))",
          display: "flex",
          gap: 12,
          alignItems: "center",
        }}
      >
        <GlassButton icon="external-link" size="sm">Visit</GlassButton>
        <GlassButton icon="file-text" size="sm">Read</GlassButton>
      </div>
    </main>
  );
}

Object.assign(window, { CaseStudy });
