// Controls.jsx — buttons, chips, icon buttons.
// Every control reads from the global token scope, so all of them recolor
// automatically when `data-mode="project"` is set on <html>.

const controlBase = {
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 16,
  letterSpacing: "-0.005em",
  padding: "16px 28px",
  borderRadius: "var(--r-sm)",
  cursor: "pointer",
  textDecoration: "none",
  border: "1px solid transparent",
  transition:
    "background-color var(--dur-1) var(--ease-out), " +
    "color var(--dur-1) var(--ease-out), " +
    "border-color var(--dur-1) var(--ease-out), " +
    "transform var(--dur-1) var(--ease-out)",
  userSelect: "none",
  whiteSpace: "nowrap",
};

/* Glass — translucent, default control. Recolors via tokens. */
function GlassButton({ children, onClick, icon, href, style = {}, size = "md" }) {
  const sizeStyle =
    size === "lg" ? { padding: "20px 36px", fontSize: 17 } :
    size === "sm" ? { padding: "10px 18px",  fontSize: 13 } : {};

  const Tag = href ? "a" : "button";
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  return (
    <Tag
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        ...controlBase,
        ...sizeStyle,
        background:
          press ? "var(--glass-bg-active)" :
          hover ? "var(--glass-bg-hover)"  : "var(--glass-bg)",
        borderColor: "var(--glass-border)",
        color: "var(--glass-fg)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        transform: press ? "scale(0.985)" : "scale(1)",
        ...style,
      }}
    >
      {children}
      {icon && <Icon name={icon} size={16} />}
    </Tag>
  );
}

/* Solid — ink-on-paper in default mode, white-on-color in project mode. */
function SolidButton({ children, onClick, icon, href, style = {}, size = "md" }) {
  const sizeStyle =
    size === "lg" ? { padding: "20px 36px", fontSize: 17 } :
    size === "sm" ? { padding: "10px 18px",  fontSize: 13 } : {};

  const Tag = href ? "a" : "button";
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  return (
    <Tag
      href={href}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        ...controlBase,
        ...sizeStyle,
        background: "var(--accent)",
        color: "var(--accent-fg)",
        borderColor: "var(--accent)",
        opacity: hover ? 0.88 : 1,
        transform: press ? "scale(0.985)" : "scale(1)",
        ...style,
      }}
    >
      {children}
      {icon && <Icon name={icon} size={16} />}
    </Tag>
  );
}

/* Ghost — text + underline, no fill. */
function GhostButton({ children, onClick, icon, href, style = {} }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      href={href}
      onClick={onClick}
      style={{
        ...controlBase,
        background: "transparent",
        color: "var(--fg)",
        padding: "16px 0",
        borderBottom: "1px solid currentColor",
        borderRadius: 0,
        ...style,
      }}
    >
      {children}
      {icon && <Icon name={icon} size={16} />}
    </Tag>
  );
}

/* IconButton — square, glass, with hover-revealed tooltip. */
function IconButton({ name, label, onClick, size = 40 }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: hover ? "var(--glass-bg-hover)" : "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        borderRadius: "var(--r-sm)",
        color: "var(--glass-fg)",
        cursor: "pointer",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        transition: "background-color var(--dur-1) var(--ease-out)",
      }}
      aria-label={label}
    >
      <Icon name={name} size={18} />
      {/* Tooltip — fades in after a beat. */}
      <span
        style={{
          position: "absolute",
          top: "calc(100% + 8px)",
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
          transition: "opacity var(--dur-2) var(--ease-out) 120ms, transform var(--dur-2) var(--ease-out) 120ms",
          zIndex: 50,
        }}
      >
        {label}
      </span>
    </button>
  );
}

/* Chip — tiny status / category pill */
function Chip({ children, style = {} }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "7px 14px",
        background: "var(--glass-bg)",
        border: "1px solid var(--glass-border)",
        color: "var(--glass-fg)",
        borderRadius: "var(--r-pill)",
        fontFamily: "var(--font-body)",
        fontSize: 12,
        fontWeight: 400,
        letterSpacing: "0.02em",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        ...style,
      }}
    >
      {children}
    </span>
  );
}

Object.assign(window, { GlassButton, SolidButton, GhostButton, IconButton, Chip });
