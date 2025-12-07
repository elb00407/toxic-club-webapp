import { useEffect, useRef } from "react";

export default function ToxicLogo({ size = 32 }: { size?: number }) {
  const pathRef = useRef<SVGPathElement>(null);
  useEffect(() => {
    const el = pathRef.current;
    if (!el) return;
    const len = el.getTotalLength();
    el.style.strokeDasharray = String(len);
    el.style.strokeDashoffset = String(len);
    requestAnimationFrame(() => {
      el.style.transition = "stroke-dashoffset 1200ms ease";
      el.style.strokeDashoffset = "0";
    });
  }, []);
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="Toxic Logo">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d4ff00"/>
          <stop offset="1" stopColor="#00ff66"/>
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="none" stroke="url(#g)" strokeWidth="3"/>
      <path ref={pathRef} d="M32 14c8 0 11 6 8 12-3 6-13 4-16 10s2 10 8 10"
            fill="none" stroke="url(#g)" strokeWidth="3" strokeLinecap="round"/>
      <circle cx="32" cy="32" r="4" fill="url(#g)"/>
    </svg>
  );
}
