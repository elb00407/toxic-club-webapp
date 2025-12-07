import ToxicLogo from "./ToxicLogo";

export default function Header({ subtitle = "Booking WebApp" }: { subtitle?: string }) {
  return (
    <header className="px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <ToxicLogo size={28}/>
        <div className="font-extrabold tracking-wide" style={{ color: "#d4ff00" }}>
          TOXIC CLUB
        </div>
      </div>
      <div className="text-xs" style={{ color: "#9aa0a6" }}>{subtitle}</div>
    </header>
  );
}
