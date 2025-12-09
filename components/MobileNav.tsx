"use client";
export default function MobileNav({ onNavigate }: { onNavigate: (tab: "home" | "book" | "profile") => void }) {
  return (
    <nav className="mobile-nav">
      <button className="mobile-nav__btn" onClick={() => onNavigate("home")}>Главная</button>
      <button className="mobile-nav__btn" onClick={() => onNavigate("book")}>Бронь</button>
      <button className="mobile-nav__btn" onClick={() => onNavigate("profile")}>Профиль</button>
    </nav>
  );
}
