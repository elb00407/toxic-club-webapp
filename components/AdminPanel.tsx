"use client";
import { useEffect, useMemo, useState } from "react";
import type { DeviceItem } from "@/lib/devices";
import { getUser, isAdmin, ensureAdminFlag } from "@/lib/auth";

export default function AdminPanel() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    ensureAdminFlag();
    setAllowed(isAdmin(getUser()));
    const raw = localStorage.getItem("toxicskill_devices");
    setDevices(raw ? JSON.parse(raw) : []);
  }, []);

  if (!allowed) return null;

  const updateDeviceState = (id: string, state: DeviceItem["busyState"]) => {
    const next = devices.map((d) => (d.id === id ? { ...d, busyState: state } : d));
    setDevices(next);
    localStorage.setItem("toxicskill_devices", JSON.stringify(next));
  };

  const usageStats = useMemo(() => {
    const total = devices.length;
    const free = devices.filter((d) => d.busyState === "free").length;
    const busy = devices.filter((d) => d.busyState === "busy").length;
    const booked = devices.filter((d) => d.busyState === "booked").length;
    return { total, free, busy, booked };
  }, [devices]);

  return (
    <div className="card">
      <div className="grid-header">
        <div className="grid-title">Админ‑панель</div>
        <div className="grid-subtitle">Управление устройствами и статистика</div>
      </div>

      <div className="history-list" style={{ marginBottom: 12 }}>
        <div className="history-item"><span className="history-label">Устройств</span><span className="history-date">{usageStats.total}</span></div>
        <div className="history-item"><span className="history-label">Свободны</span><span className="history-date">{usageStats.free}</span></div>
        <div className="history-item"><span className="history-label">Заняты</span><span className="history-date">{usageStats.busy}</span></div>
        <div className="history-item"><span className="history-label">Забронированы</span><span className="history-date">{usageStats.booked}</span></div>
      </div>

      <div className="grid-header">
        <div className="grid-title">Устройства</div>
        <div className="grid-subtitle">Статусы и операции</div>
      </div>

      <div className="history-list">
        {devices.length === 0 ? <div className="muted">Нет устройств</div> : null}
        {devices.map((d) => (
          <div key={d.id} className="history-item">
            <span className="history-label">{d.label}</span>
            <span className="history-date">{d.busyState ?? "free"}</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="tox-button tox-button--ghost" onClick={() => updateDeviceState(d.id, "free")}>Free</button>
              <button className="tox-button tox-button--ghost" onClick={() => updateDeviceState(d.id, "busy")}>Busy</button>
              <button className="tox-button tox-button--ghost" onClick={() => updateDeviceState(d.id, "booked")}>Booked</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
