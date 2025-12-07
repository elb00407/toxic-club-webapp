"use client";
import { useEffect, useRef } from "react";

export type DeviceItem = {
  id: string;
  label: string;
  platform: "PC" | "PS5";
  isVip?: boolean;
  status: "active" | "maintenance";
  specs?: { cpu: string; gpu: string };
  peripherals?: { keyboard?: string; mouse?: string; headset?: string; monitor?: string };
  busyState?: "free" | "busy" | "booked";
};

function useTileInertia(ref: React.RefObject<HTMLButtonElement>) {
  // физика: пружина к (stiffness), демпфирование d, интеграция по кадрам
  let vx = 0, vy = 0;
  let tx = 0, ty = 0; // целевые углы (deg)
  let rx = 0, ry = 0; // текущие углы (deg)
  const k = 0.15; // жесткость
  const d = 0.12; // демпфирование
  let raf = 0;

  const step = () => {
    // ускорение к цели
    const ax = (tx - rx) * k;
    const ay = (ty - ry) * k;
    // скорость + демпфирование
    vx = (vx + ax) * (1 - d);
    vy = (vy + ay) * (1 - d);
    // положение
    rx += vx;
    ry += vy;

    const el = ref.current;
    if (el) {
      el.style.setProperty("--tiltX", `${rx}deg`);
      el.style.setProperty("--tiltY", `${ry}deg`);
    }
    raf = requestAnimationFrame(step);
  };

  const setTarget = (xDeg: number, yDeg: number) => {
    tx = xDeg;
    ty = yDeg;
    if (!raf) raf = requestAnimationFrame(step);
  };

  const stop = () => {
    tx = 0; ty = 0;
  };

  useEffect(() => {
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return { setTarget, stop };
}

export default function DeviceGrid({
  items,
  onPick,
}: {
  items: DeviceItem[];
  onPick: (item: DeviceItem) => void;
}) {
  return (
    <div className="devices-grid">
      {items.map((d) => {
        const tileClass =
          d.platform === "PS5" ? "device-tile--ps5" : d.isVip ? "device-tile--vip" : "device-tile--std";
        const stateClass =
          d.busyState === "booked" ? "device-tile--booked" :
          d.busyState === "busy" ? "device-tile--busy" : "";

        const btnRef = useRef<HTMLButtonElement>(null);
        const { setTarget, stop } = useTileInertia(btnRef);

        const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
          const el = e.currentTarget;
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const midX = rect.width / 2;
          const midY = rect.height / 2;
          const rotY = ((x - midX) / midX) * 8; // -8..8
          const rotX = -((y - midY) / midY) * 8; // -8..8
          setTarget(rotX, rotY);
          el.style.setProperty("--glowX", `${(x / rect.width) * 100}%`);
          el.style.setProperty("--glowY", `${(y / rect.height) * 100}%`);
        };

        const onMouseLeave = () => {
          stop();
        };

        return (
          <button
            key={d.id}
            ref={btnRef}
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

            {d.specs && (
              <div className="device-specs">
                <div className="device-spec"><span>CPU</span> {d.specs.cpu}</div>
                <div className="device-spec"><span>GPU</span> {d.specs.gpu}</div>
              </div>
            )}

            {/* Периферия: добавишь значения — они появятся */}
            {d.peripherals && (
              <div className="device-peripherals">
                {d.peripherals.keyboard && <div className="device-gear"><span>KB</span> {d.peripherals.keyboard}</div>}
                {d.peripherals.mouse && <div className="device-gear"><span>MS</span> {d.peripherals.mouse}</div>}
                {d.peripherals.headset && <div className="device-gear"><span>HS</span> {d.peripherals.headset}</div>}
                {d.peripherals.monitor && <div className="device-gear"><span>MN</span> {d.peripherals.monitor}</div>}
              </div>
            )}

            {d.busyState === "booked" && <div className="device-lock" title="Забронировано">🔒</div>}
          </button>
        );
      })}
    </div>
  );
}
