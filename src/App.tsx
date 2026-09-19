import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { ShieldCheck, Heart, ExternalLink, HelpCircle } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { InstallAppBanner } from './components/InstallAppBanner';

// Pages
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';
import { SchemesPage } from './pages/SchemesPage';
import { SchemeDetailPage } from './pages/SchemeDetailPage';
import { SavedPage } from './pages/SavedPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { AssistantPage } from './pages/AssistantPage';
import { NotificationsPage } from './pages/NotificationsPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminSchemesPage } from './pages/admin/AdminSchemesPage';
import { AdminSchemeFormPage } from './pages/admin/AdminSchemeFormPage';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#fcfbf9] text-[#1f2937] flex flex-col font-sans selection:bg-[#d8f3dc] selection:text-[#1b4332]">
          
          {/* PWA Install Banner */}
          <InstallAppBanner />

          {/* Top Sticky Header */}
          <Navbar />

          {/* Main Content Area */}
          <main className="flex-1 pb-16 md:pb-0">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/schemes" element={<SchemesPage />} />
              <Route path="/schemes/:id" element={<SchemeDetailPage />} />
              <Route path="/saved" element={<SavedPage />} />
              <Route path="/applications" element={<ApplicationsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/schemes" element={<AdminSchemesPage />} />
              <Route path="/admin/schemes/new" element={<AdminSchemeFormPage />} />
              <Route path="/admin/schemes/:id/edit" element={<AdminSchemeFormPage />} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Public Service Footer */}
          <footer className="bg-white border-t border-gray-200 mt-auto hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-gray-100 pb-6">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs">
                    GS
                  </div>
                  <span className="font-bold text-sm text-[#1b4332]">GramSahay AI</span>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-gray-500">Multilingual Rural Scheme Discovery & Assistance</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <Link to="/schemes" className="hover:text-[#1b4332]">Browse Schemes</Link>
                  <Link to="/profile" className="hover:text-[#1b4332]">Citizen Profile</Link>
                  <Link to="/assistant" className="hover:text-[#1b4332]">Voice Assistant</Link>
                  <Link to="/admin" className="text-[#2d6a4f] font-semibold hover:underline">Admin Portal</Link>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
                <p>
                  Information is provided for educational and public discovery purposes. Final eligibility is determined solely by respective government authorities.
                </p>
                <div className="flex items-center gap-2 shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  <span>Deterministic Rule Matching • PWA Offline Ready</span>
                </div>
              </div>
            </div>
          </footer>

          {/* Mobile Bottom Navigation Bar (Phone-Friendly) */}
          <MobileBottomNav />

        </div>
      </BrowserRouter>
    </AppProvider>
  );
}
