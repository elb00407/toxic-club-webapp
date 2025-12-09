export type LocalUser = {
  id: string;
  nickname: string;
  telegram?: string;
  createdAt: number;
};

const KEY_USER = "toxicskill_user";

// попытка авто-детекта Telegram WebApp, если доступно
function getTelegramUsername(): string | undefined {
  try {
    const tg = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.username;
    return tg ? `@${String(tg)}`.toLowerCase() : undefined;
  } catch {
    return undefined;
  }
}

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

export function ensureAdminFlag() {
  const user = getUser();
  const tg = getTelegramUsername();
  if (user && tg && tg === "@maks_lavrow") {
    // если мы в Telegram и юзер — ты, проставим telegram локально для стабильного isAdmin()
    const updated = { ...user, telegram: tg };
    saveUser(updated);
  }
}

export function isAdmin(user: LocalUser | null): boolean {
  if (!user) return false;
  const tg = user.telegram ?? getTelegramUsername();
  return (tg ?? "").toLowerCase() === "@maks_lavrow";
}
