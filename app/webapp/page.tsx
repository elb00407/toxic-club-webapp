"use client";
import WebAppShell from "@/components/WebAppShell";
import AuthGate from "@/components/AuthGate";
import DeviceGrid from "@/components/DeviceGrid";
import BookingForm from "@/components/BookingForm";
import MobileNav from "@/components/MobileNav";
import { useMemo, useState } from "react";
import { devices } from "@/lib/devices";

type Picked = { id: string; platform: "PC" | "PS5"; label: string; isVip?: boolean };
type Tab = "STANDARD" | "VIP" | "CONSOLE";

export default function Page() {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [tab, setTab] = useState<Tab>("STANDARD");
  const [screen, setScreen] = useState<"home" | "book" | "profile">("home");

  const filtered = useMemo(() => {
    if (tab === "STANDARD") return devices.filter((d) => d.platform === "PC" && !d.isVip);
    if (tab === "VIP") return devices.filter((d) => d.platform === "PC" && d.isVip);
    return devices.filter((d) => d.platform === "PS5");
  }, [tab]);

  return (
    <WebAppShell onBrandClick={() => { setPicked(null); setTab("STANDARD"); setScreen("home"); }}>
      <AuthGate>
        <main>
          {screen === "home" && !picked && (
            <div className="card">
              <div className="tabs">
                <button className={`tab ${tab === "STANDARD" ? "tab--active" : ""}`} onClick={() => setTab("STANDARD")}>Standard</button>
                <button className={`tab ${tab === "VIP" ? "tab--active" : ""}`} onClick={() => setTab("VIP")}>VIP</button>
                <button className={`tab ${tab === "CONSOLE" ? "tab--active" : ""}`} onClick={() => setTab("CONSOLE")}>Console</button>
              </div>
              <DeviceGrid items={filtered} onPick={(d) => setPicked({ id: d.id, platform: d.platform, label: d.label, isVip: d.isVip })} />
            </div>
          )}

          {screen === "book" && picked && (
            <div className="card">
              <div className="grid-header">
                <div className="grid-title">{picked.label}</div>
                <div className="grid-subtitle">
                  {picked.platform === "PS5" ? "PlayStation 5 (макс. 7 ч)" : picked.isVip ? "ПК VIP" : "ПК Стандарт"}
                </div>
              </div>
              <BookingForm pcId={picked.id} platform={picked.platform} />
            </div>
          )}

          {screen === "profile" && (
            <div className="card">
              <div className="grid-header">
                <div className="grid-title">Профиль</div>
                <div className="grid-subtitle">Ваши данные</div>
              </div>
              <p>Здесь будет информация о пользователе, история броней и настройки.</p>
            </div>
          )}
        </main>

        <MobileNav onNavigate={(navTab) => {
          if (navTab === "home") { setScreen("home"); setPicked(null); }
          if (navTab === "book") { setScreen("book"); }
          if (navTab === "profile") { setScreen("profile"); }
        }} />
      </AuthGate>
    </WebAppShell>
  );
}
