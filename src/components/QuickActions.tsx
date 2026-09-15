import React from 'react';
import { Tv, MessageCircle } from 'lucide-react';

interface QuickActionsProps {
  onSeriesClick: () => void;
  language?: 'uz' | 'ru';
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSeriesClick,
  language = 'uz',
}) => {
  const t = {
    uz: {
      series: 'Seriallar',
      support: "Qo'llab-quvvatlash",
    },
    ru: {
      series: 'Сериалы',
      support: 'Поддержка',
    },
  }[language];

  const handleSupportClick = () => {
    const supportLink = 'https://t.me/alimjanove001';
    const tg = (window as any).Telegram?.WebApp;

    if (tg?.openTelegramLink) {
      tg.openTelegramLink(supportLink);
    } else {
      window.open(supportLink, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="px-3.5 mb-2 max-w-md mx-auto">
      {/* 2 va 3-rasmdagi kabi ko'k, burchaklari yumaloq va kalta/ixcham blok */}
      <div className="bg-blue-600 rounded-3xl p-2.5 shadow-lg shadow-blue-600/30 border border-blue-500/40">
        <div className="grid grid-cols-2 gap-2">
          {/* Seriallar tugmasi */}
          <button
            onClick={onSeriesClick}
            type="button"
            className="bg-blue-500/40 hover:bg-blue-500/60 active:scale-95 transition-all duration-200 py-3 px-3 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-xs border border-white/10 shadow-sm cursor-pointer"
          >
            <Tv className="w-4 h-4 text-white" />
            <span className="truncate">{t.series}</span>
          </button>

          {/* Qo'llab-quvvatlash tugmasi */}
          <button
            onClick={handleSupportClick}
            type="button"
            className="bg-blue-500/40 hover:bg-blue-500/60 active:scale-95 transition-all duration-200 py-3 px-3 rounded-2xl flex items-center justify-center gap-2 text-white font-bold text-xs border border-white/10 shadow-sm cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-white" />
            <span className="truncate">{t.support}</span>
          </button>
        </div>
      </div>
    </div>
  );
};