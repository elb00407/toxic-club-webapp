"use client";
import { useState } from "react";

export default function BookingForm({
  pcId,
  platform,
  onCancel,
  onBooked,
}: {
  pcId: string;
  platform: "PC" | "PS5";
  onCancel: () => void;
  onBooked: (orderId: string) => void;
}) {
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<number>(12);
  const [hours, setHours] = useState<number>(2);

  const maxDuration = platform === "PS5" ? 7 : 8;

  const submit = () => {
    if (!date) {
      alert("Выберите дату");
      return;
    }
    const orderId = `order-${pcId}-${Date.now()}`;
    onBooked(orderId);
  };

  return (
    <div className="booking-grid">
      <div className="field">
        <label className="field-label">Дата</label>
        <input
          type="date"
          className="input calendar-input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="field">
        <label className="field-label">Время начала: {time}:00</label>
        <input
          type="range"
          className="slider"
          min={10}
          max={23}
          value={time}
          onChange={(e) => setTime(Number(e.target.value))}
        />
      </div>

      <div className="field">
        <label className="field-label">Длительность: {hours} ч</label>
        <input
          type="range"
          className="slider"
          min={1}
          max={maxDuration}
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
        />
        <div className="preset-buttons">
          {[1, 2, 3].map((h) => (
            <button key={h} className="tox-button tox-button--ghost" onClick={() => setHours(h)}>
              {h} ч
            </button>
          ))}
        </div>
      </div>

      <div className="booking-actions">
        <button className="tox-button" onClick={submit}>Забронировать</button>
        <button className="tox-button tox-button--ghost" onClick={onCancel}>Вернуться</button>
      </div>
    </div>
  );
}
