"use client";
import { useEffect, useState } from "react";

export default function Toast({ message, type = "success" }: { message: string; type?: "success" | "error" }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const bg = type === "success" ? "bg-green-600" : "bg-red-600";

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 ${bg} text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in`}>
      {message}
    </div>
  );
}
