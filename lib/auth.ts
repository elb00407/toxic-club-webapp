export type LocalUser = {
  id: string;
  nickname: string; // формат, например: 4047ЕВ
  createdAt: number;
  telegram?: string;
};

const KEY_USER = "toxicskill_user";
const KEY_ADMIN = "toxicskill_admin";

export function getUser(): LocalUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(KEY_USER);
  return raw ? (JSON.parse(raw) as LocalUser) : null;
}

export function saveUser(user: LocalUser) {
  localStorage.setItem(KEY_USER, JSON.stringify(user));
}

export function logoutUser() {
  localStorage.removeItem(KEY_USER);
}

function getTelegramUsername(): string | undefined {
  try {
    const tg = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.username;
    return tg ? `@${String(tg)}`.toLowerCase() : undefined;
  } catch {
    return undefined;
  }
}

export function ensureAdminFlag() {
  const tg = getTelegramUsername();
  if (tg === "@maks_lavrow") localStorage.setItem(KEY_ADMIN, "1");
}

export function setAdminOverride(on: boolean) {
  localStorage.setItem(KEY_ADMIN, on ? "1" : "0");
}

export function isAdmin(user: LocalUser | null): boolean {
  if (typeof window === "undefined") return false;
  const override = localStorage.getItem(KEY_ADMIN) === "1";
  if (override) return true;
  const tg = user?.telegram ?? getTelegramUsername();
  return (tg ?? "").toLowerCase() === "@maks_lavrow";
}
