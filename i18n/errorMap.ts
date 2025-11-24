// i18n/errorMap.ts

// ovo su "specifične" supabase poruke koje ćemo hvatati
const EXPLICIT_MAP: Record<string, string> = {
  "invalid login credentials": "errors.invalidCredentials",
  "email not confirmed": "errors.emailNotConfirmed",
  "user already registered": "errors.userExists",
  "password should be at least 6 characters": "errors.passwordTooShort",
};

export function resolveErrorKey(rawMessage: string): string {
  const msg = rawMessage.trim();
  const lower = msg.toLowerCase();

  // 1) exact match (normalize to lowercase)
  const directKey = EXPLICIT_MAP[lower];
  if (directKey) return directKey;

  // 2) network problemi
  if (
    lower.includes("failed to fetch") ||
    lower.includes("network request failed") ||
    lower.includes("network error")
  ) {
    return "errors.network";
  }

  // 3) invalid credentials varijacije
  if (
    lower.includes("invalid login credentials") ||
    lower.includes("invalid email or password") ||
    lower.includes("invalid login") ||
    lower.includes("invalid credentials")
  ) {
    return "errors.invalidCredentials";
  }

  // 4) već postoji user
  if (
    lower.includes("already registered") ||
    lower.includes("user already exists") ||
    lower.includes("duplicate key value") // npr. postgres unique email
  ) {
    return "errors.userExists";
  }

  // 5) password problemi
  if (
    lower.includes("password should be at least") ||
    lower.includes("password must be at least") ||
    lower.includes("password is too weak")
  ) {
    return "errors.passwordTooShort";
  }

  // 6) rate limit / too many requests
  if (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("too many attempts")
  ) {
    return "errors.rateLimit";
  }

  // 7) token/session expired
  if (
    lower.includes("jwt expired") ||
    lower.includes("token has expired") ||
    lower.includes("session expired")
  ) {
    return "errors.tokenExpired";
  }

  // 8) fallback za naše interne stringove
  if (lower.includes("neuspela prijava")) {
    return "errors.loginFailed";
  }
  if (lower.includes("neuspela registracija")) {
    return "errors.registerFailed";
  }

  // 9) default
  return "errors.generic";
}
