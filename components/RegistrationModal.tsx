"use client";
import { useEffect, useState } from "react";
import { LocalUser, saveUser } from "@/lib/auth";

export default function RegistrationModal({ onClose }: { onClose: () => void }) {
  const [nickname, setNickname] = useState("");
  const [telegram, setTelegram] = useState("");
  const [error, setError] = useState<string | null>(null);

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
      setError("Введите ник (минимум 2 символа)");
      return;
    }
    const normalizedTg = tg ? (tg.startsWith("@") ? tg : `@${tg}`) : undefined;

    const user: LocalUser = {
      id: `u-${Date.now()}`,
      nickname: nick,
      telegram: normalizedTg,
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
          <div id="reg-title" className="grid-title">Добро пожаловать</div>
          <div className="grid-subtitle">Создайте локальный профиль, чтобы начать</div>
        </div>
        <div className="modal__content">
          <label className="field-label">Ник</label>
          <input
            className="input"
            value={nickname}
            onChange={(e) => { setNickname(e.target.value); setError(null); }}
            placeholder="Например, ToxicMaster"
          />

          <label className="field-label" style={{ marginTop: 12 }}>Telegram (для доступа к админке)</label>
          <input
            className="input"
            value={telegram}
            onChange={(e) => setTelegram(e.target.value)}
            placeholder="@MAKS_LAVROW"
          />

          {error ? <div className="muted" style={{ color: "var(--danger)", marginTop: 6 }}>{error}</div> : null}

          <div className="booking-actions" style={{ marginTop: 16 }}>
            <button className="tox-button" onClick={submit}>Продолжить</button>
            <button className="tox-button tox-button--ghost" onClick={onClose}>Отмена</button>
          </div>
        </div>
      </div>
    </div>
  );
}
