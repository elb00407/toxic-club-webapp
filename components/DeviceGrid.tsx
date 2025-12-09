"use client";
import DeviceTile from "./DeviceTile";
import type { DeviceItem } from "@/lib/devices";

export default function DeviceGrid({ items, onPick }: { items: DeviceItem[]; onPick: (d: DeviceItem) => void }) {
  return (
    <div className="devices-grid-wrapper">
      <div className="devices-grid">
        {items.map((d) => (
          <DeviceTile key={d.id} d={d} onPick={onPick} />
        ))}
      </div>
    </div>
  );
}
