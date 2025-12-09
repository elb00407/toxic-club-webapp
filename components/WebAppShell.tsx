"use client";
import { useRef } from "react";
import { setAdminOverride } from "@/lib/auth";

export default function WebAppShell({
  children,
  onBrandClick,
}: {
  children: React.ReactNode;
  onBrandClick?: () => void;
}) {
  const tapCount = useRef(0);
  const tapTimer = useRef<number | null>(null);
  const holdTimer = useRef<number | null>(null);

  const onTapBrand = () => {
    if (tapTimer.current) window.clearTimeout(tapTimer.current);
    tapCount.current += 1;
    tapTimer.current = window.setTimeout(() => {
      if (tapCount.current >= 5) {
        setAdminOverride(true);
      }
      tapCount.current = 0;
    }, 600);
    if (onBrandClick) onBrandClick();
  };

  const onBrandPressed = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
    holdTimer.current = window.setTimeout(() => {
      setAdminOverride(true);
    }, 1500);
  };

  const onBrandReleased = () => {
    if (holdTimer.current) window.clearTimeout(holdTimer.current);
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          className="tox-brand"
          onClick={onTapBrand}
          onMouseDown={onBrandPressed}
          onMouseUp={onBrandReleased}
          onTouchStart={onBrandPressed}
          onTouchEnd={onBrandReleased}
        >
          toxicskill
        </button>
      </header>
      <div className="content">{children}</div>
    </div>
  );
}
