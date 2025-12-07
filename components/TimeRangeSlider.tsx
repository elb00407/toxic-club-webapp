"use client";
import { useEffect, useMemo, useState } from "react";

const STEPS = 48; // 30-минутные шаги
function stepToHHMM(step: number) {
  const minutes = step * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function TimeRangeSlider({
  onChange,
  busyRanges,
  maxHours, // если указан, ограничиваем длительность
}: {
  onChange: (startHHMM: string, endHHMM: string) => void;
  busyRanges: { startsAt: string; endsAt: string }[];
  maxHours?: number;
}) {
  const [startStep, setStartStep] = useState(16); // 08:00
  const [endStep, setEndStep] = useState(20);     // 10:00

  useEffect(() => {
    onChange(stepToHHMM(startStep), stepToHHMM(endStep));
  }, [startStep, endStep, onChange]);

  const blocked = useMemo(() => {
    const map = new Array(STEPS).fill(false);
    busyRanges.forEach((r) => {
      const s = new Date(r.startsAt);
      const e = new Date(r.endsAt);
      const st = s.getUTCHours() * 2 + (s.getUTCMinutes() >= 30 ? 1 : 0);
      const en = e.getUTCHours() * 2 + (e.getUTCMinutes() >= 30 ? 1 : 0);
      for (let i = st; i < en; i++) map[i] = true;
    });
    return map;
  }, [busyRanges]);

  const hours = (endStep - startStep) * 0.5;
  const minHours = 1;
  const maxAllowed = maxHours ?? 12;
  const durationOk = hours >= minHours && hours <= maxAllowed;

  const setStartSafe = (val: number) => {
    if (!blocked[val] && val < endStep) setStartStep(val);
  };
  const setEndSafe = (val: number) => {
    if (!blocked[val] && val > startStep) setEndStep(val);
  };

  return (
    <div className="mt-6">
      <div className="text-xs mb-2" style={{ color: "#9aa0a6" }}>
        Интервал: {stepToHHMM(startStep)} — {stepToHHMM(endStep)} ({hours.toFixed(1)} ч){maxHours ? ` • максимум ${maxAllowed} ч` : ""}
      </div>

      <div className="relative h-16 bg-[#121317] rounded-xl overflow-hidden" style={{ border: "1px solid #202228" }}>
        {/* фон шкалы и занятость */}
        <div className="absolute inset-0 flex">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: `${100 / STEPS}%`,
                background: blocked[i] ? "rgba(255,80,80,0.18)" : "transparent",
                borderRight: "1px solid #1b1d22",
              }}
            />
          ))}
        </div>

        {/* выбранный диапазон */}
        <div
          className="absolute top-3 bottom-3 rounded-lg"
          style={{
            left: `${(startStep / STEPS) * 100}%`,
            width: `${((endStep - startStep) / STEPS) * 100}%`,
            background: "linear-gradient(135deg, var(--neon-1), var(--neon-2))",
            boxShadow: "0 0 28px rgba(0,255,102,.35)",
            transition: "left .2s ease, width .2s ease",
          }}
        />

        {/* ручки */}
        <div
          className="absolute top-1 bottom-1 w-6 rounded-full cursor-pointer"
          style={{
            left: `calc(${(startStep / STEPS) * 100}% - 12px)`,
            background: "radial-gradient(circle at 30% 30%, var(--neon-1), var(--neon-2))",
            boxShadow: "0 0 18px rgba(0,255,102,.55)",
            transition: "left .2s ease",
          }}
        />
        <div
          className="absolute top-1 bottom-1 w-6 rounded-full cursor-pointer"
          style={{
            left: `calc(${(endStep / STEPS) * 100}% - 12px)`,
            background: "radial-gradient(circle at 30% 30%, var(--neon-1), var(--neon-2))",
            boxShadow: "0 0 18px rgba(0,255,102,.55)",
            transition: "left .2s ease",
          }}
        />

        {/* невидимые инпуты */}
        <input
          type="range"
          min={0}
          max={STEPS}
          value={startStep}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val >= 0 && val < endStep) setStartSafe(val);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <input
          type="range"
          min={0}
          max={STEPS}
          value={endStep}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val > startStep && val <= STEPS) {
              // ограничение maxHours
              const nextHours = (val - startStep) * 0.5;
              if (nextHours <= maxAllowed) setEndSafe(val);
            }
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
      </div>

      {!durationOk && (
        <div className="mt-2 text-xs" style={{ color: "var(--danger)" }}>
          Минимум {minHours} час, максимум {maxAllowed} часов.
        </div>
      )}
    </div>
  );
}
