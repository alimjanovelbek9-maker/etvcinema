import React, { useMemo, useState } from 'react';
import { Search, X, Frown } from 'lucide-react';
import { Header } from './Header';
import { MovieCard } from './MovieCard';
import type { Language, MovieItem, TelegramUser } from '../types';

interface SearchPageProps {
  user: TelegramUser;
  movies: MovieItem[];
  language: Language;
  isDarkMode: boolean;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  user,
  movies,
  language,
  isDarkMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMovies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return movies;
    return movies.filter((movie) =>
      movie.title.toLowerCase().includes(term)
    );
  }, [movies, searchTerm]);

  const t = {
    uz: {
      placeholder: 'Kino qidirish...',
      results: 'Qidiruv natijalari',
      all: 'Barcha kinolar',
      found: 'ta topildi',
      notFound: 'Hech narsa topilmadi',
      notFoundSub: "Qidiruv so'rovini to'g'ri kiritganingizni tekshirib ko'ring",
    },
    ru: {
      placeholder: 'Поиск фильма...',
      results: 'Результаты поиска',
      all: 'Все фильмы',
      found: 'найдено',
      notFound: 'Ничего не найдено',
      notFoundSub: 'Проверьте правильность введенного запроса',
    },
  }[language];

  return (
    <div className={`min-h-screen select-none pb-28 ${isDarkMode ? 'bg-[#0d1222] text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header user={user} isDarkMode={isDarkMode} />

      <main className="px-3.5 pt-2 max-w-md mx-auto">
        <div className="relative mb-5">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.placeholder}
            className={`w-full text-sm rounded-2xl pl-11 pr-10 py-3.5 outline-none transition-all duration-500 shadow-inner motion-search-field ${
              isDarkMode
                ? 'bg-[#12182b] border border-blue-900/40 text-white placeholder-gray-500 focus:border-blue-500'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500'
            }`}
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {searchTerm ? t.results : t.all}
          </span>
          <span className="text-xs font-semibold text-blue-500">
            {filteredMovies.length} {t.found}
          </span>
        </div>

        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                item={movie}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        ) : (
          <div className={`rounded-3xl p-8 border flex flex-col items-center justify-center text-center mt-6 ${
            isDarkMode ? 'bg-[#12182b] border-blue-900/30' : 'bg-white border-gray-200'
          }`}>
            <Frown className="w-12 h-12 text-gray-400 mb-3" />
            <p className="text-sm font-bold">{t.notFound}</p>
            <p className="text-xs text-gray-400 mt-1">{t.notFoundSub}</p>
          </div>
        )}
      </main>
    </div>
  );
};