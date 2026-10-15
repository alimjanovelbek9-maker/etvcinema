import React, { useState } from 'react';
import { Star, Play, X, Tv } from 'lucide-react';
import type { MovieItem } from '../types';

interface MovieCardProps {
  item: MovieItem;
  isDarkMode?: boolean;
}

export const MovieCard: React.FC<MovieCardProps> = ({ item }) => {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const title = item.title;
  const category = item.category || 'Kino';
  const posterUrl = item.posterUrl;
  const rating = item.rating || '8.0';

  const botLink = `https://t.me/EtvCinema_bot?start=${item.id}`;

  const handleOpenBot = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tg = window.Telegram?.WebApp;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(botLink);
    } else {
      window.open(botLink, '_blank');
    }
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

<<<<<<< HEAD
  // Zaxira rasm (agar kiritilgan posterUrl ishlamasa)
=======
  // Zaxira rasm
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
  const fallbackImage = `https://via.placeholder.com/300x450/1e293b/ffffff?text=${encodeURIComponent(item.title)}`;
  const displayPoster = imageError || !posterUrl ? fallbackImage : posterUrl;

  return (
    <>
      {/* Karta */}
      <div 
        onClick={handleCardClick}
<<<<<<< HEAD
        className="cursor-pointer group relative rounded-2xl overflow-hidden bg-[#161f38] border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg active:scale-95"
      >
        <div className="aspect-[2/3] relative overflow-hidden bg-slate-900">
=======
        className="cursor-pointer group relative rounded-xl overflow-hidden bg-[#161f38] border border-slate-800 hover:border-blue-500/50 transition-all duration-300 shadow-md active:scale-95 flex flex-col justify-between"
      >
        <div className="aspect-[2/3] relative overflow-hidden bg-slate-900 w-full">
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
          <img 
            src={displayPoster} 
            alt={title} 
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
<<<<<<< HEAD
          <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1 text-[10px] font-bold text-amber-400 border border-amber-400/20">
            <Star className="w-3 h-3 fill-amber-400" />
=======
          <div className="absolute top-1 right-1 bg-black/75 backdrop-blur-md px-1.5 py-0.5 rounded-full flex items-center gap-0.5 text-[9px] font-bold text-amber-400 border border-amber-400/20">
            <Star className="w-2.5 h-2.5 fill-amber-400" />
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
            {rating}
          </div>
        </div>

<<<<<<< HEAD
        <div className="p-2.5">
          <h3 className="text-xs font-semibold truncate text-white">{title}</h3>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-gray-400 truncate max-w-[60%]">{category}</span>
            <span className="text-[10px] text-blue-400 font-mono font-bold bg-blue-500/10 px-1.5 py-0.5 rounded">#{item.id}</span>
=======
        <div className="p-1.5">
          <h3 className="text-[11px] font-semibold truncate leading-tight text-white">{title}</h3>
          <div className="flex items-center justify-between mt-1 gap-1">
            <span className="text-[9px] text-gray-400 truncate max-w-[55%]">{category}</span>
            <span className="text-[9px] text-blue-400 font-mono font-bold bg-blue-500/10 px-1 py-0.2 rounded">#{item.id}</span>
>>>>>>> 671283a7db31b7ccdd2706a2b8414c5382f916d2
          </div>
        </div>
      </div>

      {/* Modal Oyna */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-[#161f38] border border-slate-700/80 w-full max-w-xs rounded-3xl p-5 text-center shadow-2xl relative">
            
            <button 
              onClick={() => setShowModal(false)} 
              className="absolute top-3 right-3 text-gray-400 hover:text-white bg-slate-800/80 p-1.5 rounded-full backdrop-blur-sm transition z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Poster Rasmi */}
            <div className="relative w-32 h-44 mx-auto mb-3 rounded-2xl overflow-hidden shadow-xl border border-slate-700 bg-slate-900">
              <img 
                src={displayPoster} 
                alt={title}
                loading="lazy"
                decoding="async"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover" 
              />
            </div>

            <h2 className="text-base font-bold text-white mb-1 line-clamp-1">{title}</h2>
            <p className="text-xs text-gray-400 mb-3">{category} • ⭐ {rating}</p>
            
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold px-3 py-1 rounded-full mb-5">
              <Tv className="w-3.5 h-3.5" />
              <span>Kino kodi: #{item.id}</span>
            </div>

            {/* Botga o'tish tugmasi */}
            <button
              onClick={handleOpenBot}
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-200 shadow-lg shadow-blue-600/30 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Botda tomosha qilish</span>
            </button>

          </div>
        </div>
      )}
    </>
  );
};