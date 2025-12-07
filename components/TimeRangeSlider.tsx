"use client";
import { useEffect, useMemo, useState } from "react";

// 48 шагов по 30 минут (сутки)
const STEPS = 48;
function stepToHHMM(step: number) {
  const minutes = step * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")}`;
}

export default function TimeRangeSlider({
  onChange, busyRanges
}: {
  onChange: (startHHMM: string, endHHMM: string) => void;
  busyRanges: { startsAt: string; endsAt: string }[];
}) {
  const [startStep, setStartStep] = useState(16); // 08:00
  const [endStep, setEndStep] = useState(20);     // 10:00

  useEffect(() => {
    onChange(stepToHHMM(startStep), stepToHHMM(endStep));
  }, [startStep, endStep, onChange]);

  // Подсветка занятых интервалов
  const blocked = useMemo(() => {
    const map = new Array(STEPS).fill(false);
    busyRanges.forEach(r => {
      const s = new Date(r.startsAt);
      const e = new Date(r.endsAt);
      const startStep = s.getUTCHours() * 2 + (s.getUTCMinutes() >= 30 ? 1 : 0);
      const endStep   = e.getUTCHours() * 2 + (e.getUTCMinutes() >= 30 ? 1 : 0);
      for (let i = startStep; i < endStep; i++) map[i] = true;
    });
    return map;
  }, [busyRanges]);

  const durationHours = useMemo(() => (endStep - startStep) * 0.5, [startStep, endStep]);
  const durationOk = durationHours >= 1 && durationHours <= 12;

  return (
    <div className="mt-6">
      <div className="text-xs mb-2" style={{ color: "#9aa0a6" }}>
        Интервал: {stepToHHMM(startStep)} — {stepToHHMM(endStep)} ({durationHours.toFixed(1)} ч)
      </div>

      <div className="relative h-14 bg-[#141414] rounded-xl overflow-hidden shadow-inner">
        {/* Фон шкалы */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} style={{
              width: `${100 / STEPS}%`,
              background: blocked[i] ? "rgba(255,80,80,0.25)" : "transparent",
              borderRight: "1px solid #1f1f1f"
            }} />
          ))}
        </div>

        {/* Выбранный диапазон */}
        <div
          className="absolute top-2 bottom-2 rounded-lg"
          style={{
            left: `${(startStep / STEPS) * 100}%`,
            width: `${((endStep - startStep) / STEPS) * 100}%`,
            background: "linear-gradient(135deg, #d4ff00, #00ff66)",
            boxShadow: "0 0 25px rgba(212,255,0,0.4)",
            transition: "left .2s ease, width .2s ease"
          }}
        />

        {/* Ручки */}
        <div
          className="absolute top-1 bottom-1 w-4 rounded-full cursor-pointer"
          style={{
            left: `${(startStep / STEPS) * 100}%`,
            background: "radial-gradient(circle at 30% 30%, #d4ff00, #00ff66)",
            boxShadow: "0 0 12px rgba(212,255,0,0.8)",
            transition: "left .2s ease"
          }}
        />
        <div
          className="absolute top-1 bottom-1 w-4 rounded-full cursor-pointer"
          style={{
            left: `${(endStep / STEPS) * 100}%`,
            background: "radial-gradient(circle at 30% 30%, #d4ff00, #00ff66)",
            boxShadow: "0 0 12px rgba(212,255,0,0.8)",
            transition: "left .2s ease"
          }}
        />

        {/* Невидимые input range для управления */}
        <input
          type="range" min={0} max={STEPS} value={startStep}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!blocked[val] && val < endStep) setStartStep(val);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <input
          type="range" min={0} max={STEPS} value={endStep}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (!blocked[val] && val > startStep) setEndStep(val);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      {!durationOk && (
        <div className="mt-2 text-xs" style={{ color: "#ff7777" }}>
          Минимум 1 час, максимум 12 часов.
        </div>
      )}
    </div>
  );
}
