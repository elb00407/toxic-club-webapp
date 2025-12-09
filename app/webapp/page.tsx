"use client";
import WebAppShell from "@/components/WebAppShell";
import AuthGate from "@/components/AuthGate";
import DeviceGrid from "@/components/DeviceGrid";
import BookingForm from "@/components/BookingForm";
import MobileNav from "@/components/MobileNav";
import ProfileHistory from "@/components/ProfileHistory";
import AdminPanel from "@/components/AdminPanel";
import { useEffect, useMemo, useState } from "react";
import { devices as baseDevices } from "@/lib/devices";

type Picked = { id: string; platform: "PC" | "PS5"; label: string; isVip?: boolean };
type Tab = "STANDARD" | "VIP" | "CONSOLE";
type Screen = "home" | "book" | "profile" | "admin";

export default function Page() {
  const [picked, setPicked] = useState<Picked | null>(null);
  const [tab, setTab] = useState<Tab>("STANDARD");
  const [screen, setScreen] = useState<Screen>("home");
  const [devices, setDevices] = useState(baseDevices);

  useEffect(() => {
    // sync devices to localStorage for AdminPanel demo
    localStorage.setItem("toxicskill_devices", JSON.stringify(devices));
  }, [devices]);

  // применить тему из localStorage
  useEffect(() => {
    const t = localStorage.getItem("toxicskill_theme");
    const html = document.documentElement;
    if (t) html.setAttribute("data-theme", t);
  }, []);

  const filtered = useMemo(() => {
    if (tab === "STANDARD") return devices.filter((d) => d.platform === "PC" && !d.isVip);
    if (tab === "VIP") return devices.filter((d) => d.platform === "PC" && d.isVip);
    return devices.filter((d) => d.platform === "PS5");
  }, [tab, devices]);

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
                <button className="tab" onClick={() => setScreen("admin")}>Admin</button>
              </div>

              <div className="grid-header">
                <div className="grid-title">
                  {tab === "STANDARD" && "Стандартные ПК • Toxic1–Toxic16"}
                  {tab === "VIP" && "VIP ПК • ToxicV1–ToxicV5"}
                  {tab === "CONSOLE" && "Консоли"}
                </div>
                <div className="grid-subtitle">
                  {tab === "STANDARD" && "Ryzen 5 5600 • RTX 3060 Ti / 4060"}
                  {tab === "VIP" && "Intel i5-13400F • RTX 4060 Ti"}
                  {tab === "CONSOLE" && "PS5 • DualSense • 4K HDR"}
                </div>
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
                  list.push({ id: orderId, pcId: picked.id, label: picked.label, ts: Date.now(), hours: 2 });
                  localStorage.setItem("toxicskill_bookings", JSON.stringify(list));
                  // обновим статус устройства локально как booked
                  setDevices((prev) => prev.map((dv) => (dv.id === picked.id ? { ...dv, busyState: "booked" } : dv)));
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

          {screen === "admin" && (
            <AdminPanel />
          )}
        </main>

        <MobileNav onNavigate={handleNavigate} />
        <div id="toast-container" className="toast-container" aria-live="polite" aria-atomic="true" />
      </AuthGate>
    </WebAppShell>
  );
}
