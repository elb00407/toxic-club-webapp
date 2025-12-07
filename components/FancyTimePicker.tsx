"use client";
import { useEffect, useMemo, useState } from "react";

type BusyRange = { startsAt: string; endsAt: string };

function toHHMM(step: number) {
  const minutes = step * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function FancyTimePicker({
  onChange,
  busyRanges,
  maxHours,
  defaultStartStep = 16, // 08:00
  defaultDurationH = 2,
}: {
  onChange: (startHHMM: string, endHHMM: string) => void;
  busyRanges: BusyRange[];
  maxHours: number;
  defaultStartStep?: number;
  defaultDurationH?: number;
}) {
  const STEPS = 48; // каждые 30 минут
  const [startStep, setStartStep] = useState(defaultStartStep);
  const [durationH, setDurationH] = useState(defaultDurationH);

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

  const durationSteps = Math.max(2, Math.min(Math.round(durationH * 2), maxHours * 2)); // минимум 1 час
  const endStep = Math.min(startStep + durationSteps, STEPS);

  useEffect(() => {
    // если пересекается со занятостью, сдвигаем старт вперёд до ближайшего окна
    let conflict = false;
    for (let i = startStep; i < endStep; i++) {
      if (blocked[i]) { conflict = true; break; }
    }
    if (conflict) {
      let s = startStep;
      while (s + durationSteps <= STEPS) {
        let bad = false;
        for (let i = s; i < s + durationSteps; i++) if (blocked[i]) { bad = true; break; }
        if (!bad) { setStartStep(s); return; }
        s++;
      }
    }
  }, [blocked, startStep, endStep, durationSteps]);

  useEffect(() => {
    onChange(toHHMM(startStep), toHHMM(endStep));
  }, [startStep, endStep, onChange]);

  const changeStart = (val: number) => {
    const v = Math.max(0, Math.min(STEPS - durationSteps, val));
    setStartStep(v);
  };

  const durations = [1, 2, 3, 4, 5, 6, 7, 8].filter((h) => h <= maxHours);

  return (
    <div className="fancy-time">
      <div className="fancy-time__header">
        <span className="fancy-time__label">Начало</span>
        <span className="fancy-time__value">{toHHMM(startStep)}</span>
        <span className="fancy-time__label">Длительность</span>
        <div className="fancy-time__chips">
          {durations.map((h) => (
            <button key={h} className={`chip ${h === durationH ? "chip--active" : ""}`} onClick={() => setDurationH(h)}>
              {h} ч
            </button>
          ))}
        </div>
        <span className="fancy-time__label">Конец</span>
        <span className="fancy-time__value">{toHHMM(endStep)}</span>
      </div>

      <div className="fancy-time__track">
        <div className="fancy-time__grid">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className="fancy-time__cell" style={{ background: blocked[i] ? "rgba(255,80,80,0.18)" : "transparent" }} />
          ))}
        </div>

        <div className="fancy-time__range" style={{ left: `${(startStep / STEPS) * 100}%`, width: `${((endStep - startStep) / STEPS) * 100}%` }} />

        <div className="fancy-time__handle" style={{ left: `calc(${(startStep / STEPS) * 100}% - 14px)` }} />

        <input
          type="range"
          min={0}
          max={STEPS - durationSteps}
          value={startStep}
          onChange={(e) => changeStart(Number(e.target.value))}
          className="fancy-time__input"
          aria-label="Выбор времени начала"
        />
      </div>
    </div>
  );
}
