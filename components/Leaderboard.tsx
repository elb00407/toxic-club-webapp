"use client";
import { useEffect, useState } from "react";
import { buildLeaderboard, LeaderRow } from "@/lib/leaderboard";

export default function Leaderboard() {
  const [rows, setRows] = useState<LeaderRow[]>([]);

  useEffect(() => {
    setRows(buildLeaderboard(10));
  }, []);

  return (
    <div className="card">
      <div className="grid-header">
        <div className="grid-title">Лидерборд</div>
        <div className="grid-subtitle">Топ по часам и броням</div>
      </div>

      {rows.length === 0 ? (
        <div className="muted">Пока нет данных.</div>
      ) : (
        <ol className="history-list" style={{ listStyle: "decimal inside" }}>
          {rows.map((r) => (
            <li key={r.userCode} className="history-item">
              <span className="history-label">{r.userCode}</span>
              <span className="history-date">{r.totalHours} ч • {r.totalBookings} броней</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
