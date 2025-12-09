"use client";
import { useEffect, useState } from "react";
import { LocalUser, saveUser } from "@/lib/auth";

export default function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [nickname, setNickname] = useState("");
  const [telegram, setTelegram] = useState("");

  useEffect(() => {
    const body = document.body;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = "";
    };
  }, []);

  const submit = () => {
    const nick = nickname.trim();
    const tg = telegram.trim();
    if (!nick || nick.length < 2) {
      alert("Введите ник (минимум 2 символа)");
      return;
    }
    const user: LocalUser = {
      id: `u-${Date.now()}`,
      nickname: nick,
      telegram: tg ? (tg.startsWith("@") ? tg : `@${tg}`) : undefined,
      isAdmin: false, // вычисляется динамически через telegram в isAdmin()
      createdAt: Date.now(),
    };
    saveUser(user);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog">
        <div className="modal__header">
          <div className="grid-title">Регистрация</div>
          <div className="grid-subtitle">Локальное сохранение, без внешних сервисов</div>
        </div>
        <div className="modal__content">
          <label className="field-label">Ник</label>
          <input className="input" value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="Например, ToxicMaster" />

          <label className="field-label" style={{ marginTop: 12 }}>Telegram (необязательно)</label>
          <input className="input" value={telegram} onChange={(e) => setTelegram(e.target.value)} placeholder="@username" />

          <div className="booking-actions" style={{ marginTop: 16 }}>
            <button className="tox-button" onClick={submit}>Сохранить</button>
            <button className="tox-button tox-button--ghost" onClick={onClose}>Отмена</button>
          </div>
        </div>
      </div>
    </div>
  );
}
