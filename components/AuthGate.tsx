"use client";
import { useEffect, useState } from "react";

type User = { id: string; nickname: string };

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // поля для регистрации
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("toxicskill_user");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as User;
        setUser(parsed);
      } catch {}
    }
    setReady(true);
  }, []);

  const generateNickname = () => {
    const digits = phone.slice(-4);
    const fn = firstName.trim().charAt(0).toUpperCase();
    const ln = lastName.trim().charAt(0).toUpperCase();
    return `${digits}${fn}${ln}`;
  };

  const register = () => {
    if (!phone || !firstName || !lastName || !password) {
      alert("Заполните все поля");
      return;
    }
    const nickname = generateNickname();
    const id = `local-${Date.now()}`;
    const u: User = { id, nickname };
    localStorage.setItem("toxicskill_user", JSON.stringify(u));
    setUser(u);
  };

  if (!ready) return null;
  if (!user) {
    return (
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-title">Регистрация в toxicskill</div>
          <div className="auth-subtitle">Введите данные для создания профиля</div>
        </div>
        <div className="auth-fields">
          <div className="field">
            <label className="field-label">Номер телефона</label>
            <input
              className="input"
              placeholder="Например: +375291234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">Имя</label>
            <input
              className="input"
              placeholder="Иван"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">Фамилия</label>
            <input
              className="input"
              placeholder="Васильев"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="field">
            <label className="field-label">Пароль</label>
            <input
              className="input"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="auth-actions">
          <button className="tox-button" onClick={register}>Зарегистрироваться</button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
