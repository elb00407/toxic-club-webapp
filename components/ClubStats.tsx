"use client";
import { useEffect, useState } from "react";
import { readBookings } from "@/lib/leaderboard";

export default function ClubStats() {
  const [stats, setStats] = useState<{ [hour: number]: number }>({});

  useEffect(() => {
    const bookings = readBookings();
    const map: { [hour: number]: number } = {};
    bookings.forEach((b) => {
      const h = b.timeStart ?? 0;
      map[h] = (map[h] ?? 0) + (b.hours ?? 1);
    });
    setStats(map);
  }, []);

  const hours = Array.from({ length: 14 }, (_, i) => 10 + i); // 10..23

  return (
    <div className="card">
      <div className="grid-header">
        <div className="grid-title">Посещаемость</div>
        <div className="grid-subtitle">Загрузка клуба по часам</div>
      </div>
      <div className="stats-chart">
        {hours.map((h) => (
          <div key={h} className="stats-bar">
            <div className="stats-label">{h}:00</div>
            <div className="stats-fill" style={{ width: `${(stats[h] ?? 0) * 12}px` }}>
              {stats[h] ?? 0}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
