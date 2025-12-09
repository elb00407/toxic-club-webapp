"use client";
import { useEffect, useState } from "react";

type Booking = { id: string; pcId: string; label: string; ts: number };
type User = { id: string; nickname: string };

export default function ProfileHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"day" | "night">("day");

  useEffect(() => {
    try {
      const rawB = localStorage.getItem("toxicskill_bookings");
      const rawU = localStorage.getItem("toxicskill_user");
      const rawT = localStorage.getItem("toxicskill_theme");
      setBookings(rawB ? JSON.parse(rawB) : []);
      setUser(rawU ? JSON.parse(rawU) : null);
      const t = rawT === "night" ? "night" : "day";
      setTheme(t);
      applyTheme(t);
    } catch {
      setBookings([]);
      setUser(null);
    }
  }, []);

  const applyTheme = (t: "day" | "night") => {
    const el = document.documentElement;
    if (t === "night") el.setAttribute("data-theme", "night");
    else el.removeAttribute("data-theme");
    localStorage.setItem("toxicskill_theme", t);
  };

  const toggleTheme = () => {
    const next = theme === "night" ? "day" : "night";
    setTheme(next);
    applyTheme(next);
  };

  const clearHistory = () => {
    localStorage.removeItem("toxicskill_bookings");
    setBookings([]);
    showToast("История очищена");
  };

  const showToast = (msg: string) => {
    const id = `toast-${Date.now()}`;
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    el.id = id;
    container.appendChild(el);
    setTimeout(() => el.classList.add("toast--show"), 10);
    setTimeout(() => {
      el.classList.remove("toast--show");
      setTimeout(() => el.remove(), 200);
    }, 2000);
  };

  return (
    <div>
      <div className="profile-header">
        <div className="profile-id">
          <div className="profile-label">Ник</div>
          <div className="profile-value">{user?.nickname ?? "—"}</div>
        </div>
        <div className="profile-actions">
          <button className="tox-button tox-button--ghost" onClick={toggleTheme}>
            Тема: {theme === "night" ? "Ночь" : "День"}
          </button>
          <button className="tox-button tox-button--ghost" onClick={clearHistory}>
            Очистить историю
          </button>
        </div>
      </div>

      <div className="grid-header">
        <div className="grid-title">История броней</div>
        <div className="grid-subtitle">Последние операции</div>
      </div>

      {bookings.length === 0 ? (
        <div className="muted">История пуста. Сделайте первую бронь.</div>
      ) : (
        <ul className="history-list">
          {bookings
            .slice()
            .reverse()
            .map((i) => (
              <li key={i.id} className="history-item">
                <span className="history-label">{i.label}</span>
                <span className="history-date">{new Date(i.ts).toLocaleString("ru-RU")}</span>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
