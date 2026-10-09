import { createClient } from '@supabase/supabase-js';
import type { MovieItem } from '../../types';

const env = import.meta.env as Record<string, string | undefined>;
const url = (env.NEXT_PUBLIC_SUPABASE_URL || env.VITE_SUPABASE_URL || env.SUPABASE_URL || '').trim();
const key = (env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || env.SUPABASE_ANON_KEY || '').trim();
const supabase = url && key ? createClient(url, key) : null;
const table = 'etv_media';

export async function fetchMoviesFromCloud(): Promise<MovieItem[]> {
  if (!supabase) return [];
  const { data, error } = await supabase.from(table).select('data').eq('id', 'catalog').maybeSingle();
  if (error) {
    console.warn('Supabase katalogini o\'qishda xatolik:', error.message);
    return [];
  }
  return Array.isArray(data?.data) ? (data.data as MovieItem[]) : [];
}

export async function saveMoviesToCloud(movies: MovieItem[]): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase.from(table).upsert({
    id: 'catalog',
    data: movies,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error('Supabase katalogini saqlashda xatolik:', error.message);
}

export { supabase };

// Supabase SQL: create table public.etv_media (id text primary key, data jsonb not null default '[]'::jsonb, updated_at timestamptz not null default now());
// Enable RLS and add select/insert/update policies restricted to id = 'catalog'.
