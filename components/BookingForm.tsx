"use client";
import { useEffect, useMemo, useState } from "react";
import FancyTimePicker from "./FancyTimePicker";
import ModernCalendar from "./ModernCalendar";
import Toast from "./Toast";

declare global { interface Window { Telegram?: any; } }

export default function BookingForm({ pcId, platform = "PC" }: { pcId: string; platform?: "PC" | "PS5" }) {
  const [date, setDate] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [initData, setInitData] = useState<string>("");

  const [busy, setBusy] = useState<{ startsAt: string; endsAt: string }[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    const el = document.getElementById("__initData") as HTMLInputElement | null;
    setInitData(el?.value || "");
  }, []);

  useEffect(() => {
    if (pcId && date) {
      fetch(`/api/pcs/availability?pcId=${pcId}&date=${date}`)
        .then((r) => r.json())
        .then((d) => setBusy(d.busy || []))
        .catch(() => setBusy([]));
    }
  }, [pcId, date]);

  const maxHours = platform === "PS5" ? 7 : 12;

  const durationOk = useMemo(() => {
    if (!date || !start || !end) return false;
    const s = new Date(`${date}T${start}:00.000Z`).getTime();
    const e = new Date(`${date}T${end}:00.000Z`).getTime();
    const hours = (e - s) / (1000 * 60 * 60);
    return hours >= 1 && hours <= maxHours;
  }, [date, start, end, maxHours]);

  const submit = async () => {
    if (!date || !start || !end) return setToast({ message: "Выберите дату и время", type: "error" });
    const s = new Date(`${date}T${start}:00.000Z`);
    const e = new Date(`${date}T${end}:00.000Z`);
    if (e <= s) return setToast({ message: "Конец должен быть позже начала", type: "error" });
    if (!durationOk) return setToast({ message: `Минимум 1 час, максимум ${maxHours} часов`, type: "error" });

    const endpoint = pcId.startsWith("pc-") || pcId.startsWith("ps5-") ? "/api/bookings/create" : "/api/auto/book";
    const payload: any = {
      startsAt: s.toISOString(),
      endsAt: e.toISOString(),
      initData,
    };
    if (pcId === "vip-auto") payload.isVip = true;
    if (pcId === "std-auto") payload.isVip = false;
    if (pcId.startsWith("pc-") || pcId.startsWith("ps5-")) payload.pcId = pcId;

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).then((r) => r.json());

    if (res.ok) {
      setToast({ message: `Бронь подтверждена: ${res.booking.id}`, type: "success" });
      setTimeout(() => window.Telegram?.WebApp?.close(), 2000);
    } else {
      setToast({ message: `Ошибка: ${res.error}`, type: "error" });
    }
  };

  return (
    <div className="booking">
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <div className="label">Дата</div>
          <ModernCalendar value={date} onChange={setDate} />
        </div>
        <div>
          <div className="label">Время</div>
          <FancyTimePicker
            busyRanges={busy}
            maxHours={maxHours}
            onChange={(s, e) => {
              setStart(s);
              setEnd(e);
            }}
          />
        </div>
      </div>

      <div className="actions">
        <button className="tox-button" onClick={submit} disabled={!durationOk}>
          Подтвердить бронь
        </button>
        {!durationOk && <div className="hint-error">Минимум 1 час, максимум {maxHours} часов</div>}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
