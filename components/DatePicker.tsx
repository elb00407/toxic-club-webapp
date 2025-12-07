"use client";
import { useEffect, useRef, useState } from "react";

function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DatePicker({
  value,
  onChange,
  maxDaysAhead = 30,
}: {
  value: string;
  onChange: (isoDate: string) => void;
  maxDaysAhead?: number;
}) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<Date>(value ? new Date(value) : new Date());
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const firstDay = new Date(current.getFullYear(), current.getMonth(), 1);
  const startWeekday = firstDay.getDay(); // 0 Sun
  const daysInMonth = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();

  const today = new Date();
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDaysAhead);

  const isDisabled = (d: Date) => d < new Date(today.toDateString()) || d > maxDate;

  return (
    <div className="relative" ref={ref}>
      <button className="input w-full text-left" onClick={() => setOpen((o) => !o)}>
        {value || "Выберите дату"}
      </button>

      {open && (
        <div
          className="absolute z-40 mt-2 card"
          style={{ width: 300, animation: "fadeIn .15s ease" }}
        >
          <div className="flex items-center justify-between mb-3">
            <button
              className="tox-button"
              onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}
              style={{ padding: "6px 10px", fontSize: 12 }}
            >
              ←
            </button>
            <div className="text-sm font-semibold">
              {current.toLocaleString("ru-RU", { month: "long", year: "numeric" })}
            </div>
            <button
              className="tox-button"
              onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}
              style={{ padding: "6px 10px", fontSize: 12 }}
            >
              →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-xs" style={{ color: "#9aa0a6" }}>
            {["Пн","Вт","Ср","Чт","Пт","Сб","Вс"].map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-2 mt-2">
            {Array.from({ length: (startWeekday + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const date = new Date(current.getFullYear(), current.getMonth(), i + 1);
              const disabled = isDisabled(date);
              const active = value === toISO(date);
              return (
                <button
                  key={i}
                  className="input"
                  disabled={disabled}
                  onClick={() => {
                    onChange(toISO(date));
                    setOpen(false);
                  }}
                  style={{
                    padding: "8px",
                    borderRadius: 10,
                    background: active ? "linear-gradient(135deg, var(--neon-1), var(--neon-2))" : "#121317",
                    color: active ? "#0a0a0a" : "var(--text)",
                    opacity: disabled ? .45 : 1,
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
