"use client";
import { useEffect, useMemo, useState } from "react";
import TimeRangeSlider from "./TimeRangeSlider";
import Toast from "./Toast";
import DatePicker from "./DatePicker";

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

    const endpoint = pcId === "vip-auto" || pcId === "std-auto" ? "/api/auto/book" : "/api/bookings/create";
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isVip: pcId === "vip-auto" ? true : pcId === "std-auto" ? false : undefined,
        pcId: pcId.startsWith("pc-") || pcId.startsWith("ps5-") ? pcId : undefined,
        startsAt: s.toISOString(),
        endsAt: e.toISOString(),
        initData,
      }),
    }).then((r) => r.json());

    if (res.ok) {
      setToast({ message: `Бронь подтверждена: ${res.booking.id}`, type: "success" });
      setTimeout(() => window.Telegram?.WebApp?.close(), 2000);
    } else {
      setToast({ message: `Ошибка: ${res.error}`, type: "error" });
    }
  };

  return (
    <div className="card mt-6">
      <div className="text-sm mb-4" style={{ color: "#9aa0a6" }}>
        Платформа: {platform === "PS5" ? "PlayStation 5 (макс. 7 ч)" : "ПК"} • ID: {pcId}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs mb-2" style={{ color: "#9aa0a6" }}>
            Выберите дату:
          </div>
          <DatePicker value={date} onChange={setDate} />
        </div>
        <div>
          <div className="text-xs mb-2" style={{ color: "#9aa0a6" }}>
            Выберите время:
          </div>
          <TimeRangeSlider onChange={(s, e) => { setStart(s); setEnd(e); }} busyRanges={busy} maxHours={maxHours} />
        </div>
      </div>

      <div className="mt-6 flex gap-10">
        <button className="tox-button" onClick={submit} disabled={!durationOk}>
          Подтвердить бронь
        </button>
        {!durationOk && (
          <div className="text-xs" style={{ color: "var(--danger)", alignSelf: "center" }}>
            Минимум 1 час, максимум {maxHours} часов
          </div>
        )}
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
