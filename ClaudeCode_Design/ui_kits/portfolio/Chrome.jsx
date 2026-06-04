// Chrome.jsx — Nav + Logo + Footer. Always default-mode chrome, never
// recolored by project takeover. Glass over whatever's behind it.

function Logo() {
  return (
    <a
      href="#home"
      onClick={(e) => { e.preventDefault(); window.go("home"); }}
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 8,
        fontFamily: "var(--font-display)",
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: "-0.02em",
        color: "var(--fg)",
        textDecoration: "none",
        borderBottom: "none",
      }}
    >
      <span>Max DeSouza</span>
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "var(--fg)",
          transform: "translateY(-1px)",
        }}
      />
    </a>
  );
}

function Nav({ route, onNavigate }) {
  // The home icon alternates to hint that Home is a swipe feed — a quiet
  // visual nudge. Swaps every ~2s.
  const [pulse, setPulse] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setPulse((p) => (p + 1) % 2), 2000);
    return () => clearInterval(t);
  }, []);

  const tabs = [
    { id: "home",     label: "Home",     icon: pulse === 0 ? "house" : "pointer" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "me",       label: "Me",       icon: "user-round" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        gap: 4,
        padding: 6,
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--r-pill)",
        backdropFilter: "blur(20px) saturate(160%)",
        WebkitBackdropFilter: "blur(20px) saturate(160%)",
        boxShadow: "var(--shadow-1)",
      }}
    >
      {tabs.map((t) => {
        const active = route === t.id || (route === "case-study" && t.id === "projects");
        return (
          <NavIconTab
            key={t.id}
            label={t.label}
            icon={t.icon}
            active={active}
            onClick={() => onNavigate(t.id)}
          />
        );
      })}
    </nav>
  );
}

/* Icon-only nav tab. Tooltip with the label appears on hover, beneath the
   pill, after a quiet beat. Cross-fades when the icon name changes. */
function NavIconTab({ icon, label, active, onClick }) {
  const [hover, setHover] = React.useState(false);
  // Re-mount the icon on name change so opacity transition restarts.
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={label}
      style={{
        position: "relative",
        width: 40,
        height: 40,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: active ? "var(--glass-bg-active)" : "transparent",
        color: "var(--glass-fg)",
        border: "none",
        borderRadius: "var(--r-pill)",
        cursor: "pointer",
      }}
    >
      <span
        key={icon}
        style={{
          display: "inline-flex",
          animation: "navIconFade 320ms cubic-bezier(0.16, 1, 0.3, 1) both",
        }}
      >
        <Icon name={icon} size={18} />
      </span>
      <span
        style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          left: "50%",
          transform: `translateX(-50%) translateY(${hover ? 0 : -4}px)`,
          padding: "6px 10px",
          background: "var(--fg)",
          color: "var(--bg)",
          fontFamily: "var(--font-body)",
          fontSize: 12,
          fontWeight: 500,
          letterSpacing: "0.02em",
          borderRadius: "var(--r-xs)",
          whiteSpace: "nowrap",
          opacity: hover ? 1 : 0,
          pointerEvents: "none",
          transition:
            "opacity var(--dur-2) var(--ease-out) 120ms, " +
            "transform var(--dur-2) var(--ease-out) 120ms",
          zIndex: 50,
        }}
      >
        {label}
      </span>
    </button>
  );
}

function LocationBadge() {
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        left: "clamp(20px, 4vw, 48px)",
        zIndex: 99,
        fontFamily: "var(--font-body)",
        fontWeight: 300,
        fontSize: 12,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: "var(--glass-fg)",
        opacity: 0.65,
      }}
    >
      Toronto · 2025
    </div>
  );
}

function Footer() {
  return (
    <footer
      style={{
        padding: "var(--s-7) clamp(20px, 5vw, 96px)",
        borderTop: "1px solid var(--border)",
        display: "flex",
        flexWrap: "wrap",
        gap: 24,
        justifyContent: "space-between",
        alignItems: "baseline",
      }}
    >
      <div className="meta" style={{ color: "var(--fg-faint)" }}>
        © 2025 — Max DeSouza
      </div>
      <div style={{ display: "flex", gap: 24 }}>
        <a href="mailto:hello@maxdesouza.design" className="meta" style={{ borderBottom: "none", color: "var(--fg-muted)" }}>
          hello@maxdesouza.design
        </a>
        <a href="#" className="meta" style={{ borderBottom: "none", color: "var(--fg-muted)" }}>
          LinkedIn
        </a>
        <a href="#" className="meta" style={{ borderBottom: "none", color: "var(--fg-muted)" }}>
          Read.cv
        </a>
      </div>
    </footer>
  );
}

Object.assign(window, { Logo, Nav, NavIconTab, Footer, LocationBadge });
