"use client";
import { useEffect, useState, useMemo } from "react";
import TimeRangeSlider from "./TimeRangeSlider";
import Toast from "./Toast";

declare global { interface Window { Telegram?: any; } }

export default function BookingForm({ pcId }: { pcId: string }) {
  const [date, setDate] = useState<string>("");
  const [start, setStart] = useState<string>("");
  const [end, setEnd] = useState<string>("");
  const [initData, setInitData] = useState<string>("");

  const [busy, setBusy] = useState<{ startsAt: string; endsAt: string }[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Получаем initData из Telegram WebApp
  useEffect(() => {
    const el = document.getElementById("__initData") as HTMLInputElement | null;
    setInitData(el?.value || "");
  }, []);

  // Загружаем занятость при выборе даты
  useEffect(() => {
    if (pcId && date) {
      fetch(`/api/pcs/availability?pcId=${pcId}&date=${date}`)
        .then(r => r.json())
        .then(d => setBusy(d.busy || []))
        .catch(() => setBusy([]));
    }
  }, [pcId, date]);

  // Проверка длительности
  const durationOk = useMemo(() => {
    if (!date || !start || !end) return false;
    const s = new Date(`${date}T${start}:00.000Z`).getTime();
    const e = new Date(`${date}T${end}:00.000Z`).getTime();
    const hours = (e - s) / (1000 * 60 * 60);
    return hours >= 1 && hours <= 12;
  }, [date, start, end]);

  const submit = async () => {
    if (!date || !start || !end) {
      setToast({ message: "Выберите дату и время", type: "error" });
      return;
    }
    const s = new Date(`${date}T${start}:00.000Z`);
    const e = new Date(`${date}T${end}:00.000Z`);
    if (e <= s) {
      setToast({ message: "Конец должен быть позже начала", type: "error" });
      return;
    }
    if (!durationOk) {
      setToast({ message: "Минимум 1 час, максимум 12 часов", type: "error" });
      return;
    }

    // Определяем endpoint: автоназначение или конкретный ПК
    const endpoint = pcId === "vip-auto" || pcId === "std-auto"
      ? "/api/auto/book"
      : "/api/bookings/create";

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        isVip: pcId === "vip-auto" ? true : pcId === "std-auto" ? false : undefined,
        pcId: pcId.startsWith("pc-") ? pcId : undefined,
        startsAt: s.toISOString(),
        endsAt: e.toISOString(),
        initData,
      }),
    }).then(r => r.json());

    if (res.ok) {
      setToast({ message: `Бронь подтверждена: ${res.booking.id}`, type: "success" });
      setTimeout(() => window.Telegram?.WebApp?.close(), 2000);
    } else {
      setToast({ message: `Ошибка: ${res.error}`, type: "error" });
    }
  };

  return (
    <div className="mt-6 card">
      <div className="text-xs mb-2" style={{ color: "#9aa0a6" }}>
        Дата максимум на месяц вперёд:
      </div>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="px-3 py-2 rounded bg-[#161617] text-white mt-2"
      />

      {/* Анимированный ползунок времени с подсветкой занятости */}
      <TimeRangeSlider
        onChange={(s, e) => { setStart(s); setEnd(e); }}
        busyRanges={busy}
      />

      <div className="mt-6">
        <button className="tox-button" onClick={submit} disabled={!durationOk}>
          Подтвердить бронь
        </button>
      </div>

      {/* Уведомления */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
