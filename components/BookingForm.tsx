"use client";
import { useMemo, useState } from "react";

export default function BookingForm({
  pcId,
  platform,
  onCancel,
  onBooked,
}: {
  pcId: string;
  platform: "PC" | "PS5";
  onCancel: () => void;
  onBooked: (orderId: string, hours: number, dateISO: string, timeStart: number) => void;
}) {
  const [dateISO, setDateISO] = useState<string>(new Date().toISOString().slice(0, 10));
  const [timeStart, setTimeStart] = useState<number>(12);
  const [hours, setHours] = useState<number>(2);

  const maxDuration = platform === "PS5" ? 7 : 8;

  const submit = () => {
    const orderId = `order-${pcId}-${Date.now()}`;
    onBooked(orderId, hours, dateISO, timeStart);
  };

  const presetDate = (daysFromToday: number) => {
    const t = new Date();
    t.setDate(t.getDate() + daysFromToday);
    setDateISO(t.toISOString().slice(0, 10));
  };

  const countdownLabel = useMemo(() => {
    const endHour = timeStart + hours;
    return `Сессия: ${timeStart}:00 → ${endHour}:00`;
  }, [timeStart, hours]);

  const hourMarks = Array.from({ length: 14 }, (_, i) => 10 + i); // 10..23

  return (
    <div className="booking-grid">
      <div className="field">
        <label className="field-label">Дата</label>
        <div className="calendar__panel">
          <input type="date" className="input" value={dateISO} onChange={(e) => setDateISO(e.target.value)} />
          <div className="preset-buttons" style={{ marginTop: 8 }}>
            <button className="tox-button tox-button--ghost" onClick={() => presetDate(0)}>Сегодня</button>
            <button className="tox-button tox-button--ghost" onClick={() => presetDate(1)}>Завтра</button>
            <button className="tox-button tox-button--ghost" onClick={() => presetDate(2)}>+2 дня</button>
          </div>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Время начала: {timeStart}:00</label>
        <div className="slider-panel">
          <input type="range" className="slider" min={10} max={23} step={1} value={timeStart} onChange={(e) => setTimeStart(Number(e.target.value))} />
          <div className="slider-scale">
            {hourMarks.map((h) => (
              <span key={h} style={{ width: "calc(100% / 14)", textAlign: "center", fontSize: 11 }}>{h}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="field">
        <label className="field-label">Длительность: {hours} ч</label>
        <input type="range" className="slider" min={1} max={maxDuration} step={1} value={hours} onChange={(e) => setHours(Number(e.target.value))} />
        <div className="slider-scale"><span>1 ч</span><span>—</span><span>{maxDuration} ч</span></div>
      </div>

      <div className="grid-subtitle">{countdownLabel}</div>

      <div className="booking-actions">
        <button className="tox-button" onClick={submit}>Забронировать</button>
        <button className="tox-button tox-button--ghost" onClick={onCancel}>Вернуться</button>
      </div>
    </div>
  );
}
