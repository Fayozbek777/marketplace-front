const STORAGE_KEY = "login_attempts";
const MAX_ATTEMPTS = 5;
const BAN_DURATION_MS = 5 * 60 * 1000; // 5 минут

interface LoginAttempts {
  count: number;
  bannedUntil: number | null;
}

function get(): LoginAttempts {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { count: 0, bannedUntil: null };
    const parsed = JSON.parse(raw) as LoginAttempts;
    // если бан истёк — сбросить
    if (parsed.bannedUntil && Date.now() > parsed.bannedUntil) {
      return { count: 0, bannedUntil: null };
    }
    return parsed;
  } catch {
    return { count: 0, bannedUntil: null };
  }
}

function save(data: LoginAttempts): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const loginGuard = {
  /** Забанен ли сейчас */
  isBanned(): { banned: boolean; remainingMs: number } {
    const data = get();
    if (data.bannedUntil && Date.now() < data.bannedUntil) {
      return { banned: true, remainingMs: data.bannedUntil - Date.now() };
    }
    return { banned: false, remainingMs: 0 };
  },

  /** Осталось попыток */
  remainingAttempts(): number {
    return Math.max(0, MAX_ATTEMPTS - get().count);
  },

  /** Регистрируем неудачную попытку */
  registerFail(): { banned: boolean; remainingMs: number } {
    const data = get();
    const newCount = data.count + 1;

    if (newCount >= MAX_ATTEMPTS) {
      const bannedUntil = Date.now() + BAN_DURATION_MS;
      save({ count: newCount, bannedUntil });
      return { banned: true, remainingMs: BAN_DURATION_MS };
    }

    save({ count: newCount, bannedUntil: null });
    return { banned: false, remainingMs: 0 };
  },

  /** Успешный вход — сброс счётчика */
  registerSuccess(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  /** Сбросить всё (для тестов/разработки) */
  reset(): void {
    localStorage.removeItem(STORAGE_KEY);
  },
};
