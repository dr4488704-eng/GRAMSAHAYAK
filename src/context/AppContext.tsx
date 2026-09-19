import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Language, 
  UserProfile, 
  Scheme, 
  Application, 
  AppNotification, 
  EligibilityResult,
  NotificationLog,
  NotificationType
} from '../types';
import { SEED_SCHEMES } from '../data/seedSchemes';
import { DEMO_PROFILES } from '../data/demoProfiles';
import { TRANSLATIONS, getTranslation } from '../i18n/translations';
import { evaluateEligibility } from '../utils/eligibilityEngine';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  updateProfileField: (field: keyof UserProfile, value: any) => void;
  schemes: Scheme[];
  savedSchemeIds: string[];
  toggleSaveScheme: (schemeId: string) => void;
  isSchemeSaved: (schemeId: string) => boolean;
  applications: Application[];
  addOrUpdateApplication: (appData: Partial<Application> & { scheme_id: string }) => void;
  deleteApplication: (id: string) => void;
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;
  loadDemoPersona: (personaId: string) => void;
  isOnline: boolean;
  canInstallPWA: boolean;
  promptInstallApp: () => Promise<void>;
  refreshData: () => Promise<void>;
  checkSchemeEligibility: (scheme: Scheme) => EligibilityResult;
  notificationLogs: NotificationLog[];
  sendNotification: (payload: {
    type: NotificationType;
    title: string;
    message: string;
    scheme_id?: string;
    email_data?: {
      recipient_email: string;
      recipient_name: string;
      subject: string;
      scheme_name: string;
      benefit_amount?: string;
      matching_reason: string;
      application_url?: string;
    };
  }) => Promise<void>;
  addScheme: (scheme: Scheme) => void;
  updateScheme: (scheme: Scheme) => void;
  deleteScheme: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  LANG: 'gramsahay_language',
  PROFILE: 'gramsahay_profile',
  SAVED: 'gramsahay_saved_schemes',
  APPLICATIONS: 'gramsahay_applications',
  NOTIFICATIONS: 'gramsahay_notifications',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    if (saved === 'te' || saved === 'ta' || saved === 'hi' || saved === 'en') return saved;
    return 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANG, lang);
    if (profile) {
      setProfileState(prev => {
        const updated = { ...prev, preferred_language: lang };
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
        return updated;
      });
    }
  };

  const t = useCallback((key: string) => {
    return getTranslation(language, key);
  }, [language]);

  // Profile (defaults to Ramesh Farmer profile for immediate judge demonstration)
  const [profile, setProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved profile', e);
      }
    }
    return DEMO_PROFILES[0]; // Ramesh by default
  });

  const setProfile = (newProfile: UserProfile) => {
    setProfileState(newProfile);
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(newProfile));
    // Also save to server if available
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProfile)
    }).catch(() => {
      // offline or demo mode fallback is normal
    });
  };

  const updateProfileField = (field: keyof UserProfile, value: any) => {
    setProfileState(prev => {
      const updated = { ...prev, [field]: value };
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    });
  };

  // Schemes
  const [schemes, setSchemes] = useState<Scheme[]>(SEED_SCHEMES);

  // Saved Schemes
  const [savedSchemeIds, setSavedSchemeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SAVED);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved scheme IDs', e);
      }
    }
    return ['pm-kisan', 'pmay-gramin'];
  });

  const toggleSaveScheme = (schemeId: string) => {
    setSavedSchemeIds(prev => {
      const next = prev.includes(schemeId) ? prev.filter(id => id !== schemeId) : [...prev, schemeId];
      localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(next));
      // Sync with server
      fetch('/api/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profile.id, schemeId, isSaved: next.includes(schemeId) })
      }).catch(() => {});
      return next;
    });
  };

  const isSchemeSaved = (schemeId: string) => savedSchemeIds.includes(schemeId);

  // Applications
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved applications', e);
      }
    }
    return [
      {
        id: 'app-demo-1',
        user_id: profile.id,
        scheme_id: 'pm-kisan',
        scheme_name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
        application_date: '2025-06-12',
        reference_number: 'PMK-AP-2025-88914',
        status: 'Under Review',
        notes: 'Submitted land records at local Rythu Bharosa Kendra (RBK). e-KYC completed.',
        created_at: '2025-06-12T10:00:00.000Z',
        updated_at: '2025-06-14T10:00:00.000Z'
      }
    ];
  });

  const addOrUpdateApplication = (appData: Partial<Application> & { scheme_id: string }) => {
    const scheme = schemes.find(s => s.id === appData.scheme_id);
    const existingIndex = applications.findIndex(a => a.scheme_id === appData.scheme_id);
    let updated: Application[];

    if (existingIndex >= 0) {
      updated = [...applications];
      updated[existingIndex] = {
        ...updated[existingIndex],
        ...appData,
        scheme_name: scheme?.name || updated[existingIndex].scheme_name,
        updated_at: new Date().toISOString()
      };
    } else {
      const newApp: Application = {
        id: 'app-' + Date.now(),
        user_id: profile.id,
        scheme_id: appData.scheme_id,
        scheme_name: scheme?.name || 'Government Scheme',
        application_date: appData.application_date || new Date().toISOString().split('T')[0],
        reference_number: appData.reference_number || '',
        status: appData.status || 'Ready to Apply',
        notes: appData.notes || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      updated = [newApp, ...applications];
    }

    setApplications(updated);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));

    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    }).catch(() => {});
  };

  const deleteApplication = (id: string) => {
    const updated = applications.filter(a => a.id !== id);
    setApplications(updated);
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(updated));
    fetch(`/api/applications/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved notifications', e);
      }
    }
    return [
      {
        id: 'notif-demo-1',
        user_id: profile.id,
        scheme_id: 'ysr-rythu-bharosa-ap',
        type: 'new_matching_scheme',
        title: 'New Matching Scheme: YSR Rythu Bharosa',
        message: 'A state farmer assistance scheme matching your Andhra Pradesh location and 2-acre landholding was verified.',
        read: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'notif-demo-2',
        user_id: profile.id,
        scheme_id: 'pm-kisan',
        type: 'application_reminder',
        title: 'PM-KISAN e-KYC Reminder',
        message: 'Ensure your Aadhaar is linked to your active bank account for direct benefit transfer.',
        read: true,
        created_at: new Date(Date.now() - 86400000).toISOString()
      }
    ];
  });

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => {
      const next = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(next));
      return next;
    });
    fetch(`/api/notifications/${id}/read`, { method: 'PUT' }).catch(() => {});
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => {
      const next = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(next));
      return next;
    });
    fetch(`/api/notifications/read-all`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: profile.id })
    }).catch(() => {});
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Demo Persona Loader
  const loadDemoPersona = (personaId: string) => {
    const target = DEMO_PROFILES.find(p => p.id === personaId);
    if (target) {
      setProfile(target);
      setLanguage(target.preferred_language);
    }
  };

  // Online / Offline Status
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // PWA Install Prompt
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPWA, setCanInstallPWA] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPWA(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const promptInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstallPWA(false);
    }
    setDeferredPrompt(null);
  };

  // Fetch schemes from backend API
  const refreshData = async () => {
    try {
      const res = await fetch('/api/schemes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setSchemes(data);
        }
      }
    } catch {
      // Offline fallback: SEED_SCHEMES remains active
    }

    // Refresh notifications
    try {
      const resNotif = await fetch(`/api/notifications/${profile.id}`);
      if (resNotif.ok) {
        const notifs = await resNotif.json();
        if (Array.isArray(notifs)) {
          setNotifications(notifs);
          localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
        }
      }
    } catch {
      // offline fallback
    }
  };

  useEffect(() => {
    refreshData();
  }, [profile.id]);

  // Schemes modification methods
  const addScheme = (newScheme: Scheme) => {
    setSchemes(prev => {
      const updated = [newScheme, ...prev];
      return updated;
    });
    fetch('/api/schemes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newScheme)
    }).catch(() => {});
  };

  const updateScheme = (updatedScheme: Scheme) => {
    setSchemes(prev => prev.map(s => s.id === updatedScheme.id ? updatedScheme : s));
    fetch(`/api/schemes/${updatedScheme.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedScheme)
    }).catch(() => {});
  };

  const deleteScheme = (id: string) => {
    setSchemes(prev => prev.filter(s => s.id !== id));
    fetch(`/api/schemes/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  // Notification logs state
  const [notificationLogs, setNotificationLogs] = useState<NotificationLog[]>(() => {
    const saved = localStorage.getItem('gramsahay_notif_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'log-demo-1',
        user_id: profile.id,
        scheme_id: 'ysr-rythu-bharosa-ap',
        notification_type: 'new_matching_scheme',
        recipient_email: profile.email || 'ramesh.farmer@gramsahay.gov.in',
        subject: 'GramSahay Alert: Potential match for YSR Rythu Bharosa',
        body_text: `Namaste Ramesh,\n\nBased on your registered profile in Andhra Pradesh with agricultural land, you may be eligible for YSR Rythu Bharosa (Benefit: ₹13,500 / year).\n\nMatched requirements:\n✓ Location matches Andhra Pradesh\n✓ Farmer occupation\n✓ Owns 2 acres of land\n\nTo apply, please visit your nearest Grama Sachivalayam or visit: https://ysrrythubharosa.ap.gov.in\n\nNotice: Final eligibility is determined exclusively by the respective government authority.`,
        html_preview: '<p>Notification preview</p>',
        delivery_channel: 'demo_mode',
        sent_at: new Date(Date.now() - 7200000).toISOString(),
        status: 'demo_preview'
      }
    ];
  });

  const sendNotification = async (payload: {
    type: NotificationType;
    title: string;
    message: string;
    scheme_id?: string;
    email_data?: {
      recipient_email: string;
      recipient_name: string;
      subject: string;
      scheme_name: string;
      benefit_amount?: string;
      matching_reason: string;
      application_url?: string;
    };
  }) => {
    // 1. Add in-app notification
    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      user_id: profile.id,
      type: payload.type,
      title: payload.title,
      message: payload.message,
      scheme_id: payload.scheme_id,
      read: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);

    // 2. Dispatch to backend API
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: profile.id,
          notification: newNotif,
          emailData: payload.email_data
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.log) {
          setNotificationLogs(prev => {
            const next = [data.log, ...prev];
            localStorage.setItem('gramsahay_notif_logs', JSON.stringify(next));
            return next;
          });
        }
      } else {
        throw new Error('Fallback to demo email log');
      }
    } catch {
      // Create client demo log
      if (payload.email_data) {
        const demoLog: NotificationLog = {
          id: 'log-' + Date.now(),
          user_id: profile.id,
          scheme_id: payload.scheme_id || '',
          notification_type: payload.type,
          recipient_email: payload.email_data.recipient_email,
          subject: payload.email_data.subject,
          body_text: `Namaste ${payload.email_data.recipient_name},\n\nBased on your registered profile, you may be eligible for ${payload.email_data.scheme_name}${payload.email_data.benefit_amount ? ` (${payload.email_data.benefit_amount})` : ''}.\n\nWhy this matches:\n${payload.email_data.matching_reason}\n\nOfficial Portal:\n${payload.email_data.application_url || 'https://india.gov.in'}\n\nDisclaimer: Final eligibility is determined exclusively by the relevant government department.`,
          html_preview: '<p>Demo mode</p>',
          delivery_channel: 'demo_mode',
          sent_at: new Date().toISOString(),
          status: 'demo_preview'
        };
        setNotificationLogs(prev => {
          const next = [demoLog, ...prev];
          localStorage.setItem('gramsahay_notif_logs', JSON.stringify(next));
          return next;
        });
      }
    }
  };

  const checkSchemeEligibility = useCallback((scheme: Scheme) => {
    return evaluateEligibility(profile, scheme);
  }, [profile]);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        profile,
        setProfile,
        updateProfileField,
        schemes,
        savedSchemeIds,
        toggleSaveScheme,
        isSchemeSaved,
        applications,
        addOrUpdateApplication,
        deleteApplication,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        loadDemoPersona,
        isOnline,
        canInstallPWA,
        promptInstallApp,
        refreshData,
        checkSchemeEligibility,
        notificationLogs,
        sendNotification,
        addScheme,
        updateScheme,
        deleteScheme
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
