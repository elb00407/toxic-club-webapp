"use client";
import { useEffect, useState } from "react";

export default function Loader({ onFinish }: { onFinish: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onFinish, 500);
          return 100;
        }
        return p + 5;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <div className="loader-screen">
      <div className="loader-logo">toxicskill</div>
      <div className="loader-bar">
        <div className="loader-bar__fill" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
