"use client";
import { useEffect, useState } from "react";

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let p = 0;
    const id = setInterval(() => {
      p += Math.random() * 20;
      if (p >= 100) {
        p = 100;
        clearInterval(id);
        setTimeout(() => setLoading(false), 250);
      }
      setProgress(Math.min(100, Math.floor(p)));
    }, 180);
    return () => clearInterval(id);
  }, []);

  if (loading) {
    return (
      <div className="loader-screen" aria-busy="true" aria-live="polite">
        <div className="loader-logo">toxicskill</div>
        <div className="loader-bar">
          <div className="loader-bar__fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="grid-subtitle" style={{ marginTop: 10 }}>Загрузка… {progress}%</div>
      </div>
    );
  }

  return <>{children}</>;
}
