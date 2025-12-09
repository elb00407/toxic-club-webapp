"use client";
type Device = { id: string; label: string; platform: "PC" | "PS5"; isVip?: boolean };

export default function DeviceGrid({
  items,
  onPick,
}: {
  items: Device[];
  onPick: (d: Device) => void;
}) {
  return (
    <div className="devices-grid">
      {items.map((d) => (
        <button
          key={d.id}
          className={`device-tile ${d.isVip ? "device-tile--vip" : ""}`}
          onClick={() => onPick(d)}
        >
          <div className="device-title">{d.label}</div>
          <div className="device-subtitle">
            {d.platform === "PS5" ? "PlayStation 5" : d.isVip ? "ПК VIP" : "ПК"}
          </div>
        </button>
      ))}
    </div>
  );
}
