"use client";
import { useEffect, useState } from "react";
import type { DeviceItem } from "@/lib/devices";

export default function AdminPanel() {
  const [devices, setDevices] = useState<DeviceItem[]>([]);
  const [users, setUsers] = useState<{ id: string; nickname: string; banned?: boolean }[]>([]);

  useEffect(() => {
    // загружаем устройства из localStorage или gen
    const raw = localStorage.getItem("toxicskill_devices");
    if (raw) setDevices(JSON.parse(raw));
    else {
      // если не сохранены, оставим пусто — их предоставляет страница в props обычно
    }

    const u = localStorage.getItem("toxicskill_user");
    setUsers(u ? [JSON.parse(u)] : []);
  }, []);

  const updateDeviceState = (id: string, state: DeviceItem["busyState"]) => {
    const next = devices.map((d) => (d.id === id ? { ...d, busyState: state } : d));
    setDevices(next);
    localStorage.setItem("toxicskill_devices", JSON.stringify(next));
  };

  const toggleBan = (id: string) => {
    const next = users.map((u) => (u.id === id ? { ...u, banned: !u.banned } : u));
    setUsers(next);
  };

  return (
    <div className="card">
      <div className="grid-header">
        <div className="grid-title">Админ‑панель</div>
        <div className="grid-subtitle">Устройства и пользователи</div>
      </div>

      <div className="history-list" style={{ marginBottom: 12 }}>
        {devices.length === 0 ? <div className="muted">Нет устройств в локальном кеше</div> : null}
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

      <div className="grid-header">
        <div className="grid-title">Пользователи</div>
        <div className="grid-subtitle">Управление доступом</div>
      </div>
      <div className="history-list">
        {users.length === 0 ? <div className="muted">Нет пользователей</div> : null}
        {users.map((u) => (
          <div key={u.id} className="history-item">
            <span className="history-label">{u.nickname}</span>
            <span className="history-date">{u.banned ? "Забанен" : "Активен"}</span>
            <button className="tox-button tox-button--ghost" onClick={() => toggleBan(u.id)}>
              {u.banned ? "Разбанить" : "Забанить"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
