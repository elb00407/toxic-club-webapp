export type LocalUser = {
  id: string;
  nickname: string; // формат 4047ЕВ
  createdAt: number;
  telegram?: string;
};

const KEY_USER = "toxicskill_user";
const KEY_ADMIN = "toxicskill_admin";

export function getUser(): LocalUser | null {
  const raw = typeof window !== "undefined" ? localStorage.getItem(KEY_USER) : null;
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
  const override = typeof window !== "undefined" ? localStorage.getItem(KEY_ADMIN) === "1" : false;
  if (override) return true;
  const tg = user?.telegram ?? getTelegramUsername();
  return (tg ?? "").toLowerCase() === "@maks_lavrow";
}
