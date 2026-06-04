// App.jsx — top-level router for the kit.
// Routes: home | projects | me | case-study.
// We deliberately don't use React Router — this is a kit demo, not a prod
// app. State + url hash is enough to feel like a real product.

function App() {
  const [route, setRoute] = React.useState("home");
  const [slug, setSlug]   = React.useState(null);

  const go = (r, s = null) => {
    setRoute(r);
    setSlug(s);
    const hash = r === "case-study" ? `case/${s}` : r;
    history.replaceState(null, "", "#" + hash);
    // Editorial transitions: scroll back to top on route change unless
    // we're on Home (which manages its own scroll snap).
    if (r !== "home") window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Expose for inter-component nav (Logo, etc.)
  React.useEffect(() => { window.go = go; }, []);

  // Hash boot
  React.useEffect(() => {
    const h = location.hash.replace(/^#/, "");
    if (h.startsWith("case/")) { go("case-study", h.slice(5)); }
    else if (["home","projects","me"].includes(h)) { go(h); }
  }, []);

  const onOpen   = (slug) => go("case-study", slug);
  const onSeeAll = ()      => go("projects");

  return (
    <React.Fragment>
      <LocationBadge />
      <Nav route={route} onNavigate={(t) => go(t)} />
      <div
        key={route + (slug || "")}
        className="route-enter"
        style={{
          // Body's bg is masked by an injected transparent rule in the
          // preview environment — paint bg here so project-mode takeover
          // is visible. Reads --project-bg (which may be a gradient) when
          // in project mode; otherwise falls back to --bg.
          background: "var(--project-bg, var(--bg))",
          color: "var(--fg)",
          minHeight: "100vh",
          transition:
            "background-color var(--dur-3) var(--ease-in-out), " +
            "color var(--dur-3) var(--ease-in-out)",
        }}
      >
        {route === "home"       && <Home onOpen={onOpen} onSeeAll={onSeeAll} />}
        {route === "projects"   && <Projects onOpen={onOpen} />}
        {route === "me"         && <Me />}
        {route === "case-study" && <CaseStudy slug={slug} onBack={() => go("projects")} />}
      </div>
    </React.Fragment>
  );
}

window.App = App;
