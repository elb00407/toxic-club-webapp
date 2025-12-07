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
    <WebAppShell>
      <main>
        {!picked && (
          <div className="card">
            <div className="text-sm mb-4" style={{ color: "#9aa0a6" }}>
              Выберите устройство для брони
            </div>
            <DeviceGrid
              items={devices}
              onPick={(d) => setPicked({ id: d.id, platform: d.platform, label: d.label, isVip: d.isVip })}
            />
          </div>
        )}

        {picked && (
          <>
            <BookingForm pcId={picked.id} platform={picked.platform} />
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
