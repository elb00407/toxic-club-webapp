"use client";

export type DeviceItem = {
  id: string;
  label: string;
  platform: "PC" | "PS5";
  isVip?: boolean;
  status: "active" | "maintenance";
};

export default function DeviceGrid({
  items,
  onPick,
}: {
  items: DeviceItem[];
  onPick: (item: DeviceItem) => void;
}) {
  return (
    <div className="devices-grid">
      {items.map((d) => (
        <button
          key={d.id}
          className={`device-tile ${d.platform === "PS5" ? "device-tile--ps5" : d.isVip ? "device-tile--vip" : "device-tile--std"}`}
          onClick={() => onPick(d)}
          disabled={d.status !== "active"}
          aria-label={`Выбрать: ${d.label}`}
        >
          <div className="device-tile__label">{d.label}</div>
          <div className="device-tile__badge">
            {d.platform === "PS5" ? "PS5" : d.isVip ? "VIP" : "STD"}
          </div>
          <div className={`device-dot ${d.status === "active" ? "device-dot--ok" : "device-dot--bad"}`} />
        </button>
      ))}
    </div>
  );
}
