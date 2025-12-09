"use client";
export default function WebAppShell({
  children,
  onBrandClick,
}: {
  children: React.ReactNode;
  onBrandClick?: () => void;
}) {
  return (
    <div className="app-shell">
      <header className="topbar">
        {/* Кнопка без обводки, анимированная, кликабельная */}
        <button className="tox-brand" onClick={onBrandClick}>
          <span className="tox-brand__glow">toxicskill</span>
        </button>
      </header>
      <div className="content">{children}</div>
    </div>
  );
}
