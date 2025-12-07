"use client";

export default function CategoryPicker({ onPick }: { onPick: (isVip: boolean) => void }) {
  return (
    <div className="flex gap-12">
      <button className="tox-button" onClick={() => onPick(false)}>
        Стандарт (16 ПК)
      </button>
      <button className="tox-button" onClick={() => onPick(true)}>
        VIP (5 ПК)
      </button>
    </div>
  );
}
