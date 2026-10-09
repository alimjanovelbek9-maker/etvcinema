import React from 'react';
import { MessageCircle, Moon, Zap, Sun, Phone } from 'lucide-react';
import type { Language, TelegramUser } from '../types';

interface SettingsPageProps {
  user: TelegramUser;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  enhancedAnimations: boolean;
  onToggleAnimations: () => void;
  onSupportClick: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  user,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  enhancedAnimations,
  onToggleAnimations,
  onSupportClick,
}) => {
  const userPhone = user.phone_number || '';

  const t = {
    uz: {
      phone: "TELEFON RAQAMI",
      sharePhone: "Telefon raqamini ulashish",
      phoneAdded: "Raqam ulangan: ",
      lang: "TIL",
      services: "XIZMATLAR",
      support: "Qo'llab-quvvatlash",
      supportSub: "Savollar bo'yicha 24/7 yordam chati orqali bog'laning",
      boostAnim: "Animatsiyani kuchaytirish",
      boostAnimSub: "Yumshoq blur va silliq o'tishlarni yoqish",
      nightMode: "Tungi rejim",
      nightModeSub: isDarkMode ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish",
    },
    ru: {
      phone: "НОМЕР ТЕЛЕФОНА",
      sharePhone: "Поделиться номером телефона",
      phoneAdded: "Номер подключен: ",
      lang: "ЯЗЫК",
      services: "УСЛУГИ",
      support: "Поддержка",
      supportSub: "Свяжитесь с нами через чат 24/7",
      boostAnim: "Усилить анимацию",
      boostAnimSub: "Включить плавный blur и переходы",
      nightMode: "Ночной режим",
      nightModeSub: isDarkMode ? "Переключить на светлый режим" : "Переключить на ночной режим",
    }
  }[language];

  // Telegram orqali kontakt ulashish
  const handleRequestPhone = () => {
    return;
  };

  // Asosiy Sozlamalar ekrani
  return (
    <div className={`min-h-screen p-4 max-w-md mx-auto pb-28 ${isDarkMode ? 'bg-[#0d1222] text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Profil Ma'lumotlari */}
      <div className={`p-4 rounded-3xl border mb-5 ${isDarkMode ? 'bg-[#12182b] border-blue-900/40' : 'bg-white border-gray-200 shadow-sm'}`}>
        <div className="flex items-center gap-3 mb-4">
          {user.photo_url ? (
            <img src={user.photo_url} alt={user.first_name} loading="lazy" decoding="async" className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
          ) : (
            <div className="w-12 h-12 bg-gradient-to-tr from-rose-500 to-orange-400 rounded-full flex items-center justify-center text-white font-black text-lg">
              {user.first_name?.[0] || 'U'}
            </div>
          )}
          <div>
            <h3 className="font-bold text-base">{user.first_name} {user.last_name || ''}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                ID: {user.id}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Telefon Raqami */}
      <div className="mb-5">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{t.phone}</h4>
        <button
          onClick={handleRequestPhone}
          className={`w-full p-4 rounded-2xl border flex items-center gap-3 transition active:scale-98 ${isDarkMode ? 'bg-[#12182b] border-blue-900/40 hover:bg-[#18213b]' : 'bg-white border-gray-200 shadow-sm'}`}
        >
          <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
            <Phone className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">
            {userPhone ? `${t.phoneAdded} ${userPhone}` : t.sharePhone}
          </span>
        </button>
      </div>

      {/* Til Tanlash */}
      <div className="mb-5">
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{t.lang}</h4>
        <div className={`p-1.5 rounded-2xl border grid grid-cols-2 gap-1 ${isDarkMode ? 'bg-[#12182b] border-blue-900/40' : 'bg-white border-gray-200 shadow-sm'}`}>
          <button
            onClick={() => onLanguageChange('uz')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${language === 'uz' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}
          >
            O'zbekcha
          </button>
          <button
            onClick={() => onLanguageChange('ru')}
            className={`py-2.5 rounded-xl text-xs font-bold transition ${language === 'ru' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-400'}`}
          >
            Русский
          </button>
        </div>
      </div>

      {/* Xizmatlar */}
      <div>
        <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">{t.services}</h4>
        <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'bg-[#12182b] border-blue-900/40 divide-y divide-gray-800/50' : 'bg-white border-gray-200 shadow-sm divide-y divide-gray-100'}`}>
          {/* Qo'llab quvvatlash */}
          <div onClick={onSupportClick} className="p-4 flex items-center gap-3 cursor-pointer hover:bg-blue-500/5 transition">
            <div className="w-10 h-10 bg-sky-500/20 rounded-xl flex items-center justify-center text-sky-400">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h5 className="font-bold text-sm">{t.support}</h5>
              <p className="text-[11px] text-gray-400 leading-tight">{t.supportSub}</p>
            </div>
          </div>

          {/* Animatsiyani kuchaytirish */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-sm">{t.boostAnim}</h5>
                <p className="text-[11px] text-gray-400 leading-tight">{t.boostAnimSub}</p>
              </div>
            </div>
            <button
              onClick={onToggleAnimations}
              aria-label={t.boostAnim}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${enhancedAnimations ? 'bg-purple-600' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${enhancedAnimations ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Tungi / Yorug' rejim Switcher */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400/20 rounded-xl flex items-center justify-center text-amber-400">
                {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
              </div>
              <div>
                <h5 className="font-bold text-sm">{t.nightMode}</h5>
                <p className="text-[11px] text-gray-400 leading-tight">{t.nightModeSub}</p>
              </div>
            </div>

            <button
              onClick={onToggleTheme}
              className={`w-12 h-6 rounded-full transition-colors relative p-1 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};