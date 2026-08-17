import { fetchWithAuth } from './client';
import type { Habit } from '../types';

export function fetchHabits(): Promise<Habit[]> {
  return fetchWithAuth<Habit[]>('/api/habits');
}

export function checkInHabit(habitId: string): Promise<{ checkIns: string[] }> {
  return fetchWithAuth<{ checkIns: string[] }>(`/api/habits/${habitId}/check-ins`, {
    method: 'POST',
  });
}

export function loginRequest(username: string, password: string): Promise<{ token: string }> {
  return fetchWithAuth<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

export function registerRequest(username: string, password: string): Promise<{ token: string }> {
  return fetchWithAuth<{ token: string }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}
