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

  // Гарантируем, что initData не пустой (устранение ошибки initData обязателен)
  useEffect(() => {
    const el = document.getElementById("__initData") as HTMLInputElement | null;
    if (el && !el.value) {
      const localRaw = localStorage.getItem("toxicskill_user");
      const localId = localRaw ? (() => { try { return JSON.parse(localRaw)?.id || ""; } catch { return ""; } })() : "";
      el.value = `local:${localId || "guest"}`; // всегда будет непустой маркер
    }
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
      <input id="__initData" type="hidden" />
    </div>
  );
}
