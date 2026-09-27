import type { MovieItem } from '../../types';

// Cloud sync must be optional. If no valid URL is configured, the app
// should work completely from localStorage and never trigger 400 errors.
const CLOUD_DB_URL = (import.meta.env.VITE_CLOUD_DB_URL || '').trim();

export const fetchMoviesFromCloud = async (): Promise<MovieItem[] | null> => {
  if (!CLOUD_DB_URL) return null;

  try {
    const res = await fetch(`${CLOUD_DB_URL}${CLOUD_DB_URL.includes('?') ? '&' : '?'}t=${Date.now()}`, {
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Cloud DB returned ${res.status}`);

    const data = await res.json();
    const movies = Array.isArray(data) ? data : data?.data;
    return Array.isArray(movies) ? movies : null;
  } catch (e) {
    console.warn('Cloud DB bilan ulanishda xatolik, mahalliy ma\'lumotdan davom etilmoqda.', e);
    return null;
  }
};

export const saveMoviesToCloud = async (movies: MovieItem[]): Promise<void> => {
  if (!CLOUD_DB_URL) return;

  try {
    const res = await fetch(CLOUD_DB_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
      body: JSON.stringify({ data: movies }),
    });
    if (!res.ok) throw new Error(`Cloud DB returned ${res.status}`);
  } catch (e) {
    console.error('Cloud DB ga saqlashda xatolik:', e);
  }
};
