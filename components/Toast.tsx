"use client";
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const bg = type === "success" ? "linear-gradient(135deg,#18c964,#00ff66)" : "linear-gradient(135deg,#ff5a5a,#ff8b8b)";
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg shadow-xl z-50"
      style={{ background: bg, color: "#0a0a0a", fontWeight: 700, animation: "fadeIn .15s ease" }}
    >
      {message}
    </div>
  );
}
