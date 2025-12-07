"use client";
import { useEffect, useState } from "react";

export default function WebAppShell({
  children,
  onBrandClick,
}: {
  children: React.ReactNode;
  onBrandClick?: () => void;
}) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return (
    <div className="min-h-screen">
      <button
        className={`tox-brand ${isMobile ? "tox-brand-static" : "tox-brand-animated"}`}
        onClick={onBrandClick}
        aria-label="Вернуться на главную"
      >
        toxicskill
      </button>
      <div className="container">{children}</div>
      {/* Telegram WebApp initData будет проставлен сюда извне */}
      <input id="__initData" type="hidden" />
    </div>
  );
}
