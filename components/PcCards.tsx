"use client";

export type PcItem = {
  id: string;
  label: string;
  isVip?: boolean;
  platform: "PC" | "PS5";
  status: "active" | "maintenance";
};

export default function PcCards({ items, onPick }: { items: PcItem[]; onPick: (item: PcItem) => void }) {
  return (
    <div className="grid gap-12 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {items.map((i) => (
        <button
          key={i.id}
          className="pc-card"
          onClick={() => onPick(i)}
          disabled={i.status !== "active"}
          aria-label={`Выбрать: ${i.label}`}
        >
          <div className="pc-card__top">
            <div>
              <div className="pc-card__subtitle">
                {i.platform === "PC" ? (i.isVip ? "ПК • VIP" : "ПК • Стандарт") : "PlayStation 5"}
              </div>
              <div className="pc-card__title">{i.label}</div>
            </div>
            <div className={`pc-status ${i.status === "active" ? "pc-status--ok" : "pc-status--bad"}`} />
          </div>
          <div className="pc-card__bottom">
            <span className="tox-button tox-button--sm">Выбрать</span>
            {i.platform === "PS5" && <span className="pc-card__hint">Макс. 7 часов</span>}
          </div>
        </button>
      ))}
    </div>
  );
}
