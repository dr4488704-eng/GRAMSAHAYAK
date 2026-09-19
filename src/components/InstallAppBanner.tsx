import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstallAppBanner: React.FC = () => {
  const { canInstallPWA, promptInstallApp, t } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const isStandalone = typeof window !== 'undefined' && (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );

  if (isStandalone || dismissed) return null;

  const handleInstall = () => {
    if (canInstallPWA) {
      void promptInstallApp();
      return;
    }

    window.alert(`${t('install_title')}: ${t('install_desc')}`);
  };

  return (
    <div className="bg-[#1b4332] text-white p-3 sm:px-4 shadow-md border-b border-[#2d6a4f]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2d6a4f] flex items-center justify-center shrink-0">
            <Download className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold">{t('install_title')}</h4>
            <p className="text-[11px] text-[#d8f3dc]">
              {t('install_desc')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => setDismissed(true)}
            className="px-2.5 py-1 text-xs text-[#d8f3dc] hover:text-white"
          >
            {t('later')}
          </button>
          <button
            onClick={handleInstall}
            className="px-3 py-1 bg-[#d8f3dc] hover:bg-white text-[#1b4332] text-xs font-bold rounded shadow-xs transition-colors"
          >
            {t('install_btn')}
          </button>
        </div>
      </div>
    </div>
  );
};
