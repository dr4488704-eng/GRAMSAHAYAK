import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Bookmark, MessageSquareText, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { t, savedSchemeIds } = useApp();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-2 py-1">
      <div className="grid grid-cols-5 text-center">
        
        <Link
          to="/"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive('/') ? 'text-[#1b4332] font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight truncate">Home</span>
        </Link>

        <Link
          to="/schemes"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive('/schemes') ? 'text-[#1b4332] font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight truncate">{t('all_schemes')}</span>
        </Link>

        <Link
          to="/saved"
          className={`flex flex-col items-center justify-center py-1 transition-colors relative ${
            isActive('/saved') ? 'text-[#1b4332] font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Bookmark className="w-5 h-5 mb-0.5" />
          {savedSchemeIds.length > 0 && (
            <span className="absolute top-0 right-4 w-4 h-4 bg-[#1b4332] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {savedSchemeIds.length}
            </span>
          )}
          <span className="text-[10px] leading-tight truncate">{t('saved')}</span>
        </Link>

        <Link
          to="/assistant"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive('/assistant') ? 'text-[#1b4332] font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <MessageSquareText className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight truncate">Ask AI</span>
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center justify-center py-1 transition-colors ${
            isActive('/profile') ? 'text-[#1b4332] font-semibold' : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <User className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] leading-tight truncate">{t('profile')}</span>
        </Link>

      </div>
    </div>
  );
};
