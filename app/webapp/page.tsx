"use client";
import WebAppShell from "@/components/WebAppShell";
import PcCards from "@/components/PcCards";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";

type Picked = { pcId: string; platform: "PC" | "PS5" };

export default function Page() {
  const [picked, setPicked] = useState<Picked | null>(null);

  const items = [
    { id: "std-auto", label: "Автоназначение • Стандарт", isVip: false, platform: "PC", status: "active" },
    { id: "vip-auto", label: "Автоназначение • VIP", isVip: true, platform: "PC", status: "active" },
    { id: "ps5-auto", label: "PlayStation 5", platform: "PS5", status: "active" },
  ];

  return (
    <WebAppShell>
      <main>
        {!picked && (
          <div className="card">
            <div className="text-sm mb-4" style={{ color: "#9aa0a6" }}>
              Выберите категорию или PS5
            </div>
            <PcCards
              items={items}
              onPick={(i) => setPicked({ pcId: i.id, platform: i.platform as "PC" | "PS5" })}
            />
          </div>
        )}

        {picked && (
          <>
            <BookingForm pcId={picked.pcId} platform={picked.platform} />
            <div className="mt-6">
              <button className="tox-button" onClick={() => setPicked(null)}>
                Вернуться к выбору
              </button>
            </div>
          </>
        )}
      </main>
    </WebAppShell>
  );
}
