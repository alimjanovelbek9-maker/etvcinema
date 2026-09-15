import React, { useState } from 'react';
import { ShieldLock, Film, Link as LinkIcon, ArrowLeft, Star, Tv, Plus, Layers } from 'lucide-react';
import type { MovieItem, EpisodeItem } from '../types';

interface AdminPanelProps {
  movies: MovieItem[];
  onAddMovie: (movie: MovieItem) => void;
  onUpdateMovie: (movie: MovieItem) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ movies, onAddMovie, onUpdateMovie, onClose }) => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [error, setError] = useState('');

  // Rejim: 'add_movie' (Kino/Serial yaratish) yoki 'manage_episodes' (Serial qismlarini boshqarish)
  const [activeTab, setActiveTab] = useState<'add_movie' | 'manage_episodes'>('add_movie');

  // Yangi Kino / Serial Form state'lari
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Kino' | 'Serial' | 'Multfilm' | 'Anime'>('Serial');
  const [posterUrl, setPosterUrl] = useState('');
  const [rating, setRating] = useState('8.5');
  const [fileId, setFileId] = useState(''); // Yagona kino bo'lsa

  // Serial qismini qo'shish uchun
  const [selectedSerialId, setSelectedSerialId] = useState<string>('');
  const [episodeNum, setEpisodeNum] = useState<number>(1);
  const [episodeTitle, setEpisodeTitle] = useState('');
  const [episodeFileId, setEpisodeFileId] = useState('');

  // Eng oxirgi kodni aniqlash (1000 dan boshlanadi)
  const getNextCode = (): number => {
    let maxCode = 999;
    movies.forEach((m) => {
      if (m.code && m.code > maxCode) maxCode = m.code;
      m.episodes?.forEach((e) => {
        if (e.code && e.code > maxCode) maxCode = e.code;
      });
    });
    return maxCode + 1;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'elbek2026') {
      setIsAuthorized(true);
      setError('');
    } else {
      setError('Parol noto\'g\'ri!');
    }
  };

  // Yangi Kino yoki Serial Yaratish
  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return alert('Nomi kiritilishi shart!');
    if (!posterUrl.trim()) return alert('Poster URL kiritilishi shart!');

    const nextCode = getNextCode();

    const newMovie: MovieItem = {
      id: Date.now().toString(),
      title: title.trim(),
      category: category as MovieItem['category'],
      posterUrl: posterUrl.trim(),
      rating: rating || '8.0',
      code: category !== 'Serial' ? nextCode : undefined,
      file_id: category !== 'Serial' ? fileId.trim() : undefined,
      videoUrl: category !== 'Serial' ? `https://t.me/EtvCinema_bot?start=${nextCode}` : undefined,
      episodes: category === 'Serial' ? [] : undefined,
      createdAt: Date.now(),
    };

    onAddMovie(newMovie);
    alert(`${category} muvaffaqiyatli yaratildi! Kodingiz: ${nextCode}`);

    setTitle('');
    setPosterUrl('');
    setFileId('');
    if (category === 'Serial') {
      setSelectedSerialId(newMovie.id);
      setActiveTab('manage_episodes');
    }
  };

  // Serialga Yangi Qism Qo'shish
  const handleAddEpisode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSerialId) return alert('Serialni tanlang!');
    if (!episodeFileId.trim()) return alert('Telegram File ID ni kiriting!');

    const targetSerial = movies.find((m) => m.id === selectedSerialId);
    if (!targetSerial) return;

    const nextCode = getNextCode();
    const newEpisode: EpisodeItem = {
      id: Date.now().toString(),
      episodeNumber: Number(episodeNum),
      title: episodeTitle.trim() || `${episodeNum}-Qism`,
      code: nextCode,
      file_id: episodeFileId.trim(),
      videoUrl: `https://t.me/EtvCinema_bot?start=${nextCode}`,
    };

    const updatedEpisodes = [...(targetSerial.episodes || []), newEpisode];
    const updatedSerial = { ...targetSerial, episodes: updatedEpisodes };

    onUpdateMovie(updatedSerial);
    alert(`Serialga ${episodeNum}-qism qo'shildi! Kodi: ${nextCode}`);

    setEpisodeNum(updatedEpisodes.length + 1);
    setEpisodeFileId('');
    setEpisodeTitle('');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0d1222] text-white p-4 max-w-md mx-auto flex items-center justify-center">
        <div className="bg-[#161f38] border border-slate-800 rounded-3xl p-6 shadow-2xl w-full">
          <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Bosh sahifaga
          </button>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-2xl flex items-center justify-center">
              <ShieldLock className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Admin Panel</h1>
              <p className="text-xs text-gray-400">Parolni kiriting</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && <p className="text-xs text-red-400 font-semibold">{error}</p>}
            <input
              type="password"
              placeholder="Parol"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl text-sm transition">
              Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  const serialsList = movies.filter((m) => m.category === 'Serial');
  const currentSelectedSerial = movies.find((m) => m.id === selectedSerialId);

  return (
    <div className="min-h-screen bg-[#0d1222] text-white p-4 max-w-md mx-auto pb-20">
      <button onClick={onClose} className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 text-sm">
        <ArrowLeft className="w-4 h-4" /> Bosh sahifaga qaytish
      </button>

      {/* Tab Navigatsiya */}
      <div className="grid grid-cols-2 gap-2 bg-[#161f38] p-1.5 rounded-2xl mb-4 border border-slate-800">
        <button
          onClick={() => setActiveTab('add_movie')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'add_movie' ? 'bg-blue-600 text-white' : 'text-gray-400'
          }`}
        >
          <Tv className="w-4 h-4" /> Yangi Serial / Kino
        </button>
        <button
          onClick={() => setActiveTab('manage_episodes')}
          className={`py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
            activeTab === 'manage_episodes' ? 'bg-blue-600 text-white' : 'text-gray-400'
          }`}
        >
          <Layers className="w-4 h-4" /> Qismlarni Boshqarish
        </button>
      </div>

      {activeTab === 'add_movie' ? (
        <div className="bg-[#161f38] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Film className="w-5 h-5 text-blue-400" />
            <h1 className="text-base font-bold">Yangi Serial yoki Kino Qo'shish</h1>
          </div>

          <form onSubmit={handleCreateMedia} className="space-y-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Nomi *</label>
              <input
                type="text"
                placeholder="Masalan: Qashqirlar Makoni"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Kategoriya</label>
                <select
                  value={category}
                  onChange={(e: any) => setCategory(e.target.value)}
                  className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                >
                  <option value="Serial">Serial</option>
                  <option value="Kino">Kino</option>
                  <option value="Multfilm">Multfilm</option>
                  <option value="Anime">Anime</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1 flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> Reyting
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">Poster Rasm URL *</label>
              <input
                type="url"
                placeholder="https://.../poster.jpg"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
              />
            </div>

            {category !== 'Serial' && (
              <div>
                <label className="text-xs text-gray-400 block mb-1">Telegram Video File ID *</label>
                <input
                  type="text"
                  placeholder="BAACAgIAAxkBAAE..."
                  value={fileId}
                  onChange={(e) => setFileId(e.target.value)}
                  className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
                />
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl text-sm transition mt-2 flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Yaratish va Saqlash
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-[#161f38] border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center gap-2 mb-4 border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-blue-400" />
            <h1 className="text-base font-bold">Serial Qismlarini Qo'shish</h1>
          </div>

          <div className="mb-4">
            <label className="text-xs text-gray-400 block mb-1">Serialni Tanlang</label>
            <select
              value={selectedSerialId}
              onChange={(e) => {
                setSelectedSerialId(e.target.value);
                const s = movies.find((m) => m.id === e.target.value);
                setEpisodeNum((s?.episodes?.length || 0) + 1);
              }}
              className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none"
            >
              <option value="">-- Serialni tanlang --</option>
              {serialsList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.episodes?.length || 0} ta qism)
                </option>
              ))}
            </select>
          </div>

          {selectedSerialId && (
            <form onSubmit={handleAddEpisode} className="space-y-4 border-t border-slate-800 pt-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">Qism #</label>
                  <input
                    type="number"
                    value={episodeNum}
                    onChange={(e) => setEpisodeNum(Number(e.target.value))}
                    className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-400 block mb-1">Qism Nomi (Ixtiyoriy)</label>
                  <input
                    type="text"
                    placeholder="Masalan: Boshlanish"
                    value={episodeTitle}
                    onChange={(e) => setEpisodeTitle(e.target.value)}
                    className="w-full bg-[#0d1222] border border-slate-700 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Telegram Video File ID *</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="BAACAgIAAxkBAAE..."
                    value={episodeFileId}
                    onChange={(e) => setEpisodeFileId(e.target.value)}
                    className="w-full bg-[#0d1222] border border-slate-700 rounded-xl pl-8 pr-3 py-2.5 text-sm focus:outline-none"
                  />
                  <LinkIcon className="w-4 h-4 text-gray-500 absolute left-2.5 top-3" />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 font-bold py-3 rounded-xl text-sm transition flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Qismni Qo'shish
              </button>
            </form>
          )}

          {/* Mavjud Qismlar Ro'yxati */}
          {currentSelectedSerial && currentSelectedSerial.episodes && currentSelectedSerial.episodes.length > 0 && (
            <div className="mt-6 border-t border-slate-800 pt-4">
              <h3 className="text-xs font-bold text-gray-400 mb-3">Mavjud Qismlar:</h3>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {currentSelectedSerial.episodes.map((ep) => (
                  <div key={ep.id} className="bg-[#0d1222] p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-blue-400">{ep.episodeNumber}-Qism</span>
                      <p className="text-gray-400 text-[10px]">{ep.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded font-mono text-[10px]">
                        Kod: {ep.code}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};