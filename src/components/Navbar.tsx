import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  MessageSquareText, 
  ShieldCheck, 
  Download, 
  WifiOff,
  Globe,
  ChevronDown,
  Check,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { DEMO_PROFILES } from '../data/demoProfiles';

export const Navbar: React.FC = () => {
  const { 
    language, 
    setLanguage, 
    t, 
    unreadNotificationsCount, 
    isOnline, 
    canInstallPWA, 
    promptInstallApp, 
    profile, 
    loadDemoPersona 
  } = useApp();

  const location = useLocation();
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const langMenuRef = useRef<HTMLDivElement>(null);
  const personaMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setShowLangMenu(false);
      }
      if (personaMenuRef.current && !personaMenuRef.current.contains(event.target as Node)) {
        setShowPersonaMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  const currentLangObj = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-40 bg-[#0f291e] text-white shadow-md border-b border-emerald-900/60 backdrop-blur-md">
      {/* Offline Alert Strip */}
      {!isOnline && (
        <div className="bg-amber-600 text-white text-xs font-medium px-4 py-1.5 flex items-center justify-center gap-2 shadow-inner">
          <WifiOff className="w-3.5 h-3.5" />
          <span>{t('offline_notice')}</span>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-4">
          
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-sm border border-emerald-400/30 group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" strokeLinecap="round"/>
                <path d="M4 18c4-1 6-4 6-7" strokeLinecap="round"/>
                <path d="M20 18c-4-1-6-4-6-7" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-emerald-300 transition-colors whitespace-nowrap">
                  {t('app_name')}
                </span>
                <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 uppercase tracking-wider hidden sm:inline whitespace-nowrap">
                  Public Portal
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-1.5 shrink-0">
            <Link
              to="/schemes"
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-[13px] font-medium transition-all whitespace-nowrap ${
                isActive('/schemes') 
                  ? 'bg-white/15 text-white font-semibold shadow-xs' 
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('all_schemes')}
            </Link>

            <Link
              to="/dashboard"
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-[13px] font-medium transition-all whitespace-nowrap ${
                isActive('/dashboard') 
                  ? 'bg-white/15 text-white font-semibold shadow-xs' 
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('dashboard')}
            </Link>

            <Link
              to="/saved"
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-[13px] font-medium transition-all whitespace-nowrap ${
                isActive('/saved') 
                  ? 'bg-white/15 text-white font-semibold shadow-xs' 
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('saved_schemes')}
            </Link>

            <Link
              to="/applications"
              className={`px-3 py-1.5 rounded-lg text-xs lg:text-[13px] font-medium transition-all whitespace-nowrap ${
                isActive('/applications') 
                  ? 'bg-white/15 text-white font-semibold shadow-xs' 
                  : 'text-emerald-100/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {t('applications')}
            </Link>

            {/* Featured Action: Ask GramSahay */}
            <Link
              to="/assistant"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm transition-all whitespace-nowrap hover:scale-[1.02] active:scale-[0.98] ${
                isActive('/assistant')
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-emerald-950 shadow-md ring-2 ring-emerald-300/50 font-bold'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white border border-emerald-300/30'
              }`}
            >
              <MessageSquareText className="w-3.5 h-3.5" />
              <span>Ask GramSahay</span>
            </Link>

            {/* Admin Overview Link */}
            <Link
              to="/admin"
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                isActive('/admin') 
                  ? 'bg-white/15 text-white font-semibold' 
                  : 'text-emerald-200/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('admin')}</span>
            </Link>
          </nav>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* Persona Switcher Pill Button */}
            <div className="relative" ref={personaMenuRef}>
              <button
                onClick={() => {
                  setShowPersonaMenu(!showPersonaMenu);
                  setShowLangMenu(false);
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 text-white rounded-full text-xs font-medium transition-all shadow-xs backdrop-blur-xs whitespace-nowrap cursor-pointer"
                title="Switch Demo Persona"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-400/30 shrink-0" />
                <span className="font-medium max-w-[90px] sm:max-w-none truncate">{profile.name}</span>
                <span className="text-[10px] text-emerald-200/80 hidden xl:inline">({profile.occupation})</span>
                <ChevronDown className={`w-3 h-3 text-emerald-200/70 transition-transform duration-200 ${showPersonaMenu ? 'rotate-180' : ''}`} />
              </button>

              {showPersonaMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white text-[#1f2937] rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-gray-100 text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    <span>{t('demo_profiles')}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">Verified Criteria</span>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-80 overflow-y-auto">
                    {DEMO_PROFILES.map((p) => {
                      const isCurrent = profile.id === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            loadDemoPersona(p.id);
                            setShowPersonaMenu(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 text-xs hover:bg-gray-50 flex items-center justify-between transition-colors ${
                            isCurrent ? 'bg-emerald-50/70 font-semibold text-emerald-950' : ''
                          }`}
                        >
                          <div>
                            <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                              <span>{p.name}</span>
                              <span className="text-gray-400 font-normal">({p.age} yrs)</span>
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5">
                              {p.occupation} • {p.state}
                            </div>
                          </div>
                          {isCurrent && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector Pill Button */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => {
                  setShowLangMenu(!showLangMenu);
                  setShowPersonaMenu(false);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-white/25 text-white rounded-full text-xs font-medium transition-all shadow-xs backdrop-blur-xs whitespace-nowrap cursor-pointer"
                aria-label="Change Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                <span className="font-medium">{currentLangObj.native}</span>
                <ChevronDown className={`w-3 h-3 text-emerald-200/70 transition-transform duration-200 ${showLangMenu ? 'rotate-180' : ''}`} />
              </button>

              {showLangMenu && (
                <div className="absolute right-0 mt-2 w-44 bg-white text-[#1f2937] rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-1 border-b border-gray-100 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Select Language
                  </div>
                  {languages.map((l) => {
                    const isSelected = language === l.code;
                    return (
                      <button
                        key={l.code}
                        onClick={() => {
                          setLanguage(l.code);
                          setShowLangMenu(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs hover:bg-gray-50 flex items-center justify-between transition-colors ${
                          isSelected ? 'bg-emerald-50/70 font-semibold text-emerald-950' : ''
                        }`}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{l.native}</div>
                          <div className="text-[10px] text-gray-400">{l.label}</div>
                        </div>
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Notifications Circular Button */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-full text-emerald-100 hover:text-white hover:bg-white/10 transition-colors shrink-0"
              aria-label={t('notifications')}
              title={t('notifications')}
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 bg-amber-400 text-emerald-950 font-extrabold text-[9px] rounded-full flex items-center justify-center ring-2 ring-[#0f291e] shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </Link>

            {/* PWA Install Button */}
            {canInstallPWA && (
              <button
                onClick={promptInstallApp}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-xs font-bold rounded-full shadow-xs transition-all whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t('install_btn')}</span>
              </button>
            )}

            {/* User Profile Avatar */}
            <Link
              to="/profile"
              className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white flex items-center justify-center font-bold text-xs border border-white/20 transition-all shadow-xs shrink-0"
              title={t('profile')}
            >
              {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};
