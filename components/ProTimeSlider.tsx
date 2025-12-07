"use client";
import { useEffect, useMemo, useRef, useState } from "react";

type BusyRange = { startsAt: string; endsAt: string };

function hhmm(step: number) {
  const minutes = step * 30;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export default function ProTimeSlider({
  busyRanges,
  maxHours,
  defaultStartStep = 18,
  defaultDurationH = 2,
  onChange,
}: {
  busyRanges: BusyRange[];
  maxHours: number;
  defaultStartStep?: number;
  defaultDurationH?: number;
  onChange: (startHHMM: string, endHHMM: string) => void;
}) {
  const STEPS = 48;
  const HOURS = 24;

  const [startStep, setStartStep] = useState(defaultStartStep);
  const [durationH, setDurationH] = useState(defaultDurationH);
  const durationSteps = Math.max(2, Math.min(Math.round(durationH * 2), maxHours * 2));
  const endStep = Math.min(startStep + durationSteps, STEPS);

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

  useEffect(() => {
    onChange(hhmm(startStep), hhmm(endStep));
  }, [startStep, endStep, onChange]);

  const trackRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ type: "start" | null; offset: number } | null>(null);

  const clampStart = (val: number) => Math.max(0, Math.min(STEPS - durationSteps, val));

  const onPointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const left = (startStep / STEPS) * rect.width;
    const right = (endStep / STEPS) * rect.width;
    const isStartHandle = Math.abs(x - left) < Math.abs(x - right);
    dragRef.current = { type: isStartHandle ? "start" : null, offset: x - left };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!trackRef.current || !dragRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (dragRef.current.type === "start") {
      const raw = Math.floor(((x - dragRef.current.offset) / rect.width) * STEPS);
      setStartStep(clampStart(raw));
    }
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragRef.current = null;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const onTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const step = Math.floor(((e.clientX - rect.left) / rect.width) * (STEPS - durationSteps));
    setStartStep(clampStart(step));
  };

  const hoursLabels = Array.from({ length: HOURS }).map((_, h) => `${String(h).padStart(2, "0")}:00`);

  // Псевдо‑отрисовка занятого (целым блоком) — для демо;
  const busyStart = blocked.findIndex(Boolean);
  const busyWidth = blocked.reduce((acc, b) => acc + (b ? 1 : 0), 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div>
          <div className="fancy-time__label">Начало</div>
          <div className="fancy-time__value">{hhmm(startStep)}</div>
        </div>
        <div>
          <div className="fancy-time__label">Длительность</div>
          <div className="chips">
            {[1,2,3,4,5,6,7,8].filter(h => h <= maxHours).map(h => (
              <button key={h} className={`chip ${h === durationH ? "chip--active" : ""}`} onClick={() => setDurationH(h)}>{h} ч</button>
            ))}
          </div>
        </div>
        <div>
          <div className="fancy-time__label">Конец</div>
          <div className="fancy-time__value">{hhmm(endStep)}</div>
        </div>
      </div>

      <div className="slider" ref={trackRef} onClick={onTrackClick} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
        <div className="slider__grid">
          {hoursLabels.map((lbl, i) => (
            <div key={i} className="slider__hour" data-label={lbl}></div>
          ))}
        </div>

        {busyStart !== -1 && (
          <div
            className="slider__busy"
            style={{
              left: `${(busyStart / STEPS) * 100}%`,
              width: `${(busyWidth / STEPS) * 100}%`
            }}
          />
        )}

        <div
          className="slider__range"
          style={{ left: `${(startStep / STEPS) * 100}%`, width: `${((endStep - startStep) / STEPS) * 100}%` }}
        />

        <div className="slider__handle" style={{ left: `calc(${(startStep / STEPS) * 100}% - 17px)` }} />
        <div className="slider__tooltip" style={{ left: `${(startStep / STEPS) * 100}%` }}>{hhmm(startStep)}</div>

        <input
          type="range"
          min={0}
          max={STEPS - durationSteps}
          value={startStep}
          onChange={(e) => setStartStep(clampStart(Number(e.target.value)))}
          aria-label="Выбор времени начала"
        />
      </div>
    </div>
  );
}
