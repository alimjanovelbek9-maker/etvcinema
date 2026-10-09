import { useState, useEffect, useMemo, useCallback } from 'react';
import { Info, X, CreditCard, HeartHandshake } from 'lucide-react';
import { Header } from './components/Header';
import { MovieCard } from './components/MovieCard';
import { BottomNavigation } from './components/BottomNavigation';
import { SearchPage } from './components/SearchPage';
import { SettingsPage } from './components/SettingsPage';
import { AdminPanel } from './components/AdminPanel';
import { QuickActions } from './components/QuickActions';
import { SerialDetailModal } from './components/SerialDetailModal';
import { fetchMoviesFromCloud, saveMoviesToCloud } from './components/services/api';
import type { NavTab, Language, TelegramUser, MovieItem } from './types';

import rawMoviesData from './data/movies.json';

const generateRandomId = () => Math.floor(100000000 + Math.random() * 900000000);

const parseMoviesFromJson = (): MovieItem[] => {
  const moviesList: MovieItem[] = [];
  const serialEpisodes = new Map<string, { item: Record<string, unknown>; code: number }[]>();
  const seenMovieKeys = new Set<string>();

  Object.entries(rawMoviesData).forEach(([codeStr, item], index) => {
    const movie = item as {
      caption?: string;
      posterUrl?: string;
      file_id?: string;
      is_serial?: boolean;
      serial_name?: string;
      episode_number?: number;
      category?: string;
    };

    const code = Number(codeStr) || (1000 + index);
    const caption = movie.caption || '';

    const titleMatch = caption.match(/\*\*Kino nomi:\*\*\s*(.*)/) || caption.match(/(?:Kino nomi|Nomi):\s*<b>?([^<\n*]+)<?\/?b>?/i);
    const rawTitle = titleMatch ? titleMatch[1].split('\n')[0].replace(/\\n/g, '').replace(/<[^>]*>/g, '').trim() : `Kino #${code}`;

    const ratingMatch = caption.match(/\*\*Baho:\*\*\s*([\d.]+)/) || caption.match(/(?:Baho|Reyting):\s*([\d.]+)/i);
    const rating = ratingMatch ? ratingMatch[1] : '8.0';

    const genreMatch = caption.match(/\*\*Janr:\*\*\s*(.*)/);
    const genre = genreMatch ? genreMatch[1].split('\n')[0].replace(/\\n/g, '').trim() : '';
    
    // Multfilm ekanligini aniqroq ajratish
    const isCartoon = movie.category === 'Multfilm' || genre.toLowerCase().includes('multfilm');

    // Oddiy kino tavsifidagi chalkash so'zlar sabab serial bo'lib ketmasligi uchun aniq shart
    const isSerial = movie.category === 'Serial' || Boolean(movie.is_serial || movie.serial_name || (movie.episode_number && movie.episode_number > 0));

    if (isSerial) {
      const serialName = movie.serial_name || rawTitle;
      const episodes = serialEpisodes.get(serialName) || [];
      episodes.push({ item: movie as Record<string, unknown>, code });
      serialEpisodes.set(serialName, episodes);
      return;
    }

    const movieKey = `movie_${code}`;
    if (seenMovieKeys.has(movieKey)) return;
    seenMovieKeys.add(movieKey);

    moviesList.push({
      id: String(code),
      title: rawTitle,
      category: isCartoon ? 'Multfilm' : 'Kino',
      rating: rating,
      posterUrl: movie.posterUrl || '',
      file_id: movie.file_id,
      caption: movie.caption,
      code: code,
      videoUrl: `https://t.me/EtvCinema_bot?start=${code}`,
    });
  });

  serialEpisodes.forEach((episodeRecords, serialName) => {
    const sortedRecords = episodeRecords.sort((a, b) => {
      const episodeA = Number((a.item as { episode_number?: number }).episode_number || a.code);
      const episodeB = Number((b.item as { episode_number?: number }).episode_number || b.code);
      return episodeA - episodeB;
    });
    const first = sortedRecords[0];
    const firstMovie = first.item as {
      posterUrl?: string;
      caption?: string;
    };

    moviesList.push({
      id: `serial-${serialName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      title: serialName,
      category: 'Serial',
      posterUrl: firstMovie.posterUrl || '',
      rating: '10.0',
      createdAt: Date.now(),
      episodes: sortedRecords.map(({ item, code }) => {
        const episode = item as {
          episode_number?: number;
          caption?: string;
          file_id?: string;
        };
        const episodeNumber = Number(episode.episode_number || 0);
        return {
          id: `${serialName}-${episodeNumber || code}`,
          episodeNumber,
          title: `${episodeNumber}-Qism`,
          code,
          file_id: episode.file_id,
          videoUrl: `https://t.me/EtvCinema_bot?start=${code}`,
        };
      }),
    });
  });

  return moviesList.sort((a, b) => (Number(a.code ?? 0) > Number(b.code ?? 0) ? 1 : -1));
};

