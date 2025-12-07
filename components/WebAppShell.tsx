"use client";
import { useEffect, useState } from "react";

declare global { interface Window { Telegram?: any; } }

export default function WebAppShell({ children }: { children: React.ReactNode }) {
  const [initData, setInitData] = useState<string>("");

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    tg?.ready();
    tg?.expand();
    setInitData(tg?.initData || "");
  }, []);

  return (
    <div>
      <input type="hidden" value={initData} id="__initData" />
      {children}
    </div>
  );
}
