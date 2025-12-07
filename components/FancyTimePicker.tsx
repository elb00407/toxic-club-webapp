"use client";
import { useEffect, useMemo, useRef, useState } from "react";

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
  defaultStartStep = 18,
  defaultDurationH = 2,
}: {
  onChange: (startHHMM: string, endHHMM: string) => void;
  busyRanges: BusyRange[];
  maxHours: number;
  defaultStartStep?: number;
  defaultDurationH?: number;
}) {
  const STEPS = 48;
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

  const durationSteps = Math.max(2, Math.min(Math.round(durationH * 2), maxHours * 2));
  const endStep = Math.min(startStep + durationSteps, STEPS);

  useEffect(() => {
    onChange(toHHMM(startStep), toHHMM(endStep));
  }, [startStep, endStep, onChange]);

  const trackRef = useRef<HTMLDivElement | null>(null);

  const changeStart = (val: number) => {
    const v = Math.max(0, Math.min(STEPS - durationSteps, val));
    setStartStep(v);
  };

  const onTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const step = Math.floor((x / rect.width) * (STEPS - durationSteps));
    changeStart(step);
  };

  const durations = [1, 2, 3, 4, 5, 6, 7, 8].filter((h) => h <= maxHours);

  return (
    <div className="fancy-time">
      <div className="fancy-time__header">
        <div>
          <div className="fancy-time__label">Начало</div>
          <div className="fancy-time__value">{toHHMM(startStep)}</div>
        </div>
        <div>
          <div className="fancy-time__label">Длительность</div>
          <div className="chips">
            {durations.map((h) => (
              <button
                key={h}
                className={`chip ${h === durationH ? "chip--active" : ""}`}
                onClick={() => setDurationH(h)}
              >
                {h} ч
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="fancy-time__label">Конец</div>
          <div className="fancy-time__value">{toHHMM(endStep)}</div>
        </div>
      </div>

      <div className="fancy-time__track" ref={trackRef} onClick={onTrackClick}>
        <div className="fancy-time__grid">
          {Array.from({ length: STEPS }).map((_, i) => (
            <div key={i} className={`fancy-time__cell ${blocked[i] ? "fancy-time__cell--busy" : ""}`} />
          ))}
        </div>

        <div
          className="fancy-time__range"
          style={{ left: `${(startStep / STEPS) * 100}%`, width: `${((endStep - startStep) / STEPS) * 100}%` }}
        />

        <div className="fancy-time__handle" style={{ left: `calc(${(startStep / STEPS) * 100}% - 16px)` }} />
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
