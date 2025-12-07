"use client";
import { useEffect, useState } from "react";

export default function WebAppShell({ children }: { children: React.ReactNode }) {
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
      <div className={`tox-brand ${isMobile ? "tox-brand-static" : "tox-brand-animated"}`}>toxicskill</div>
      <div className="container">{children}</div>
      {/* initData будет вставлен ботом */}
      <input id="__initData" type="hidden" />
    </div>
  );
}
