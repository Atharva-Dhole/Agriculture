import React, { useState, useEffect } from 'react';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AppHeader } from './components/AppHeader';
import { BottomNavigation } from './components/BottomNavigation';
import { VoiceAssistantModal } from './components/VoiceAssistantModal';
import { OnboardingModal } from './components/OnboardingModal';
import { HomeDashboard } from './components/HomeDashboard';
import { WeatherScreen } from './components/WeatherScreen';
import { CropsScreen } from './components/CropsScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { DiseaseDiagnosisScreen } from './components/DiseaseDiagnosisScreen';
import { MandiPricesScreen } from './components/MandiPricesScreen';
import { GovernmentSchemesScreen } from './components/GovernmentSchemesScreen';
import { CropRecommendationScreen } from './components/CropRecommendationScreen';
import { FarmJourneyScreen } from './components/FarmJourneyScreen';
import { SoilReportScreen } from './components/SoilReportScreen';
import { OutbreakAlertsScreen } from './components/OutbreakAlertsScreen';
import { RemindersScreen } from './components/RemindersScreen';
import { ProfileSettingsScreen } from './components/ProfileSettingsScreen';

import { storageService } from './services/storage';
import { weatherService } from './services/weatherService';
import { 
  FarmerProfile, 
  Crop, 
  FarmActivity, 
  SmartReminder, 
  SoilReport, 
  GovtScheme, 
  OutbreakAlert, 
  DiseaseDiagnosisResult, 
  WeatherData, 
  Language 
} from './types';

