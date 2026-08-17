// Mock auth: a real app would store a JWT from the backend (see L17).
// For L15-L16 we only need "is there a token" to gate routes.
const TOKEN_KEY = 'streakup_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function login(username) {
  localStorage.setItem(TOKEN_KEY, `mock-token-${username}`);
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
}
