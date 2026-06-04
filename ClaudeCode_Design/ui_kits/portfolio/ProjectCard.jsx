// ProjectCard.jsx — used in the Projects grid and as the "highlight" card
// on Home.
//
// The card shows ONLY the meta label above the cover at rest. The cover
// is a flat tile of the project's color (or gradient). On hover, the
// project name + a one-sentence tagline fade in at the bottom-left of
// the cover. Cover radius is intentionally tight (2px) — barely there,
// so the work is the shape, not the frame.

function ProjectCover({ project, aspect = "4 / 3", radius = "2px", revealed = false }) {
  // For mostly-light tones (parks pastel, etc.) flip the reveal text dark.
  const fg = project.projectFg || "#fff";
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: aspect,
        background: project.projectGradient || project.project,
        borderRadius: radius,
        overflow: "hidden",
        border: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 20,
          bottom: 18,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 6,
          color: fg,
          opacity: revealed ? 1 : 0,
          transform: `translateY(${revealed ? 0 : 6}px)`,
          transition:
            "opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), " +
            "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            fontSize: "clamp(24px, 3vw, 36px)",
            letterSpacing: "-0.022em",
            lineHeight: 1,
            color: fg,
          }}
        >
          {project.title}
        </span>
        {project.tagline && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.4,
              maxWidth: "24ch",
              color: fg,
            }}
          >
            {project.tagline}
          </span>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen }) {
  const [hover, setHover] = React.useState(false);
  return (
    <article
      onClick={() => onOpen(project.slug)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <span
        className="meta"
        style={{
          fontWeight: 400,
          color: "var(--fg-faint)",
          alignSelf: "flex-start",
        }}
      >
        {project.year} · {project.role}
      </span>
      <ProjectCover project={project} revealed={hover} />
    </article>
  );
}

Object.assign(window, { ProjectCover, ProjectCard });
