"use client";
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800);
    return () => clearTimeout(t);
  }, []);
  if (!visible) return null;

  const bg = type === "success" ? "linear-gradient(135deg,#18c964,#00ff66)" : "linear-gradient(135deg,#ff5a5a,#ff8b8b)";
  return (
    <div className="toast" style={{ background: bg }}>
      {message}
    </div>
  );
}
