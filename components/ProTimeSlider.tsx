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
  const STEPS = 48; // 30-минутные шаги
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
  const dragging = useRef<boolean>(false);

  const clampStart = (val: number) => Math.max(0, Math.min(STEPS - durationSteps, val));

  const getStepFromX = (x: number, rectWidth: number) =>
    clampStart(Math.floor((x / rectWidth) * (STEPS - durationSteps)));

  const onPointerDown = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    dragging.current = true;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setStartStep(getStepFromX(x, rect.width));
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!trackRef.current || !dragging.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setStartStep(getStepFromX(x, rect.width));
  };

  const onPointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  const onTrackClick = (e: React.MouseEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const step = getStepFromX(e.clientX - rect.left, rect.width);
    setStartStep(step);
  };

  const hoursLabels = Array.from({ length: HOURS }).map((_, h) => `${String(h).padStart(2, "0")}:00`);
  const busyStart = blocked.findIndex(Boolean);
  const busyWidth = blocked.reduce((acc, b) => acc + (b ? 1 : 0), 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1fr", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <div>
          <div className="label">Начало</div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{hhmm(startStep)}</div>
        </div>
        <div>
          <div className="label">Длительность</div>
          <div className="chips">
            {[1,2,3,4,5,6,7,8].filter(h => h <= maxHours).map(h => (
              <button
                key={h}
                className={`tab ${h === durationH ? "tab--active" : ""}`}
                onClick={() => setDurationH(h)}
              >
                {h} ч
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="label">Конец</div>
          <div style={{ fontSize: 18, fontWeight: 900 }}>{hhmm(endStep)}</div>
        </div>
      </div>

      <div
        className="slider"
        ref={trackRef}
        onClick={onTrackClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      >
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
              width: `${(busyWidth / STEPS) * 100}%`,
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
