"use client";
import { useEffect, useRef } from "react";
import type { DeviceItem } from "@/lib/devices";

function useTileInertia() {
  let vx = 0, vy = 0;
  let tx = 0, ty = 0; // target
  let rx = 0, ry = 0; // current
  const k = 0.15;
  const d = 0.12;
  let raf = 0;
  const elRef = useRef<HTMLButtonElement | null>(null);

  const step = () => {
    const ax = (tx - rx) * k;
    const ay = (ty - ry) * k;
    vx = (vx + ax) * (1 - d);
    vy = (vy + ay) * (1 - d);
    rx += vx; ry += vy;
    const el = elRef.current;
    if (el) {
      el.style.setProperty("--tiltX", `${rx}deg`);
      el.style.setProperty("--tiltY", `${ry}deg`);
    }
    raf = requestAnimationFrame(step);
  };

  const setTarget = (xDeg: number, yDeg: number) => {
    tx = xDeg; ty = yDeg;
    if (!raf) raf = requestAnimationFrame(step);
  };
  const stop = () => { tx = 0; ty = 0; };
  useEffect(() => () => { if (raf) cancelAnimationFrame(raf); }, []);
  return { elRef, setTarget, stop };
}

export default function DeviceTile({
  d,
  onPick,
  onSpecsToggle,
}: {
  d: DeviceItem;
  onPick: (item: DeviceItem) => void;
  onSpecsToggle: (id: string) => void;
}) {
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const { elRef, setTarget, stop } = useTileInertia();

  const tileClass = d.platform === "PS5" ? "device-tile--ps5" : d.isVip ? "device-tile--vip" : "device-tile--std";
  const stateClass = d.busyState === "booked" ? "device-tile--booked" : d.busyState === "busy" ? "device-tile--busy" : "";

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotY = ((x - midX) / midX) * 8;
    const rotX = -((y - midY) / midY) * 8;
    setTarget(rotX, rotY);
    el.style.setProperty("--glowX", `${(x / rect.width) * 100}%`);
    el.style.setProperty("--glowY", `${(y / rect.height) * 100}%`);
  };
  const onMouseLeave = () => { if (!isMobile) stop(); };

  return (
    <button
      ref={elRef}
      className={`device-tile ${tileClass} ${stateClass}`}
      onClick={() => onPick(d)}
      disabled={d.status !== "active"}
      aria-label={`Выбрать: ${d.label}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="device-tile__label">{d.label}</div>
      <div className="device-tile__badge">
        {d.platform === "PS5" ? "PS5" : d.isVip ? "VIP" : "STD"}
      </div>
      <div className={`device-dot ${d.status === "active" ? "device-dot--ok" : "device-dot--bad"}`} />

      <button
        type="button"
        className="specs-btn"
        onClick={(e) => { e.stopPropagation(); onSpecsToggle(d.id); }}
        aria-label="Показать характеристики"
      >
        Specs
      </button>

      {d.busyState === "booked" && <div className="device-lock" title="Забронировано">🔒</div>}
    </button>
  );
}
