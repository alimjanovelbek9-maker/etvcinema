import React from 'react';
import type { TelegramUser } from '../types';

interface HeaderProps {
  user: TelegramUser;
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  isDarkMode,
}) => {
  return (
    <header className="px-4 py-3 max-w-md mx-auto flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        {user.photo_url ? (
          <img src={user.photo_url} alt={user.first_name} loading="lazy" decoding="async" className="w-8 h-8 rounded-full object-cover border border-blue-400 shadow-md" />
        ) : (
          <div className="w-8 h-8 rounded-full bg-rose-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
            {user.first_name?.[0]?.toUpperCase() || 'U'}
          </div>
        )}
        <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {user.username ? `@${user.username}` : `${user.first_name} ${user.last_name || ''}`}
        </span>
      </div>
    </header>
  );
};