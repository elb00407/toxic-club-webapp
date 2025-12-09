"use client";
import { useState } from "react";

export default function MobileNav({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [active, setActive] = useState("home");

  const click = (tab: string) => {
    setActive(tab);
    onNavigate(tab);
  };

  return (
    <nav className="mobile-nav">
      <button
        className={`mobile-nav__btn ${active === "home" ? "active" : ""}`}
        onClick={() => click("home")}
      >
        🏠 Домой
      </button>
      <button
        className={`mobile-nav__btn ${active === "book" ? "active" : ""}`}
        onClick={() => click("book")}
      >
        📅 Бронь
      </button>
      <button
        className={`mobile-nav__btn ${active === "profile" ? "active" : ""}`}
        onClick={() => click("profile")}
      >
        👤 Профиль
      </button>
    </nav>
  );
}