const bundledMovies = parseMoviesFromJson();
const bundledPostersById = new Map(
  bundledMovies.map((movie) => [String(movie.code ?? movie.id), movie.posterUrl]),
);

const applyBundledPosterUrls = (movies: MovieItem[]) =>
  movies.map((movie) => {
    const posterUrl = bundledPostersById.get(String(movie.code ?? movie.id));
    return posterUrl ? { ...movie, posterUrl } : movie;
  });

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [language, setLanguage] = useState<Language>('uz');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [enhancedAnimations, setEnhancedAnimations] = useState(true);

  // Kategoriya filtri: 'all' | 'serial' | 'cartoon'
  const [filterCategory, setFilterCategory] = useState<'all' | 'serial' | 'cartoon'>('all');
  const [selectedSerialForModal, setSelectedSerialForModal] = useState<MovieItem | null>(null);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const [movies, setMovies] = useState<MovieItem[]>(() => {
    const saved = localStorage.getItem('app_movies_list');
    return saved ? applyBundledPosterUrls(JSON.parse(saved) as MovieItem[]) : bundledMovies;
  });

  useEffect(() => {
    fetchMoviesFromCloud().then((cloudMovies) => {
      if (cloudMovies && cloudMovies.length > 0) {
        const seededSerials = bundledMovies.filter((movie) => movie.category === 'Serial');
        const mergedMovies = applyBundledPosterUrls(cloudMovies.map((movie) => ({ ...movie })));

        seededSerials.forEach((seedSerial) => {
          const existingIndex = mergedMovies.findIndex((movie) => movie.title === seedSerial.title && movie.category === 'Serial');
          if (existingIndex === -1) {
            mergedMovies.push(seedSerial);
          } else {
            const existing = mergedMovies[existingIndex];
            const existingCodes = new Set((existing.episodes || []).map((episode) => episode.code));
            const missingEpisodes = (seedSerial.episodes || []).filter((episode) => !existingCodes.has(episode.code));
            if (missingEpisodes.length > 0) {
              mergedMovies[existingIndex] = {
                ...existing,
                episodes: [...(existing.episodes || []), ...missingEpisodes].sort((a, b) => a.episodeNumber - b.episodeNumber),
              };
            }
          }
        });
        setMovies(mergedMovies);
        saveMoviesToCloud(mergedMovies);
      }
    });
  }, []);

  const updateMoviesData = useCallback((newMovies: MovieItem[]) => {
    setMovies(newMovies);
    localStorage.setItem('app_movies_list', JSON.stringify(newMovies));
    saveMoviesToCloud(newMovies);
  }, []);

  const handleAddMovie = useCallback((newMovie: MovieItem) => {
    setMovies((prev) => {
      const updated = [newMovie, ...prev];
      updateMoviesData(updated);
      return updated;
    });
  }, [updateMoviesData]);

  const handleUpdateMovie = useCallback((updatedMovie: MovieItem) => {
    setMovies((prev) => {
      const updated = prev.map((m) => (m.id === updatedMovie.id ? updatedMovie : m));
      updateMoviesData(updated);
      return updated;
    });
  }, [updateMoviesData]);

  const handleDeleteMovie = useCallback((movieId: string) => {
    setMovies((prev) => {
      const updated = prev.filter((m) => m.id !== movieId);
      updateMoviesData(updated);
      return updated;
    });
  }, [updateMoviesData]);

  const [user] = useState<TelegramUser>(() => {
    const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
    return telegramUser
      ? {
          id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          username: telegramUser.username,
          photo_url: telegramUser.photo_url,
        }
      : { id: generateRandomId(), first_name: 'Foydalanuvchi' };
  });

  useEffect(() => {
    const checkPath = () => {
      if (window.location.pathname.includes('/admin') || window.location.hash.includes('admin')) {
        setIsAdminPage(true);
      }
    };
    checkPath();
    window.addEventListener('popstate', checkPath);
    return () => window.removeEventListener('popstate', checkPath);
  }, []);

  useEffect(() => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
    }
  }, []);

  const handleSupportClick = () => {
    const supportLink = 'https://t.me/alimjanove001';
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(supportLink);
    } else {
      window.open(supportLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Tanlangan kategoriya bo'yicha to'g'ri filterlash
  const displayedMovies = useMemo(() => {
    if (filterCategory === 'serial') return movies.filter((movie) => movie.category === 'Serial');
    if (filterCategory === 'cartoon') return movies.filter((movie) => movie.category === 'Multfilm');
    // 'all' rejimida faqat Kino kategoriyasidagi kartochkalar chiqadi
    return movies.filter((movie) => movie.category === 'Kino');
  }, [movies, filterCategory]);

  const handleMovieCardClick = useCallback((movie: MovieItem) => {
    if (movie.category === 'Serial') {
      setSelectedSerialForModal(movie);
    } else if (movie.videoUrl) {
      const tg = (window as any).Telegram?.WebApp;
      if (tg?.openTelegramLink) {
        tg.openTelegramLink(movie.videoUrl);
      } else {
        window.open(movie.videoUrl, '_blank', 'noopener,noreferrer');
      }
    }
  }, []);

  if (isAdminPage) {
    return (
      <AdminPanel
        movies={movies}
        onAddMovie={handleAddMovie}
        onUpdateMovie={handleUpdateMovie}
        onDeleteMovie={handleDeleteMovie}
        onClose={() => {
          setIsAdminPage(false);
          window.history.pushState({}, '', '/');
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 select-none pb-28 ${enhancedAnimations ? 'motion-boost' : ''} ${
      isDarkMode ? 'bg-[#0d1222] text-white' : 'bg-gray-100 text-gray-900'
    }`}>
      {activeTab === 'settings' ? (
        <SettingsPage
          user={user}
          language={language}
          onLanguageChange={setLanguage}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          enhancedAnimations={enhancedAnimations}
          onToggleAnimations={() => setEnhancedAnimations(!enhancedAnimations)}
          onSupportClick={handleSupportClick}
        />
      ) : activeTab === 'search' ? (
        <SearchPage
          user={user}
          movies={movies}
          language={language}
          isDarkMode={isDarkMode}
        />
      ) : (
        <>
          <Header user={user} isDarkMode={isDarkMode} />

          <QuickActions
            language={language}
            onSeriesClick={() => {
              setFilterCategory(filterCategory === 'serial' ? 'all' : 'serial');
            }}
            onCartoonsClick={() => {
              setFilterCategory(filterCategory === 'cartoon' ? 'all' : 'cartoon');
            }}
          />

          <main className="px-2 pt-2 w-full max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-bold text-gray-400">
                {filterCategory === 'serial'
                  ? 'Seriallar'
                  : filterCategory === 'cartoon'
                  ? 'Multfilmlar'
                  : 'Barcha Kinolar'}
              </h2>

              <div className="flex items-center gap-2">
                {filterCategory !== 'all' && (
                  <button
                    onClick={() => setFilterCategory('all')}
                    className="text-xs text-blue-400 font-semibold hover:underline mr-1"
                  >
                    Barchasini ko'rsatish
                  </button>
                )}

                <button
                  onClick={() => setIsNoticeOpen(true)}
                  className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 shadow-md shadow-blue-600/30 active:scale-95"
                >
                  <Info className="w-3.5 h-3.5" />
                  <span>Eslatma</span>
                </button>
              </div>
            </div>

            {displayedMovies.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                Hozircha ma'lumotlar mavjud emas.
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {displayedMovies.map((movie) => (
                  <div key={movie.id} onClick={() => handleMovieCardClick(movie)}>
                    <MovieCard item={movie} isDarkMode={isDarkMode} />
                  </div>
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {/* Eslatma Modal */}
      {isNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#161d31] border border-slate-700/60 rounded-2xl shadow-2xl p-5 text-white overflow-hidden">
            <button
              onClick={() => setIsNoticeOpen(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white bg-slate-800/80 p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Foydalanuvchilar diqqatiga!</h3>
            </div>

            <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
              <p>
                Assalomu Aleykum aziz foydalanuvchilar! Botimizdagi ba'zi kinolar sifati 480p yoki 720p bo'lishi mumkin. Loyihani o'z imkoniyatlarimiz bilan yaratganimiz sababli moliyaviy qiyinchiliklar bor, buning uchun uzr so'raymiz 🤝
              </p>
              <p>
                Agar loyihamiz rivojlanib, kinolarni yuqori sifatda yuklashimizni xohlasangiz, ixtiyoriy ravishda quyidagi bank kartasiga qo'llab-quvvatlash uchun donat qilishingiz mumkin ☺️
              </p>
            </div>

            <div className="mt-4 p-3 bg-slate-800/80 border border-slate-700/70 rounded-xl flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Bank hisob raqami:</div>
                <div className="font-mono text-xs font-bold text-blue-300 tracking-wider">
                  9860 0101 1391 7065
                </div>
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => setIsNoticeOpen(false)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-lg shadow-blue-600/20 active:scale-95"
              >
                Tushunarli
              </button>
            </div>
          </div>
        </div>
      )}

      <SerialDetailModal
        serial={selectedSerialForModal}
        onClose={() => setSelectedSerialForModal(null)}
      />

      <BottomNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}