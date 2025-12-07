"use client";
import DeviceTile from "./DeviceTile";
import type { DeviceItem } from "@/lib/devices";
import { useState } from "react";

export default function DeviceGrid({
  items,
  onPick,
}: {
  items: DeviceItem[];
  onPick: (item: DeviceItem) => void;
}) {
  const [openSpecsId, setOpenSpecsId] = useState<string | null>(null);
  const toggleSpecs = (id: string) => setOpenSpecsId((prev) => (prev === id ? null : id));

  const current = items.find((i) => i.id === openSpecsId);
  const currentSpecs = current?.specs ?? { cpu: "", gpu: "" };
  const currentPeripherals = current?.peripherals ?? {};

  return (
    <div className="devices-grid-wrapper">
      <div className="devices-grid">
        {items.map((d) => (
          <DeviceTile
            key={d.id}
            d={{ ...d, specs: d.specs ?? { cpu: "", gpu: "" }, peripherals: d.peripherals ?? {} }}
            onPick={onPick}
            onSpecsToggle={toggleSpecs}
          />
        ))}
      </div>

      <div className={`specs-panel ${openSpecsId ? "specs-panel--open" : ""}`}>
        {openSpecsId && (
          <div className="specs-content">
            <div className="specs-title">Характеристики</div>
            <div className="specs-row"><span>CPU</span><div>{currentSpecs.cpu || "—"}</div></div>
            <div className="specs-row"><span>GPU</span><div>{currentSpecs.gpu || "—"}</div></div>
            {current && currentPeripherals && (
              <>
                <div className="specs-title mt-3">Периферия</div>
                <div className="specs-row"><span>Клавиатура</span><div>{currentPeripherals.keyboard || "—"}</div></div>
                <div className="specs-row"><span>Мышь</span><div>{currentPeripherals.mouse || "—"}</div></div>
                <div className="specs-row"><span>Гарнитура</span><div>{currentPeripherals.headset || "—"}</div></div>
                <div className="specs-row"><span>Монитор</span><div>{currentPeripherals.monitor || "—"}</div></div>
              </>
            )}
            <div className="specs-actions">
              <button className="tox-button tox-button--sm" onClick={() => setOpenSpecsId(null)}>Закрыть</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
