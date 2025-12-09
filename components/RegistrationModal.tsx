"use client";
import { useEffect, useState } from "react";
import { LocalUser, saveUser } from "@/lib/auth";

export default function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const submit = () => {
    const ph = phone.replace(/\D/g, "").trim();
    const fn = firstName.trim();
    const ln = lastName.trim();
    if (ph.length < 4 || fn.length < 1 || ln.length < 1) {
      setError("Введите последние 4 цифры телефона и первые буквы имени/фамилии");
      return;
    }
    const code = `${ph.slice(-4)}${fn[0].toUpperCase()}${ln[0].toUpperCase()}`;
    const user: LocalUser = {
      id: `u-${Date.now()}`,
      nickname: code,
      createdAt: Date.now(),
    };
    saveUser(user);
    onClose();
  };

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reg-title">
      <div className="modal__backdrop" onClick={onClose} />
      <div className="modal__dialog">
        <div className="modal__header">
          <div id="reg-title" className="grid-title">Регистрация</div>
          <div className="grid-subtitle">Код формата 4047ЕВ</div>
        </div>
        <div className="modal__content">
          <label className="field-label">Телефон (последние 4 цифры)</label>
          <input className="input" value={phone} onChange={(e) => { setPhone(e.target.value); setError(null); }} placeholder="4047" />
          <label className="field-label" style={{ marginTop: 12 }}>Имя (первая буква)</label>
          <input className="input" value={firstName} onChange={(e) => { setFirstName(e.target.value); setError(null); }} placeholder="Е" />
          <label className="field-label" style={{ marginTop: 12 }}>Фамилия (первая буква)</label>
          <input className="input" value={lastName} onChange={(e) => { setLastName(e.target.value); setError(null); }} placeholder="В" />
          {error && <div className="muted" style={{ color: "var(--danger)" }}>{error}</div>}
          <div className="booking-actions" style={{ marginTop: 16 }}>
            <button className="tox-button" onClick={submit}>Сохранить</button>
            <button className="tox-button tox-button--ghost" onClick={onClose}>Отмена</button>
          </div>
        </div>
      </div>
    </div>
  );
}
