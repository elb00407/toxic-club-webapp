"use client";
import { useEffect, useState } from "react";

type User = { id: string; username?: string; email?: string };

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const initEl = document.getElementById("__initData") as HTMLInputElement | null;
    const initData = initEl?.value || "";

    if (initData) {
      setUser({ id: "telegram" });
      setReady(true);
      return;
    }

    const raw = localStorage.getItem("toxicskill_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
        setReady(true);
        return;
      } catch {}
    }
    setReady(true);
  }, []);

  const register = () => {
    const id = `local-${Date.now()}`;
    const u: User = { id, username: nickname || undefined, email: email || undefined };
    localStorage.setItem("toxicskill_user", JSON.stringify(u));
    setUser(u);
  };

  if (!ready) return null;
  if (!user) {
    return (
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Вход в toxicskill</div>
          <div className="auth-subtitle">Создайте локальный профиль, если вы не в Telegram</div>
        </div>
        <div className="auth-fields">
          <div className="field">
            <label className="field-label">Никнейм</label>
            <input className="input" placeholder="Например: tox-user" value={nickname} onChange={(e) => setNickname(e.target.value)} />
          </div>
          <div className="field">
            <label className="field-label">Email (необязательно)</label>
            <input className="input" type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>
        <div className="auth-actions">
          <button className="tox-button" onClick={register}>Войти</button>
          <div className="auth-hint">Данные хранятся локально на вашем устройстве.</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

