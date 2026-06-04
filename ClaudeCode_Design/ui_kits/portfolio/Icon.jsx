// Icon.jsx — thin-line icon component using Lucide via CDN.
// Usage: <Icon name="arrow-up-right" size={18} />
// Wraps Lucide's <i data-lucide=""> pattern and calls createIcons on mount.

function Icon({ name, size = 18, strokeWidth = 1.25, style = {}, className = "" }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && ref.current) {
      window.lucide.createIcons({
        attrs: { "stroke-width": strokeWidth, width: size, height: size },
        nameAttr: "data-lucide",
        icons: window.lucide.icons,
      });
    }
  }, [name, size, strokeWidth]);

  return (
    <i
      ref={ref}
      data-lucide={name}
      className={className}
      style={{
        display: "inline-flex",
        width: size,
        height: size,
        color: "currentColor",
        ...style,
      }}
    />
  );
}

window.Icon = Icon;
