"use client";
import { useEffect, useMemo, useState } from "react";

type Booking = { id: string; pcId: string; label: string; ts: number; hours?: number; dateISO?: string; timeStart?: number };
type User = { id: string; nickname: string };

export default function ProfileHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"night-pro" | "neon-pulse" | "classic-clean" | "cyberpunk">("night-pro");

  useEffect(() => {
    const rawB = localStorage.getItem("toxicskill_bookings");
    const rawU = localStorage.getItem("toxicskill_user");
    const rawT = localStorage.getItem("toxicskill_theme");
    setBookings(rawB ? JSON.parse(rawB) : []);
    setUser(rawU ? JSON.parse(rawU) : null);
    const t = (rawT as typeof theme) ?? "night-pro";
    setTheme(t);
    applyTheme(t);
  }, []);

  const applyTheme = (t: typeof theme) => {
    const el = document.documentElement;
    el.setAttribute("data-theme", t);
    localStorage.setItem("toxicskill_theme", t);
  };

  const switchTheme = () => {
    const order: typeof theme[] = ["night-pro", "neon-pulse", "classic-clean", "cyberpunk"];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    applyTheme(next);
    showToast(`Тема: ${next}`);
  };

  const clearHistory = () => {
    localStorage.removeItem("toxicskill_bookings");
    setBookings([]);
    showToast("История очищена");
  };

  const showToast = (msg: string) => {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.classList.add("toast--show"), 10);
    setTimeout(() => {
      el.classList.remove("toast--show");
      setTimeout(() => el.remove(), 200);
    }, 2000);
  };

  const stats = useMemo(() => {
    const totalBookings = bookings.length;
    const totalHours = bookings.reduce((acc, b) => acc + (b.hours ?? 2), 0);
    const level = totalHours >= 50 ? "Legend" : totalHours >= 20 ? "Pro" : totalHours >= 10 ? "Regular" : "Newbie";
    const achievements = [
      totalHours >= 10 ? "10+ часов" : null,
      totalBookings >= 5 ? "5 броней" : null,
      totalBookings >= 1 ? "Первая бронь" : null,
    ].filter(Boolean) as string[];
    return { totalBookings, totalHours, level, achievements };
  }, [bookings]);

  return (
    <div>
      <div className="profile-header">
        <div className="profile-id">
          <div className="profile-label">Код</div>
          <div className="profile-value">{user?.nickname ?? "—"}</div>
        </div>
        <div className="profile-actions">
          <button className="tox-button tox-button--ghost" onClick={switchTheme}>Тема: {theme}</button>
          <button className="tox-button tox-button--ghost" onClick={clearHistory}>Очистить историю</button>
        </div>
      </div>

      <div className="card">
        <div className="grid-header">
          <div className="grid-title">Рейтинг</div>
          <div className="grid-subtitle">Ваш прогресс</div>
        </div>
        <div className="history-list">
          <div className="history-item"><span className="history-label">Броней</span><span className="history-date">{stats.totalBookings}</span></div>
          <div className="history-item"><span className="history-label">Часы</span><span className="history-date">{stats.totalHours}</span></div>
          <div className="history-item"><span className="history-label">Уровень</span><span className="history-date">{stats.level}</span></div>
        </div>
        {stats.achievements.length ? <div className="grid-subtitle" style={{ marginTop: 8 }}>Ачивки: {stats.achievements.join(" • ")}</div> : null}
      </div>

      <div className="grid-header" style={{ marginTop: 12 }}>
        <div className="grid-title">История броней</div>
        <div className="grid-subtitle">Последние операции</div>
      </div>

      {bookings.length === 0 ? (
        <div className="muted">История пуста. Сделайте первую бронь.</div>
      ) : (
        <ul className="history-list">
          {bookings.slice().reverse().map((i) => (
            <li key={i.id} className="history-item">
              <span className="history-label">{i.label}</span>
              <span className="history-date">
                {i.dateISO ?? new Date(i.ts).toISOString().slice(0, 10)} • {i.timeStart ?? "--"}:00
              </span>
            </li>
          ))}
        </ul>
      )}

      <div id="toast-container" className="toast-container" aria-live="polite" aria-atomic="true" />
    </div>
  );
}
