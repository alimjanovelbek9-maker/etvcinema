import React, { useState } from 'react';
import { Download, HardDrive } from 'lucide-react';
import type { MovieItem } from '../types';

interface UserMovieCardProps {
  movie: MovieItem & { caption?: string };
}

export const UserMovieCard: React.FC<UserMovieCardProps> = ({ movie }) => {
  const [imageError, setImageError] = useState(false);

<<<<<<< HEAD
  // JSON faylingizda 'title' bo'lmasa, 'caption'dan nomni ajratib olish
=======
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
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

<<<<<<< HEAD
  // Zaxira rasm (agar rasm topilmasa)
=======
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
  const fallbackImage = `https://via.placeholder.com/300x450/1e293b/ffffff?text=${encodeURIComponent(displayTitle)}`;
  const displayPoster = imageError || !movie.posterUrl ? fallbackImage : movie.posterUrl;

  return (
<<<<<<< HEAD
    <div className="bg-[#161f38] border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between">
      <div className="relative aspect-[3/4] w-full bg-slate-900 overflow-hidden">
=======
    <div className="bg-[#161f38] border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between shadow-md">
      <div className="relative aspect-[2/3] w-full bg-slate-900 overflow-hidden">
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
        <img 
          src={displayPoster} 
          alt={displayTitle} 
          onError={() => setImageError(true)}
          className="w-full h-full object-cover" 
        />
<<<<<<< HEAD
        <span className="absolute top-2 left-2 bg-blue-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-md">
=======
        <span className="absolute top-1 left-1 bg-blue-600/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md">
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
          {movie.quality ?? 'HD'}
        </span>
      </div>

<<<<<<< HEAD
      <div className="p-3 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-white text-sm line-clamp-1 mb-1">{displayTitle}</h3>
          <div className="flex items-center justify-between text-[11px] text-gray-400 mb-3">
            <span>{movie.category || 'Kino'}</span>
            {movie.fileSize && (
              <span className="flex items-center gap-1">
                <HardDrive className="w-3 h-3" /> {movie.fileSize}
=======
      <div className="p-1.5 flex flex-col justify-between flex-1">
        <div>
          <h3 className="font-bold text-white text-[11px] leading-tight truncate mb-1">{displayTitle}</h3>
          <div className="flex items-center justify-between text-[9px] text-gray-400 mb-2">
            <span className="truncate max-w-[60%]">{movie.category || 'Kino'}</span>
            {movie.fileSize && (
              <span className="flex items-center gap-0.5">
                <HardDrive className="w-2.5 h-2.5" /> {movie.fileSize}
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
              </span>
            )}
          </div>
        </div>

        <button
          onClick={handleDownload}
          type="button"
<<<<<<< HEAD
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-2 text-xs transition cursor-pointer"
        >
          <Download className="w-4 h-4" /> Yuklab olish
=======
          className="w-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold py-1.5 px-2 rounded-lg flex items-center justify-center gap-1 text-[10px] transition cursor-pointer"
        >
          <Download className="w-3 h-3" /> Yuklab olish
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
        </button>
      </div>
    </div>
  );
};