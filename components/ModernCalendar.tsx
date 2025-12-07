"use client";
import { useEffect, useRef, useState } from "react";

function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function ModernCalendar({
  value,
  onChange,
  maxDaysAhead = 60,
  inline = false,
}: {
  value: string;
  onChange: (isoDate: string) => void;
  maxDaysAhead?: number;
  inline?: boolean;
}) {
  const [open, setOpen] = useState(inline);
  const [current, setCurrent] = useState<Date>(value ? new Date(value) : new Date());
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inline) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [inline]);

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDaysAhead);

  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
  const startWeekday = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();

  const isDisabled = (d: Date) => d < new Date(today.toDateString()) || d > maxDate;

  return (
    <div className="calendar calendar--v3" ref={ref}>
      {!inline && (
        <button className="input w-full text-left" onClick={() => setOpen((o) => !o)}>
          {value || "Выберите дату"}
        </button>
      )}

      {(open || inline) && (
        <div className="calendar__panel calendar__panel--v3">
          <div className="calendar__header">
            <button className="tox-button tox-button--sm" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}>←</button>
            <div className="calendar__title">
              {current.toLocaleString("ru-RU", { month: "long", year: "numeric" })}
            </div>
            <button className="tox-button tox-button--sm" onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}>→</button>
          </div>

          <div className="calendar__week">
            {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => <div key={d} className="calendar__weekday">{d}</div>)}
          </div>

          <div className="calendar__grid">
            {Array.from({ length: startWeekday }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(current.getFullYear(), current.getMonth(), i + 1);
              const disabled = isDisabled(date);
              const active = value === toISO(date);
              return (
                <button
                  key={i}
                  className={`calendar__day calendar__day--v3 ${active ? "calendar__day--active" : ""}`}
                  disabled={disabled}
                  onClick={() => {
                    onChange(toISO(date));
                    if (!inline) setOpen(false);
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
