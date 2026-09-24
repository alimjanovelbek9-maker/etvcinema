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
import type { NavTab, Language, TelegramUser, MovieItem, EpisodeItem } from './types';

import rawMoviesData from './data/movies.json';

const generateRandomId = () => Math.floor(100000000 + Math.random() * 900000000);

const normalizeSerialKey = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

// JSON ichidan Kinolar va Seriallarni ajratib, Serial qismlarini guruhlash funksiyasi
const parseMoviesFromJson = (): MovieItem[] => {
  const moviesList: MovieItem[] = [];
  const serialsGroupMap: { [key: string]: MovieItem } = {};
  const seenMovieKeys = new Set<string>();
  const seenEpisodeKeys = new Set<string>();

  Object.entries(rawMoviesData).forEach(([codeStr, item], index) => {
    const movie = item as {
      caption?: string;
      posterUrl?: string;
      file_id?: string;
      is_serial?: boolean;
      serial_name?: string;
      episode_number?: number;
    };

    const code = Number(codeStr) || (1000 + index);
    const caption = movie.caption || '';

    // Caption'dan Ma'lumotlarni qidirish
    const titleMatch = caption.match(/\*\*Kino nomi:\*\*\s*(.*)/) || caption.match(/(?:Kino nomi|Nomi):\s*<b>?([^<\n*]+)<?\/?b>?/i);
    const rawTitle = titleMatch ? titleMatch[1].split('\n')[0].replace(/\\n/g, '').replace(/<[^>]*>/g, '').trim() : `Kino #${code}`;

    const ratingMatch = caption.match(/\*\*Baho:\*\*\s*([\d.]+)/) || caption.match(/(?:Baho|Reyting):\s*([\d.]+)/i);
    const rating = ratingMatch ? ratingMatch[1] : '8.0';

    const genreMatch = caption.match(/\*\*Janr:\*\*\s*(.*)/);
    const genre = genreMatch ? genreMatch[1].split('\n')[0].replace(/\\n/g, '').trim() : '';
    const isSerial = Boolean(movie.is_serial || movie.serial_name || movie.episode_number || genre.toLowerCase().includes('serial') || caption.toLowerCase().includes('qism'));

    if (isSerial) {
      const serialName = (movie.serial_name || rawTitle)
        .replace(/\s*\(?\d+[-_ ]*qism\)?/i, '')
        .replace(/\s+/g, ' ')
        .trim();
      const serialKey = normalizeSerialKey(serialName || `serial_${code}`);
      const episodeKey = `${serialKey}-${code}`;

      if (seenEpisodeKeys.has(episodeKey)) {
        return;
      }
      seenEpisodeKeys.add(episodeKey);

      let epNum = movie.episode_number;
      if (!epNum) {
        const epMatch = caption.match(/(\d+)[-_ ]*qism/i) || rawTitle.match(/(\d+)[-_ ]*qism/i);
        epNum = epMatch ? parseInt(epMatch[1], 10) : 1;
      }

      const episodeObj: EpisodeItem = {
        id: `ep_${code}`,
        episodeNumber: epNum,
        title: `${epNum}-Qism`,
        code: code,
        file_id: movie.file_id || '',
        videoUrl: `https://t.me/EtvCinema_bot?start=${code}`,
      };

      const existingSerial = serialsGroupMap[serialKey];
      if (existingSerial) {
        if (!existingSerial.episodes) {
          existingSerial.episodes = [];
        }
        const exists = existingSerial.episodes.some((e) => e.code === code);
        if (!exists) {
          existingSerial.episodes.push(episodeObj);
          existingSerial.episodes.sort((a, b) => a.episodeNumber - b.episodeNumber);
        }
        return;
      }

      const newSerial: MovieItem = {
        id: `serial_${serialKey}`,
        title: serialName,
        category: 'Serial',
        rating: rating,
        posterUrl: movie.posterUrl || '',
        episodes: [episodeObj],
      };
      serialsGroupMap[serialKey] = newSerial;
      moviesList.push(newSerial);
      return;
    }

    const movieKey = `movie_${code}`;
    if (seenMovieKeys.has(movieKey)) {
      return;
    }
    seenMovieKeys.add(movieKey);

    moviesList.push({
      id: String(code),
      title: rawTitle,
      category: 'Kino',
      rating: rating,
      posterUrl: movie.posterUrl || '',
      file_id: movie.file_id,
      caption: movie.caption,
      code: code,
      videoUrl: `https://t.me/EtvCinema_bot?start=${code}`,
    });
  });

  return moviesList.sort((a, b) => (Number(a.code ?? 0) > Number(b.code ?? 0) ? 1 : -1));
};

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [language, setLanguage] = useState<Language>('uz');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [enhancedAnimations, setEnhancedAnimations] = useState(true);

  const [filterCategory, setFilterCategory] = useState<'all' | 'serial'>('all');
  const [selectedSerialForModal, setSelectedSerialForModal] = useState<MovieItem | null>(null);

  // Eslatma modal oynasi holati (state)
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);

  const [movies, setMovies] = useState<MovieItem[]>(() => {
    const saved = localStorage.getItem('app_movies_list');
    return saved ? JSON.parse(saved) : parseMoviesFromJson();
  });

  // 1. Bulutli bazadan barcha qurilmalar uchun sinxronizatsiya
  useEffect(() => {
    fetchMoviesFromCloud().then((cloudMovies) => {
      if (cloudMovies && cloudMovies.length > 0) {
        setMovies(cloudMovies);
      }
    });
  }, []);

  // 2. Kinolar o'zgarganda Bulutga va LocalStorage'ga saqlash
  const updateMoviesData = useCallback((newMovies: MovieItem[]) => {
    setMovies(newMovies);
    localStorage.setItem('app_movies_list', JSON.stringify(newMovies));
    saveMoviesToCloud(newMovies);
  }, []);

  const handleAddMovie = useCallback((newMovie: MovieItem) => {
    const updated = [newMovie, ...movies];
    updateMoviesData(updated);
  }, [movies, updateMoviesData]);

  const handleUpdateMovie = useCallback((updatedMovie: MovieItem) => {
    const updated = movies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m));
    updateMoviesData(updated);
  }, [movies, updateMoviesData]);

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

  // Domen yoniga /admin deb yozilganda admin paneli ochilishi
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

  const displayedMovies = useMemo(() => {
    return movies.filter((movie) => {
      if (filterCategory === 'serial') {
        return movie.category === 'Serial';
      }
      return movie.category === 'Kino';
    });
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

          {/* Seriallar va Qo'llab-quvvatlash ko'k bloki */}
          <QuickActions
            language={language}
            onSeriesClick={() => {
              setFilterCategory(filterCategory === 'serial' ? 'all' : 'serial');
            }}
          />

          <main className="px-3.5 pt-2 max-w-md mx-auto">
            {/* Sarlavha va Eslatma tugmasi */}
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 className="text-sm font-bold text-gray-400">
                {filterCategory === 'serial' ? 'Seriallar' : 'Barcha Kinolar'}
              </h2>

              <div className="flex items-center gap-2">
                {filterCategory === 'serial' && (
                  <button
                    onClick={() => setFilterCategory('all')}
                    className="text-xs text-blue-400 font-semibold hover:underline mr-1"
                  >
                    Barchasini ko'rsatish
                  </button>
                )}

                {/* Eslatma tugmasi */}
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
              <div className="grid grid-cols-3 gap-3">
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

      {/* Eslatma oynasi (Modal) */}
      {isNoticeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#161d31] border border-slate-700/60 rounded-2xl shadow-2xl p-5 text-white overflow-hidden">
            
            {/* Yopish tugmasi (X) */}
            <button
              onClick={() => setIsNoticeOpen(false)}
              className="absolute top-3.5 right-3.5 text-slate-400 hover:text-white bg-slate-800/80 p-1.5 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Sarlavha va belgi */}
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-xl">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Foydalanuvchilar diqqatiga!</h3>
            </div>

            {/* Matn qismi */}
            <div className="space-y-3 text-slate-300 text-xs leading-relaxed">
              <p>
                Assalomu Alekum aziz foydalanuvchilar botimzdagi bazi kinolar sifati pastroq va 480 720 p bolishi mumkin biz 0 mabla'g bilan  bu loyihani yartganimiz uchun bizda finans tomonlama yetishmovchiliklar bor buning uchun uzur soraymiz 🤝
              </p>
              <p>
                va agar biz kuchayib toliq yuqori sifatda kinolar yuklashimzni hohlasangiz quyidagi bank hisob raqamiga donat qilishingiz mumkin (ixtiyotiy) ☺️
              </p>
            </div>

            {/* Bank karta raqami */}
            <div className="mt-4 p-3 bg-slate-800/80 border border-slate-700/70 rounded-xl flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-blue-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 font-medium">Bank hisob raqami:</div>
                <div className="font-mono text-xs font-bold text-blue-300 tracking-wider">
                  9860 0101 1391 7065
                </div>
              </div>
            </div>

            {/* Tushunarli yopish tugmasi */}
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

      {/* Serial bosilganda uning barcha qismlarini chiqaruvchi Modal */}
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