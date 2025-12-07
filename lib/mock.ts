// 21 ПК: 16 стандартных и 5 VIP
export const pcs = Array.from({ length: 21 }, (_, i) => {
  const num = i + 1;
  return {
    id: `pc-${num}`,
    label: `PC-${String(num).padStart(2, "0")}`,
    isVip: num > 16, // 17-21 — VIP
    status: "active" as "active" | "maintenance" | "offline",
  };
});

// Заглушка занятости: считаем, что PC-05 занят 14:00–16:00 UTC
export function mockAvailability(pcId: string, dateISO: string) {
  const day = new Date(`${dateISO}T00:00:00.000Z`);
  const busy: { startsAt: string; endsAt: string }[] = [];

  if (pcId === "pc-5") {
    const s = new Date(day); s.setUTCHours(14, 0, 0, 0);
    const e = new Date(day); e.setUTCHours(16, 0, 0, 0);
    busy.push({ startsAt: s.toISOString(), endsAt: e.toISOString() });
  }
  return busy;
}
