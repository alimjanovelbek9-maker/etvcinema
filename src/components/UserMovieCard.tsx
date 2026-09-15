import React, { useState } from 'react';
import { Download, HardDrive } from 'lucide-react';
import type { MovieItem } from '../types';

interface UserMovieCardProps {
  movie: MovieItem & { caption?: string };
}

export const UserMovieCard: React.FC<UserMovieCardProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);

  // JSON faylingizda 'title' bo'lmasa, 'caption'dan nomni ajratib olish
  const displayTitle = movie.title || movie.caption?.split('\n')[0]?.replace(/\*+/g, '') || 'Kino';

  const BOT_USERNAME = "EtvCinema_bot";
  const botLink = `https://t.me/${BOT_USERNAME}?start=${movie.id}`;

  const handleDownload = () => {
    const tg = window.Telegram?.WebApp;
    if (tg && typeof tg.openTelegramLink === 'function') {
      tg.openTelegramLink(botLink);
    } else {
      window.open(botLink, '_blank');
    }
  };

  // Zaxira rasm (agar rasm topilmasa)
  const fallbackImage = `https://via.placeholder.com/300x450/1e293b/ffffff?text=${encodeURIComponent(displayTitle)}`;
  const displayPoster = imageError || !movie.posterUrl ? fallbackImage : movie.posterUrl;

  return (
    <div className="bg-[#161f38] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
      <div className="relative aspect-[3/4] w-full bg-slate-900 overflow-hidden">
        <img 
          src={displayPoster} 
          alt={displayTitle} 
          onError={() => setImageError(true)}
          className="w-full h-full object-cover" 
        />
        <span className="absolute top-2 left-2 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
          {movie.quality ?? 'HD'}
        </span>
      </div>

      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{displayTitle}</h3>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
            <span>{movie.category || 'Kino'}</span>
            {movie.fileSize && (
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> {movie.fileSize}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleDownload}
          type="button"
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition cursor-pointer"
        >
          <Download className="w-4 h-4" /> Yuklab olish
        </button>
      </div>
    </div>
  );
};