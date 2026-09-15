export type NavTab = 'home' | 'search' | 'settings';
export type Language = 'uz' | 'ru';

export interface PaymentMethod {
  id: string;
  name: string;
  icon?: string;
  badge?: string;
  type?: 'uzqr' | 'paynet' | 'sbp' | 'stars';
}

export interface TelegramUser {
  id: number | string;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  phone_number?: string;
}

export interface EpisodeItem {
  id: string;
  episodeNumber: number;
  title?: string;
  code: number;
  file_id?: string;
  quality?: string;
  fileSize?: string;
  videoUrl: string;
}

export interface MovieItem {
  id: string;
  title: string;
  category: 'Kino' | 'Serial' | 'Multfilm' | 'Anime' | string;
  posterUrl?: string;
  videoUrl?: string;
  file_id?: string;
  code?: number;
  fileSize?: string;
  quality?: string;
  createdAt?: number;
  rating?: number | string;
  caption?: string;
  episodes?: EpisodeItem[];
}
