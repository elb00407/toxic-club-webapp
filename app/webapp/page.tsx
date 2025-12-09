"use client";
import WebAppShell from "@/components/WebAppShell";
import AuthGate from "@/components/AuthGate";
import DeviceGrid from "@/components/DeviceGrid";
import BookingForm from "@/components/BookingForm";
import { useMemo, useState } from "react";
import { devices } from "@/lib/devices";

type Picked = { id: string; platform: "PC" | "PS5"; label: string; isVip?: boolean };
type Tab = "STANDARD" | "VIP" | "CONSOLE";

export default function Page() {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [tab, setTab] = useState<Tab>("STANDARD");

  const filtered = useMemo(() => {
    if (tab === "STANDARD") return devices.filter((d) => d.platform === "PC" && !d.isVip);
    if (tab === "VIP") return devices.filter((d) => d.platform === "PC" && d.isVip);
    return devices.filter((d) => d.platform === "PS5");
  }, [tab]);

  return (
    <WebAppShell onBrandClick={() => { setPicked(null); setTab("STANDARD"); }}>
      <AuthGate>
        <main>
          {!picked && (
            <div className="card">
              <div className="tabs">
                <button className={`tab ${tab === "STANDARD" ? "tab--active" : ""}`} onClick={() => setTab("STANDARD")}>Standard</button>
                <button className={`tab ${tab === "VIP" ? "tab--active" : ""}`} onClick={() => setTab("VIP")}>VIP</button>
                <button className={`tab ${tab === "CONSOLE" ? "tab--active" : ""}`} onClick={() => setTab("CONSOLE")}>Console</button>
              </div>

              <div className="grid-header">
                <div className="grid-title">
                  {tab === "STANDARD" && "Стандартные ПК"}
                  {tab === "VIP" && "VIP ПК"}
                  {tab === "CONSOLE" && "Консоль"}
                </div>
                <div className="grid-subtitle">
                  {tab === "STANDARD" && "16 шт • Ryzen 5 5600 • RTX 3060 Ti / 4060"}
                  {tab === "VIP" && "5 шт • Intel i5-13400F • RTX 4060 Ti"}
                  {tab === "CONSOLE" && "PS5 • DualSense • 4K HDR"}
                </div>
              </div>

              <DeviceGrid
                items={filtered}
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
              <div className="actions">
                <button className="tox-button" onClick={() => setPicked(null)}>Вернуться к выбору</button>
              </div>
            </>
          )}
        </main>
      </AuthGate>
    </WebAppShell>
  );
}
import MobileNav from "@/components/MobileNav";
// внутри компонента Page:
<MobileNav onNavigate={(tab) => {
  if (tab === "home") setPicked(null);
  if (tab === "book") {/* можно открыть форму */}
  if (tab === "profile") {/* можно показать профиль */}
}} />
