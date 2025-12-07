"use client";
import { useEffect, useState } from "react";

type Pc = { id: string; label: string; isVip: boolean; status: string };

export default function PcGrid({ onSelect }: { onSelect: (pc: Pc) => void }) {
  const [pcs, setPcs] = useState<Pc[]>([]);

  useEffect(() => {
    fetch("/api/pcs/list").then(r => r.json()).then(d => setPcs(d.pcs || []));
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mt-4">
      {pcs.map(pc => (
        <button key={pc.id} onClick={() => onSelect(pc)} className="tox-button">
          <div className="text-sm">{pc.label}</div>
          <div className="text-[11px]" style={{ color: pc.isVip ? "#00ff66" : "#9aa0a6" }}>
            {pc.isVip ? "VIP" : "Стандарт"}
          </div>
        </button>
      ))}
    </div>
  );
}
