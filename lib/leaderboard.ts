export type BookingEntry = {
  id: string;
  pcId: string;
  label: string;
  ts: number;
  hours?: number;
  userCode: string; // ТЕПЕРЬ ОБЯЗАТЕЛЬНО
  dateISO?: string;
  timeStart?: number;
};

const KEY_BOOKINGS = "toxicskill_bookings";

export function readBookings(): BookingEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(KEY_BOOKINGS);
  return raw ? (JSON.parse(raw) as BookingEntry[]) : [];
}

export function addBooking(entry: BookingEntry) {
  const list = readBookings();
  list.push(entry);
  localStorage.setItem(KEY_BOOKINGS, JSON.stringify(list));
}

export type LeaderRow = { userCode: string; totalHours: number; totalBookings: number; lastTs: number };

export function buildLeaderboard(limit = 10): LeaderRow[] {
  const list = readBookings();
  const map = new Map<string, LeaderRow>();
  for (const e of list) {
    const code = e.userCode || "UNKNOWN";
    const prev = map.get(code);
    const hours = e.hours ?? 2;
    if (!prev) {
      map.set(code, { userCode: code, totalHours: hours, totalBookings: 1, lastTs: e.ts });
    } else {
      prev.totalHours += hours;
      prev.totalBookings += 1;
      prev.lastTs = Math.max(prev.lastTs, e.ts);
    }
  }
  return Array.from(map.values())
    .sort((a, b) => {
      if (b.totalHours !== a.totalHours) return b.totalHours - a.totalHours;
      if (b.totalBookings !== a.totalBookings) return b.totalBookings - a.totalBookings;
      return b.lastTs - a.lastTs;
    })
    .slice(0, limit);
}
