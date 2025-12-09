"use client";
export default function MobileNav({ onNavigate, active }: { onNavigate: (tab: "home" | "book" | "profile" | "leaderboard" | "admin") => void; active: string }) {
  const btn = (tab: string, label: string) => (
    <button className={`mobile-nav__btn ${active === tab ? "active" : ""}`} onClick={() => onNavigate(tab as any)}>
      {label}
    </button>
  );
  return (
    <nav className="mobile-nav">
      {btn("home", "Главная")}
      {btn("book", "Бронь")}
      {btn("profile", "Профиль")}
      {btn("leaderboard", "Лидерборд")}
      {btn("admin", "Админ")}
    </nav>
  );
}
