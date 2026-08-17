import { getToken } from '../auth/session';

const API_BASE = 'http://localhost:4001';

export class ApiError extends Error {}

// Centralized API layer, per L17 slides. One difference from the slides'
// generic example: this backend returns bare JSON (no `{ success, data }`
// envelope), so `fetchWithAuth<T>` resolves directly to `T`.
export async function fetchWithAuth<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(body.message || `HTTP ${res.status}`);
  }

  return res.json() as Promise<T>;
}
