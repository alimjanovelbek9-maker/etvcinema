import React from 'react';
import { X, Play, Star, Tv } from 'lucide-react';
import type { MovieItem } from '../types';

interface SerialDetailModalProps {
  serial: MovieItem | null;
  onClose: () => void;
}

export const SerialDetailModal: React.FC<SerialDetailModalProps> = ({ serial, onClose }) => {
  if (!serial) return null;

  const handleOpenEpisode = (videoUrl: string) => {
    const tg = (window as any).Telegram?.WebApp;
    if (tg?.openTelegramLink) {
      tg.openTelegramLink(videoUrl);
    } else {
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center sm:items-center p-0 sm:p-4">
      <div className="bg-[#161f38] w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-slate-800 p-5 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-300">
        
        {/* Yuqori qism: Poster va Yopish */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex gap-3">
            <img src={serial.posterUrl} alt={serial.title} loading="lazy" decoding="async" className="w-20 h-28 object-cover rounded-2xl shadow-md border border-slate-700" />
            <div>
              <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                {serial.category}
              </span>
              <h2 className="text-lg font-bold text-white mt-1 leading-tight">{serial.title}</h2>
              <div className="flex items-center gap-1 text-amber-400 mt-1 text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{serial.rating || '8.0'}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-gray-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h3 className="text-xs font-bold text-gray-400 mb-3 flex items-center gap-1.5 border-t border-slate-800 pt-3">
          <Tv className="w-4 h-4 text-blue-400" /> Barcha Qismlar ({serial.episodes?.length || 0})
        </h3>

        {/* Qismlar Ro'yxati */}
        {!serial.episodes || serial.episodes.length === 0 ? (
          <p className="text-center text-xs text-gray-500 py-6">Ushbu serialga hozircha qismlar yuklanmagan.</p>
        ) : (
          <div className="space-y-2.5">
            {serial.episodes.map((ep) => (
              <div
                key={ep.id}
                onClick={() => handleOpenEpisode(ep.videoUrl)}
                className="bg-[#0d1222] hover:bg-blue-900/20 active:scale-98 border border-slate-800 hover:border-blue-500/50 p-3 rounded-2xl flex items-center justify-between transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-600/20 group-hover:bg-blue-600 text-blue-400 group-hover:text-white rounded-xl flex items-center justify-center transition">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{ep.episodeNumber}-Qism {ep.title ? `- ${ep.title}` : ''}</h4>
                    <span className="text-[10px] text-gray-500 font-mono">Kod: {ep.code}</span>
                  </div>
                </div>
                <button className="bg-blue-600/30 group-hover:bg-blue-600 text-blue-300 group-hover:text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition">
                  Ko'rish
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};