export type LocalUser = {
  id: string;
  nickname: string;
  telegram?: string;
  isAdmin?: boolean;
  createdAt: number;
};

const KEY_USER = "toxicskill_user";

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

export function isAdmin(user: LocalUser | null): boolean {
  if (!user) return false;
  // доступ строго по Telegram username
  return (user.telegram ?? "").toLowerCase() === "@maks_lavrow";
}
