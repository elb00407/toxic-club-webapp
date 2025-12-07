"use client";
import WebAppShell from "@/components/WebAppShell";
import DeviceGrid from "@/components/DeviceGrid";
import BookingForm from "@/components/BookingForm";
import { useState } from "react";
import { devices } from "@/lib/devices";

type Picked = { id: string; platform: "PC" | "PS5"; label: string; isVip?: boolean };

export default function Page() {
  const [picked, setPicked] = useState<Picked | null>(null);

  return (
    <WebAppShell onBrandClick={() => setPicked(null)}>
      <main>
        {!picked && (
          <div className="card">
            <div className="grid-header">
              <div className="grid-title">Выберите устройство</div>
              <div className="grid-subtitle">16 стандартных ПК • 5 VIP • 1 PS5</div>
            </div>
            <DeviceGrid
              items={devices}
              onPick={(d) => setPicked({ id: d.id, platform: d.platform, label: d.label, isVip: d.isVip })}
            />
          </div>
        )}

        {picked && (
          <>
            <div className="card">
              <div className="grid-header">
                <div className="grid-title">{picked.label}</div>
                <div className="grid-subtitle">
                  {picked.platform === "PS5" ? "PlayStation 5 (макс. 7 ч)" : picked.isVip ? "ПК VIP" : "ПК Стандарт"}
                </div>
              </div>
              <BookingForm pcId={picked.id} platform={picked.platform} />
            </div>
            <div className="mt-6">
              <button className="tox-button" onClick={() => setPicked(null)}>Вернуться к выбору</button>
            </div>
          </>
        )}
      </main>
    </WebAppShell>
  );
}
