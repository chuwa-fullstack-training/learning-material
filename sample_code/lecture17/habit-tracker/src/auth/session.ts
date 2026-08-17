// Real JWT now, issued by habit-tracker-api (see L15/L16: this used to be a
// fake string). The frontend's job is just to store and attach it — same
// storage mechanism as before, so ProtectedRoute barely changes.
const TOKEN_KEY = 'streakup_token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