export default function App() {
  // Application Language
  const [language, setLanguage] = useState<Language>(() => storageService.getLanguage());

  // Farmer Profile
  const [profile, setProfile] = useState<FarmerProfile>(() => storageService.getProfile());

  // Screen State
  const [activeScreen, setActiveScreen] = useState<string>('home');
  const [screenHistory, setScreenHistory] = useState<string[]>(['home']);

  // Modals
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(() => !profile.onboardingCompleted);

  // Core Data
  const [crops, setCrops] = useState<Crop[]>(() => storageService.getCrops());
  const [activities, setActivities] = useState<FarmActivity[]>(() => storageService.getActivities());
  const [reminders, setReminders] = useState<SmartReminder[]>(() => storageService.getReminders());
  const [soilReports, setSoilReports] = useState<SoilReport[]>(() => storageService.getSoilReports());
  const [schemes, setSchemes] = useState<GovtScheme[]>(() => storageService.getSchemes());
  const [outbreaks, setOutbreaks] = useState<OutbreakAlert[]>(() => storageService.getOutbreaks());
  const [diagnosisHistory, setDiagnosisHistory] = useState<DiseaseDiagnosisResult[]>(() => storageService.getDiagnosisHistory());

  // Weather State
  const [weather, setWeather] = useState<WeatherData | null>(() => weatherService.getCachedWeather());
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null);
        }
      } catch (err) {
        setShowInstallGuide(true);
      }
    } else {
      setShowInstallGuide(true);
    }
  };

  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch initial weather for farmer's district
  useEffect(() => {
    const loadInitialWeather = async () => {
      setIsWeatherLoading(true);
      try {
        const query = profile.village || profile.district || 'छत्रपती संभाजीनगर';
        const data = await weatherService.fetchLiveWeather(query);
        setWeather(data);
      } catch (e) {
        console.warn('Initial weather load error:', e);
      } finally {
        setIsWeatherLoading(false);
      }
    };
    loadInitialWeather();
  }, [profile.district, profile.village]);

  // Handle hardware / browser back button for Android WebView
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.screen) {
        setActiveScreen(e.state.screen);
      } else {
        setActiveScreen('home');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigation Handler
  const handleNavigate = (screen: string) => {
    if (screen === activeScreen) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setScreenHistory(prev => [...prev, screen]);
    window.history.pushState({ screen }, '', `#${screen}`);
    setActiveScreen(screen);
  };

  // Toggle Language Handler
  const handleToggleLanguage = () => {
    const nextLang: Language = language === 'mr' ? 'en' : 'mr';
    setLanguage(nextLang);
    storageService.setLanguage(nextLang);
  };

  // Profile Save
  const handleSaveProfile = (newProfile: FarmerProfile) => {
    setProfile(newProfile);
    storageService.saveProfile(newProfile);
  };

  // Onboarding Complete
  const handleOnboardingComplete = (newProfile: FarmerProfile, newLang: Language) => {
    setProfile(newProfile);
    setLanguage(newLang);
    storageService.saveProfile(newProfile);
    storageService.setLanguage(newLang);
    setIsOnboardingOpen(false);
  };

  // Crops Handlers
  const handleAddCrop = (newCrop: Omit<Crop, 'id' | 'createdAt'>) => {
    const created = storageService.addCrop(newCrop);
    setCrops(storageService.getCrops());
  };

  const handleUpdateCrop = (id: string, updates: Partial<Crop>) => {
    storageService.updateCrop(id, updates);
    setCrops(storageService.getCrops());
  };

  const handleDeleteCrop = (id: string) => {
    storageService.deleteCrop(id);
    setCrops(storageService.getCrops());
  };

  // Activity Handlers
  const handleAddActivity = (act: Omit<FarmActivity, 'id'>) => {
    storageService.addActivity(act);
    setActivities(storageService.getActivities());
  };

  const handleDeleteActivity = (id: string) => {
    storageService.deleteActivity(id);
    setActivities(storageService.getActivities());
  };

  // Reminders Handlers
  const handleAddReminder = (rem: Omit<SmartReminder, 'id'>) => {
    storageService.addReminder(rem);
    setReminders(storageService.getReminders());
  };

  const handleToggleReminder = (id: string) => {
    storageService.toggleReminder(id);
    setReminders(storageService.getReminders());
  };

  const handleDeleteReminder = (id: string) => {
    storageService.deleteReminder(id);
    setReminders(storageService.getReminders());
  };

  // Scheme status update
  const handleUpdateSchemeStatus = (id: string, status: 'interested' | 'applied' | 'none') => {
    storageService.updateSchemeStatus(id, status);
    setSchemes(storageService.getSchemes());
  };

  // Soil Report save
  const handleSaveSoilReport = (report: Omit<SoilReport, 'id'>) => {
    storageService.saveSoilReport(report);
    setSoilReports(storageService.getSoilReports());
  };

  // Outbreak report
  const handleReportOutbreak = (outbreak: Omit<OutbreakAlert, 'id' | 'reportedDate' | 'reportCount' | 'verified'>) => {
    storageService.addOutbreakReport(outbreak);
    setOutbreaks(storageService.getOutbreaks());
  };

  // Save Diagnosis Result
  const handleSaveDiagnosis = (result: DiseaseDiagnosisResult) => {
    storageService.saveDiagnosisResult(result);
    setDiagnosisHistory(storageService.getDiagnosisHistory());
  };

  // Data Export & Import
  const handleExportData = () => {
    const jsonStr = storageService.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `krishi_mitra_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (jsonStr: string) => {
    return storageService.importData(jsonStr);
  };

  const handleResetData = () => {
    storageService.resetAllData();
    window.location.reload();
  };

  // Weather Refresh
  const handleRefreshWeather = async (query?: string) => {
    setIsWeatherLoading(true);
    try {
      const q = query || profile.village || profile.district || 'छत्रपती संभाजीनगर';
      const data = await weatherService.fetchLiveWeather(q);
      setWeather(data);
    } catch (e) {
      console.warn('Weather refresh error:', e);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Determine which bottom tab is active
  const bottomNavTab = ['home', 'crops', 'services', 'journey', 'weather'].includes(activeScreen) 
    ? activeScreen 
    : 'services';

  return (
    <div className="min-h-screen bg-stone-100 font-sans text-stone-900 flex justify-center antialiased select-none">
      
      {/* Mobile Device Frame Container (max-w-md on mobile, centered) */}
      <div className="w-full max-w-lg min-h-screen bg-stone-100 flex flex-col relative shadow-2xl border-x border-stone-200">
        
        {/* Native Android Status Bar */}
        <AndroidStatusBar />

        {/* Application Header */}
        <AppHeader
          language={language}
          onToggleLanguage={handleToggleLanguage}
          onOpenVoice={() => setIsVoiceOpen(true)}
          onOpenNotifications={() => handleNavigate('reminders')}
          activeScreen={activeScreen}
          onNavigate={handleNavigate}
          notificationCount={reminders.filter(r => !r.completed).length}
          isOffline={isOffline}
        />

        {/* Main Screen Router */}
        <main className="flex-1 p-3 sm:p-4 overflow-y-auto">
          {activeScreen === 'home' && (
            <HomeDashboard
              profile={profile}
              crops={crops}
              weather={weather}
              reminders={reminders}
              activities={activities}
              outbreaks={outbreaks}
              language={language}
              onNavigate={handleNavigate}
              onToggleReminder={handleToggleReminder}
              onOpenVoice={() => setIsVoiceOpen(true)}
              onInstallApp={handleInstallApp}
            />
          )}

          {activeScreen === 'crops' && (
            <CropsScreen
              crops={crops}
              language={language}
              onAddCrop={handleAddCrop}
              onUpdateCrop={handleUpdateCrop}
              onDeleteCrop={handleDeleteCrop}
            />
          )}

          {activeScreen === 'weather' && (
            <WeatherScreen
              weather={weather}
              language={language}
              onRefresh={handleRefreshWeather}
              isLoading={isWeatherLoading}
            />
          )}

          {activeScreen === 'services' && (
            <ServicesScreen
              language={language}
              onNavigate={handleNavigate}
              onOpenVoice={() => setIsVoiceOpen(true)}
            />
          )}

          {activeScreen === 'journey' && (
            <FarmJourneyScreen
              activities={activities}
              crops={crops}
              language={language}
              onAddActivity={handleAddActivity}
              onDeleteActivity={handleDeleteActivity}
            />
          )}

          {activeScreen === 'disease' && (
            <DiseaseDiagnosisScreen
              language={language}
              onSaveReport={handleSaveDiagnosis}
              savedReports={diagnosisHistory}
            />
          )}

          {activeScreen === 'mandi' && (
            <MandiPricesScreen
              language={language}
            />
          )}

          {activeScreen === 'schemes' && (
            <GovernmentSchemesScreen
              schemes={schemes}
              language={language}
              onUpdateSchemeStatus={handleUpdateSchemeStatus}
            />
          )}

          {activeScreen === 'recommendation' && (
            <CropRecommendationScreen
              language={language}
            />
          )}

          {activeScreen === 'soil' && (
            <SoilReportScreen
              soilReports={soilReports}
              language={language}
              onSaveSoilReport={handleSaveSoilReport}
            />
          )}

          {activeScreen === 'outbreaks' && (
            <OutbreakAlertsScreen
              outbreaks={outbreaks}
              language={language}
              onReportOutbreak={handleReportOutbreak}
            />
          )}

          {activeScreen === 'reminders' && (
            <RemindersScreen
              reminders={reminders}
              language={language}
              onAddReminder={handleAddReminder}
              onToggleReminder={handleToggleReminder}
              onDeleteReminder={handleDeleteReminder}
            />
          )}

          {activeScreen === 'settings' && (
            <ProfileSettingsScreen
              profile={profile}
              language={language}
              onSaveProfile={handleSaveProfile}
              onToggleLanguage={handleToggleLanguage}
              onExportData={handleExportData}
              onImportData={handleImportData}
              onResetData={handleResetData}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNavigation
          currentTab={bottomNavTab}
          onSelectTab={handleNavigate}
          language={language}
        />

        {/* Voice Assistant Modal */}
        <VoiceAssistantModal
          isOpen={isVoiceOpen}
          onClose={() => setIsVoiceOpen(false)}
          language={language}
          profile={profile}
        />

        {/* Onboarding Modal */}
        <OnboardingModal
          isOpen={isOnboardingOpen}
          onComplete={handleOnboardingComplete}
          currentProfile={profile}
          currentLanguage={language}
        />

        {/* In-App Install Guide Modal */}
        {showInstallGuide && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white max-w-sm w-full rounded-3xl p-5 shadow-2xl text-center space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl">
                📲
              </div>
              <h3 className="font-bold text-base text-stone-900">
                {language === 'mr' ? 'मोबाईलवर ॲप इन्स्टॉल करा' : 'Install on Your Phone'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed text-left bg-stone-50 p-3 rounded-2xl border border-stone-200">
                {language === 'mr' ? (
                  <>
                    १. तुमच्या क्रोम (Chrome) ब्राउझरच्या वरील उजव्या कोपऱ्यात <strong>तीन ठिपके (⋮)</strong> वर टॅप करा.<br />
                    २. <strong>"Add to Home screen"</strong> किंवा <strong>"Install app"</strong> निवडा.<br />
                    ३. ॲप थेट तुमच्या मोबाईल स्क्रीनवर इन्स्टॉल होईल!
                  </>
                ) : (
                  <>
                    1. Tap the <strong>three dots menu (⋮)</strong> in your Chrome mobile browser.<br />
                    2. Select <strong>"Add to Home screen"</strong> or <strong>"Install app"</strong>.<br />
                    3. Krishi Mitra will install directly onto your home screen!
                  </>
                )}
              </p>
              <button
                onClick={() => setShowInstallGuide(false)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                {language === 'mr' ? 'समजले (Close)' : 'Got it (Close)'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
