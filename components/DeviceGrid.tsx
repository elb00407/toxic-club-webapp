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
    <div className="grid gap-12 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {items.map((d) => (
        <button
          key={d.id}
          className="device-card"
          onClick={() => onPick(d)}
          disabled={d.status !== "active"}
          aria-label={`Выбрать: ${d.label}`}
        >
          <div className="device-card__top">
            <div>
              <div className="device-card__subtitle">
                {d.platform === "PC" ? (d.isVip ? "ПК • VIP" : "ПК • Стандарт") : "PlayStation 5"}
              </div>
              <div className="device-card__title">{d.label}</div>
            </div>
            <div className={`device-status ${d.status === "active" ? "device-status--ok" : "device-status--bad"}`} />
          </div>

          <div className="device-card__imageWrap">
            <div className={`device-image ${d.platform === "PS5" ? "device-image--ps5" : d.isVip ? "device-image--vip" : "device-image--pc"}`} />
          </div>

          <div className="device-card__bottom">
            <span className="tox-button tox-button--sm">Выбрать</span>
            {d.platform === "PS5" && <span className="device-card__hint">Макс. 7 часов</span>}
          </div>
        </button>
      ))}
    </div>
  );
}
