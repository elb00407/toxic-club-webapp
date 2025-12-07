"use client";
import { useEffect, useState } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<{ id: string; username?: string } | null>(null);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const initEl = document.getElementById("__initData") as HTMLInputElement | null;
    const initData = initEl?.value || "";
    if (initData) {
      setUser({ id: "tg", username: undefined });
      setReady(true);
      return;
    }
    const raw = localStorage.getItem("toxicskill_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setReady(true);
        return;
      } catch {}
    }
    setReady(true);
  }, []);

  const register = () => {
    const u = { id: `local-${Date.now()}`, username: nickname || undefined };
    localStorage.setItem("toxicskill_user", JSON.stringify(u));
    setUser(u);
  };

  if (!ready) return null;
  if (!user) {
    return (
      <div className="card">
        <div className="grid-header">
          <div className="grid-title">Вход</div>
          <div className="grid-subtitle">Если вы вышли из Telegram, создайте локальный профиль</div>
        </div>
        <div style={{ display: "grid", gap: "10px", maxWidth: 360 }}>
          <input className="input" placeholder="Никнейм (необязательно)" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          <button className="tox-button" onClick={register}>Войти</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
