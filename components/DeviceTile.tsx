"use client";
import type { DeviceItem } from "@/lib/devices";

export default function DeviceTile({
  d,
  onPick,
}: {
  d: DeviceItem;
  onPick: (d: DeviceItem) => void;
}) {
  const baseClass =
    d.platform === "PS5" ? "device-tile device-tile--ps5" : d.isVip ? "device-tile device-tile--vip" : "device-tile device-tile--std";

  const stateClass =
    d.busyState === "booked" ? "device-tile--booked" : d.busyState === "busy" ? "device-tile--busy" : "";

  return (
    <button className={`${baseClass} ${stateClass}`} onClick={() => onPick(d)}>
      <div className="device-tile__badge">{d.isVip ? "VIP" : "STD"}</div>
      <div className={`device-dot ${d.busyState === "free" ? "device-dot--ok" : "device-dot--bad"}`} />
      <div className="device-tile__label">{d.label}</div>
    </button>
  );
}
