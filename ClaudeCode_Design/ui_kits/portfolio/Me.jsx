// Me.jsx — fast, digestible about page. Single 720px column.

function Me() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "calc(64px + var(--s-9)) clamp(20px, 5vw, 96px) var(--s-9)",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div className="meta" style={{ marginBottom: 24, color: "var(--fg-faint)" }}>
          About
        </div>
        <h1 style={{ margin: 0 }}>
          Max DeSouza. Product UX designer in Toronto.
        </h1>

        <p className="body-lg" style={{ marginTop: 40, color: "var(--fg)" }}>
          I work on the parts of a product people don't notice until they
          break — file routing, payment selection, transit handoffs. My
          training is in industrial design at OCAD; my practice today is
          mostly screens, sometimes brand.
        </p>

        <p className="body" style={{ marginTop: 24 }}>
          I'm interested in interfaces that respect the time of the people
          using them. Less to read, less to click, less to remember. I think
          a portfolio should follow the same rule — so this one tries to.
        </p>

        {/* Experience */}
        <section style={{ marginTop: 80 }}>
          <div className="meta" style={{ marginBottom: 16, color: "var(--fg-faint)" }}>
            Experience
          </div>
          {window.EXPERIENCE.map((x, i) => (
            <div
              key={x.role}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr",
                gap: 24,
                padding: "20px 0",
                borderTop: i === 0 ? "1px solid var(--border)" : "none",
                borderBottom: "1px solid var(--border)",
                alignItems: "baseline",
              }}
            >
              <div className="meta" style={{ color: "var(--fg-faint)" }}>{x.years}</div>
              <div>
                <div className="h4" style={{ marginBottom: 2 }}>{x.role}</div>
                <div className="body-sm" style={{ color: "var(--fg-muted)" }}>{x.org}</div>
                <p className="body-sm" style={{ marginTop: 8, color: "var(--fg-muted)" }}>{x.note}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Skills */}
        <section style={{ marginTop: 64 }}>
          <div className="meta" style={{ marginBottom: 16, color: "var(--fg-faint)" }}>
            Skills
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 24,
            }}
          >
            {window.SKILLS.map((g) => (
              <div key={g.group}>
                <div className="h4" style={{ marginBottom: 8 }}>{g.group}</div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                  {g.items.map((it) => (
                    <li key={it} className="body-sm" style={{ color: "var(--fg-muted)" }}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section style={{ marginTop: 80 }}>
          <div className="meta" style={{ marginBottom: 16, color: "var(--fg-faint)" }}>
            Get in touch
          </div>
          <p className="body-lg">
            <a href="mailto:hello@maxdesouza.design">hello@maxdesouza.design</a>
            <br />
            Open to product UX roles, brand UX, and small studio collaborations.
          </p>
        </section>
      </div>

      <Footer />
    </main>
  );
}

Object.assign(window, { Me });
