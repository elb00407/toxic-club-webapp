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
        <button className="tox-brand" onClick={onBrandClick}>toxicskill</button>
      </header>
      <div className="content">{children}</div>
    </div>
  );
}
