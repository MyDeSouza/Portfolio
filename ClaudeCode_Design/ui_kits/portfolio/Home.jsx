// Home.jsx — vertical snap-scroll "For You" feed.
// Each Section is a full-viewport panel; the container has
// scroll-snap-type: y mandatory so swipes/scrolls snap one panel at a
// time. Order: Intro → Highlight project → Skills → Experience → rest of
// projects (each as its own snap with two CTAs).

const SECTION = {
  height: "100vh",
  minHeight: 640,
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "var(--s-9) clamp(20px, 5vw, 96px)",
  position: "relative",
};

/* Full-bleed snap: the project's color/gradient fills the entire viewport,
   text sits CENTERED, white over the project. Used for both the Highlight
   slot and the rest-of-projects slots. */
const FULL_BLEED_SECTION = {
  height: "100vh",
  minHeight: 640,
  scrollSnapAlign: "start",
  scrollSnapStop: "always",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  padding: "var(--s-9) clamp(20px, 5vw, 96px)",
  position: "relative",
  // Negative margin trick to bleed past the page's bg. The Home scroll
  // container has no horizontal padding, so this just paints edge-to-edge.
  width: "100%",
};

function HomeIntro({ onSeeProjects }) {
  return (
    <section style={{ ...SECTION, justifyContent: "center" }}>
      <h1
        className="h-display"
        style={{
          margin: 0,
          fontSize: "clamp(72px, 12vw, 200px)",
          letterSpacing: "-0.04em",
          lineHeight: 0.92,
        }}
      >
        Max DeSouza
      </h1>
      <p
        className="body-lg"
        style={{
          marginTop: 32,
          maxWidth: "44ch",
          color: "var(--fg-muted)",
        }}
      >
        I am a product designer focused on user experience. I create interfaces
        that make everyday life better.
      </p>

      {/* Hint to scroll */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          color: "var(--fg-faint)",
        }}
      >
        <span className="meta">Scroll</span>
        <Icon name="arrow-down" size={16} />
      </div>
    </section>
  );
}

function HomeHighlight({ project, onOpen, onSeeAll }) {
  return <HomeProjectFullBleed project={project} onOpen={onOpen} onSeeAll={onSeeAll} eyebrow="Highlight" />;
}

/* Full-bleed project section: project bg fills the page, name + tagline
   sit centered, two quiet CTAs below. Used for highlight AND each rest
   project — they share the same layout (per the brief: "even with the
   highlight project"). */
function HomeProjectFullBleed({ project, onOpen, onSeeAll, eyebrow }) {
  const fg = project.projectFg || "#ffffff";
  return (
    <section
      style={{
        ...FULL_BLEED_SECTION,
        background: project.projectGradient || project.project,
        color: fg,
      }}
    >
      <span
        className="meta"
        style={{
          position: "absolute",
          top: "calc(var(--s-7) + 64px)",
          left: "clamp(20px, 5vw, 96px)",
          color: fg,
          opacity: 0.7,
        }}
      >
        {eyebrow || project.role}
      </span>

      <h2
        style={{
          margin: 0,
          fontFamily: "var(--font-display)",
          fontWeight: 500,
          fontSize: "clamp(72px, 11vw, 184px)",
          lineHeight: 0.94,
          letterSpacing: "-0.035em",
          color: fg,
        }}
      >
        {project.title}
      </h2>

      {project.tagline && (
        <p
          style={{
            margin: "20px 0 0",
            fontFamily: "var(--font-body)",
            fontWeight: 400,
            fontSize: 18,
            lineHeight: 1.4,
            color: fg,
            opacity: 0.78,
            maxWidth: "28ch",
          }}
        >
          {project.tagline}
        </p>
      )}

      <div style={{ marginTop: 40, display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
        <GlassButton onClick={() => onOpen(project.slug)} icon="arrow-up-right">
          See
        </GlassButton>
        <GlassButton onClick={onSeeAll}>All</GlassButton>
      </div>
    </section>
  );
}

function HomeSkills() {
  return (
    <section style={SECTION}>
      <div className="meta" style={{ marginBottom: 24, color: "var(--fg-faint)" }}>
        Skills
      </div>
      <h2 style={{ margin: 0, maxWidth: "20ch" }}>
        Product-shaped, with a brand background.
      </h2>
      <div
        style={{
          marginTop: 56,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 32,
        }}
      >
        {window.SKILLS.map((g) => (
          <div key={g.group}>
            <div className="meta" style={{ marginBottom: 12, color: "var(--fg-faint)" }}>{g.group}</div>
            <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
              {g.items.map((it) => (
                <li key={it} className="body" style={{ color: "var(--fg)" }}>{it}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function HomeExperience() {
  return (
    <section style={SECTION}>
      <div className="meta" style={{ marginBottom: 24, color: "var(--fg-faint)" }}>
        Experience
      </div>
      <h2 style={{ margin: 0, maxWidth: "18ch" }}>
        Three places, one habit.
      </h2>
      <div
        style={{
          marginTop: 56,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {window.EXPERIENCE.map((x, i) => (
          <div
            key={x.role}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr 1fr",
              gap: 32,
              padding: "24px 0",
              borderTop: i === 0 ? "1px solid var(--border)" : "none",
              borderBottom: "1px solid var(--border)",
              alignItems: "baseline",
            }}
          >
            <div className="meta" style={{ color: "var(--fg-faint)" }}>{x.years}</div>
            <div>
              <div className="h4" style={{ marginBottom: 4 }}>{x.role}</div>
              <div className="body-sm" style={{ color: "var(--fg-muted)" }}>{x.org}</div>
            </div>
            <p className="body-sm" style={{ margin: 0, color: "var(--fg-muted)" }}>{x.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* Alias — the rest of the project snaps reuse the same full-bleed layout. */
function HomeProjectSnap({ project, onOpen, onSeeAll }) {
  return <HomeProjectFullBleed project={project} onOpen={onOpen} onSeeAll={onSeeAll} />;
}

function Home({ onOpen, onSeeAll }) {
  const [highlight, ...rest] = window.PROJECTS;
  return (
    <div
      style={{
        height: "100vh",
        overflowY: "auto",
        scrollSnapType: "y mandatory",
        scrollBehavior: "smooth",
      }}
    >
      <HomeIntro onSeeProjects={onSeeAll} />
      <HomeHighlight project={highlight} onOpen={onOpen} onSeeAll={onSeeAll} />
      <HomeSkills />
      <HomeExperience />
      {rest.map((p) => (
        <HomeProjectSnap key={p.slug} project={p} onOpen={onOpen} onSeeAll={onSeeAll} />
      ))}
      <section style={{ ...SECTION, height: "auto", minHeight: "auto", padding: 0 }}>
        <Footer />
      </section>
    </div>
  );
}

Object.assign(window, { Home });
