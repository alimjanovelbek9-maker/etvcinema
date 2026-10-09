import React from 'react';
import { X } from 'lucide-react';
import type { MovieItem } from '../types';

interface VideoPlayerModalProps {
  movie: MovieItem | null;
  onClose: () => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ movie, onClose }) => {
  if (!movie) return null;

  const videoUrl = movie.videoUrl ?? '';
  const isTelegram = videoUrl.includes('t.me/');
  const telegramEmbedUrl = isTelegram
    ? `${videoUrl.replace(/\/$/, '')}?embed=1`
    : videoUrl;

  if (!videoUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#12182b] border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 text-center">
          <h2 className="text-white font-bold text-lg mb-2">Video mavjud emas</h2>
          <p className="text-gray-400 text-sm">Ushbu media uchun video havolasi yo‘q.</p>
          <button
            onClick={onClose}
            className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            Yopish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12182b] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative">
        {/* Yuqori qism (Header) */}
        <div className="flex justify-between items-center p-4 border-b border-slate-800">
          <h2 className="text-white font-bold text-sm md:text-base line-clamp-1">{movie.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Pleyer Zonasi */}
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {isTelegram ? (
            <iframe
              src={telegramEmbedUrl}
              className="w-full h-full border-0"
              scrolling="no"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          ) : (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            >
              Brauzeringiz video ijro etishni qo'llab-quvvatlamaydi.
            </video>
          )}
        </div>

        {/* Ma'lumotlar */}
        <div className="p-3.5 flex justify-between items-center text-xs text-gray-400 bg-[#0d1222]">
          <span>Kategoriya: <strong className="text-white">{movie.category}</strong></span>
          <span>Sifat: <strong className="text-white">{movie.quality ?? 'HD'}</strong></span>
        </div>
      </div>
    </div>
  );
};  