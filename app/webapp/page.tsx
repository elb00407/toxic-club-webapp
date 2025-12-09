"use client";
import WebAppShell from "@/components/WebAppShell";
import AuthGate from "@/components/AuthGate";
import DeviceGrid from "@/components/DeviceGrid";
import BookingForm from "@/components/BookingForm";
import MobileNav from "@/components/MobileNav";
import ProfileHistory from "@/components/ProfileHistory";
import { useMemo, useState } from "react";
import { devices } from "@/lib/devices";

type Picked = { id: string; platform: "PC" | "PS5"; label: string; isVip?: boolean };
type Tab = "STANDARD" | "VIP" | "CONSOLE";
type Screen = "home" | "book" | "profile";

export default function Page() {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [tab, setTab] = useState<Tab>("STANDARD");
  const [screen, setScreen] = useState<Screen>("home");

  const filtered = useMemo(() => {
    if (tab === "STANDARD") return devices.filter((d) => d.platform === "PC" && !d.isVip);
    if (tab === "VIP") return devices.filter((d) => d.platform === "PC" && d.isVip);
    return devices.filter((d) => d.platform === "PS5");
  }, [tab]);

  const openBooking = (d: Picked) => {
    setPicked(d);
    setScreen("book");
  };

  const handleNavigate = (navTab: string) => {
    if (navTab === "home") {
      setScreen("home");
      setPicked(null);
      setTab("STANDARD");
    }
    if (navTab === "book") {
      if (!picked) setScreen("home");
      else setScreen("book");
    }
    if (navTab === "profile") setScreen("profile");
  };

  const toast = (msg: string) => {
    const container = document.getElementById("toast-container");
    if (!container) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.classList.add("toast--show"), 10);
    setTimeout(() => {
      el.classList.remove("toast--show");
      setTimeout(() => el.remove(), 200);
    }, 2000);
  };

  return (
    <WebAppShell onBrandClick={() => { setPicked(null); setTab("STANDARD"); setScreen("home"); }}>
      <AuthGate>
        <main className="container">
          {screen === "home" && (
            <div className="card">
              <div className="tabs">
                <button className={`tab ${tab === "STANDARD" ? "tab--active" : ""}`} onClick={() => setTab("STANDARD")}>Standard</button>
                <button className={`tab ${tab === "VIP" ? "tab--active" : ""}`} onClick={() => setTab("VIP")}>VIP</button>
                <button className={`tab ${tab === "CONSOLE" ? "tab--active" : ""}`} onClick={() => setTab("CONSOLE")}>Console</button>
              </div>

              <DeviceGrid
                items={filtered}
                onPick={(d) => openBooking({ id: d.id, platform: d.platform, label: d.label, isVip: d.isVip })}
              />
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
              <BookingForm
                pcId={picked.id}
                platform={picked.platform}
                onCancel={() => { setPicked(null); setScreen("home"); }}
                onBooked={(orderId) => {
                  const raw = localStorage.getItem("toxicskill_bookings");
                  const list = raw ? JSON.parse(raw) : [];
                  list.push({ id: orderId, pcId: picked.id, label: picked.label, ts: Date.now() });
                  localStorage.setItem("toxicskill_bookings", JSON.stringify(list));
                  toast("Бронь создана");
                  setScreen("profile");
                }}
              />
            </div>
          )}

          {screen === "profile" && (
            <div className="card">
              <ProfileHistory />
            </div>
          )}
        </main>

        <MobileNav onNavigate={handleNavigate} />
      </AuthGate>
    </WebAppShell>
  );
}
