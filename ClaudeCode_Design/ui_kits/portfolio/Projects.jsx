// Projects.jsx — index of all projects.
// Mobile: 1 column. Desktop: 2-column grid (the brief said "2 by however
// many"). On very wide screens it relaxes to 3.

function Projects({ onOpen }) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "calc(64px + var(--s-9)) clamp(20px, 5vw, 96px) var(--s-9)",
      }}
    >
      <header style={{ marginBottom: 64, maxWidth: 1240, margin: "0 auto var(--s-8) auto" }}>
        <div className="meta" style={{ marginBottom: 20, color: "var(--fg-faint)" }}>
          Projects · {window.PROJECTS.length}
        </div>
        <h1 style={{ margin: 0, maxWidth: "16ch" }}>Selected work, 2022 — 2024.</h1>
      </header>

      <div
        className="projects-grid"
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
          gap: "clamp(32px, 4vw, 64px)",
        }}
      >
        {window.PROJECTS.map((p) => (
          <ProjectCard key={p.slug} project={p} onOpen={onOpen} />
        ))}
      </div>

      <Footer />
    </main>
  );
}

Object.assign(window, { Projects });
