"use client";

type PcItem = { id: string; label: string; isVip?: boolean; platform: "PC" | "PS5"; status: "active" | "maintenance" };
export default function PcCards({
  items,
  onPick,
}: {
  items: PcItem[];
  onPick: (item: PcItem) => void;
}) {
  return (
    <div className="grid gap-12 md:grid-cols-3 sm:grid-cols-2 grid-cols-1">
      {items.map((i) => (
        <button
          key={i.id}
          className="card text-left hover:translate-y-[-2px] transition-all duration-150"
          onClick={() => onPick(i)}
          disabled={i.status !== "active"}
          style={{ opacity: i.status !== "active" ? 0.6 : 1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <div style={{ color: "#9aa0a6" }} className="text-xs">
                {i.platform === "PC" ? (i.isVip ? "ПК • VIP" : "ПК • Стандарт") : "PlayStation 5"}
              </div>
              <div className="text-lg font-semibold mt-1">{i.label}</div>
            </div>
            <div
              title={i.status}
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: i.status === "active" ? "linear-gradient(135deg,#8fff00,#00ff66)" : "#ff5a5a",
                boxShadow: i.status === "active" ? "0 0 10px rgba(0,255,102,.35)" : "none",
              }}
            />
          </div>
          <div className="flex justify-between">
            <span className="tox-button" style={{ fontSize: 12, padding: "8px 10px" }}>
              Выбрать
            </span>
            {i.platform === "PS5" && (
              <span className="text-xs" style={{ color: "#9aa0a6" }}>
                Макс. 7 часов
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
