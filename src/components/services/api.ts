import type { MovieItem } from '../../types';

// Cloud sync must be optional. If no valid URL is configured, the app
// should work completely from localStorage and never trigger 400 errors.
const CLOUD_DB_URL = (import.meta.env.VITE_CLOUD_DB_URL || '').trim();

export const fetchMoviesFromCloud = async (): Promise<MovieItem[]> => {
  if (!CLOUD_DB_URL) return [];

  try {
    const res = await fetch(CLOUD_DB_URL);
    if (res.ok) {
      const data = await res.json();
      return Array.isArray(data) ? data : data?.data || [];
    }
  } catch (e) {
    console.warn('Cloud DB bilan ulanishda xatolik, mahalliy ma\'lumotdan davom etilmoqda.', e);
  }

  return [];
};

export const saveMoviesToCloud = async (movies: MovieItem[]): Promise<void> => {
  if (!CLOUD_DB_URL) return;

  try {
    await fetch(CLOUD_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: movies }),
    });
  } catch (e) {
    console.error('Cloud DB ga saqlashda xatolik:', e);
  }
};