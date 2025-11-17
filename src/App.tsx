import { useState, useEffect, useMemo, useCallback } from 'react';
// FORCE VERCEL REBUILD - Timestamp: 2025-01-XX - This line forces a new commit hash
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import SampleGallery from './components/SampleGallery';
import Pricing from './components/Pricing';
import PhotoUpload from './components/PhotoUpload';
import PreviewComparison from './components/PreviewComparison';
import AffiliateSection from './components/AffiliateSection';
import ReferralSection from './components/ReferralSection';
import ReferralDashboard from './components/ReferralDashboard';
import Footer from './components/Footer';
import ConsentModal from './components/ConsentModal';
import HelpDeskChat from './components/HelpDeskChat';
import SecurityProtection from './components/SecurityProtection';
import AuthModal from './components/AuthModal';
import UserDashboard from './components/UserDashboard';
import ResultsGallery from './components/ResultsGallery';
import SuccessPage from './pages/success';
import CancelPage from './pages/cancel';
// import Espacio from '../pages/Espacio';
import { Language } from './lib/translations';
import { useAuth } from './lib/hooks/useAuth';
import { useOrder } from './lib/hooks/useOrder';
import { uploadPhoto } from './lib/services/photoService';
import { useToast, ToastContainer } from './components/Toast';
import { logger } from './lib/utils/logger';

type AppView = 'landing' | 'upload' | 'preview' | 'payment' | 'dashboard' | 'results' | 'success' | 'cancel';

function App() {
  const [lang, setLang] = useState<Language>('es');
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'stripe' | 'lemonsqueezy' | 'mercadopago'>('stripe');
  const { user } = useAuth();
  const { create: createOrder, checkout: createCheckout } = useOrder();
  const [processingPayment, setProcessingPayment] = useState(false);
  const { toasts, removeToast } = useToast();

  // Check URL path on mount and route changes
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/success' || path.startsWith('/success')) {
      setCurrentView('success');
    } else if (path === '/cancel' || path.startsWith('/cancel')) {
      setCurrentView('cancel');
    }
  }, []);

    //       } else if (path === '/espacio' || path.startsWith('/espacio')) {
    //       setCurrentView('espacio');
  // Memoize package photo count to avoid recreating on every render
  const packagePhotoCount = useMemo<Record<string, number>>(() => ({
    '1_photo': 1,
    '2_photos': 2,
    '3_photos': 3,
    'pet': 1,
    'family': 3
  }), []);

  // Memoize demo images to avoid recreating on every render
  const demoVersionA = useMemo(() => [
    'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=600'
  ], []);

  const demoVersionB = useMemo(() => [
    'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg?auto=compress&cs=tinysrgb&w=600',
    'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=600'
  ], []);

  // Memoize original image URLs to avoid recreating on every render
  const originalImageUrls = useMemo(() => 
    uploadedPhotos.map((photo) => URL.createObjectURL(photo)),
    [uploadedPhotos]
  );

  // Cleanup object URLs when component unmounts or photos change
  useEffect(() => {
    return () => {
      originalImageUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [originalImageUrls]);

  const handleGetStarted = useCallback(() => {
    const pricingSection = document.getElementById('pricing');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleSelectPackage = useCallback((packageType: string) => {
    // Si no está autenticado, mostrar modal de registro automáticamente
    if (!user) {
      setAuthMode('register');
      setShowAuthModal(true);
      // Guardar el paquete seleccionado para después del registro
      setSelectedPackage(packageType);
      return;
    }
    setSelectedPackage(packageType);
    setCurrentView('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [user]);

  const handlePhotosSelected = useCallback((photos: File[]) => {
    if (!consentAccepted && photos.length > 0) {
      setShowConsentModal(true);
      return;
    }
    setUploadedPhotos(photos);
  }, [consentAccepted]);

  const handleConsentAccept = useCallback(() => {
    setConsentAccepted(true);
    setShowConsentModal(false);
  }, []);

  const handleConsentDecline = useCallback(() => {
    setShowConsentModal(false);
    setUploadedPhotos([]);
  }, []);

  const handleContinueToPreview = useCallback(() => {
    setCurrentView('preview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSelectVersion = useCallback((version: 'A' | 'B', imageIndex: number) => {
    logger.log(`Selected version ${version} for image ${imageIndex}`);
  }, []);

  const handleBackToLanding = useCallback(() => {
    setCurrentView('landing');
    setSelectedPackage(null);
    setUploadedPhotos([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header
        lang={lang}
        onLanguageChange={setLang}
        onGetStarted={handleGetStarted}
      />

      {currentView === 'landing' && (
        <>
          <div id="home">
            <Hero lang={lang} onGetStarted={handleGetStarted} />
          </div>

          <div id="how-it-works">
            <HowItWorks lang={lang} />
          </div>

          <div id="samples">
            <SampleGallery lang={lang} />
          </div>

          <div id="pricing">
            <Pricing lang={lang} onSelectPackage={handleSelectPackage} />
          </div>

          <div id="affiliates">
            <AffiliateSection lang={lang} />
          </div>

          <ReferralSection lang={lang} />

          <div id="referrals">
            <ReferralDashboard lang={lang} />
          </div>
        </>
      )}

      {currentView === 'upload' && selectedPackage && (
        <div className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={handleBackToLanding}
              className="mb-8 text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 transition-colors"
            >
              ← {lang === 'es' ? 'Volver' : 'Back'}
            </button>

            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {lang === 'es' ? 'Sube tus Fotos' : 'Upload Your Photos'}
              </h2>
              <p className="text-lg text-slate-600">
                {lang === 'es'
                  ? `Selecciona hasta ${packagePhotoCount[selectedPackage]} foto(s) de alta calidad`
                  : `Select up to ${packagePhotoCount[selectedPackage]} high-quality photo(s)`}
              </p>
            </div>

            <PhotoUpload
              lang={lang}
              maxPhotos={packagePhotoCount[selectedPackage]}
              onPhotosSelected={handlePhotosSelected}
            />

            {uploadedPhotos.length > 0 && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleContinueToPreview}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  {lang === 'es' ? 'Generar Fotos Profesionales' : 'Generate Professional Photos'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {currentView === 'preview' && (
        <div className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setCurrentView('upload')}
              className="mb-8 text-slate-600 hover:text-slate-900 font-medium flex items-center gap-2 transition-colors"
            >
              ← {lang === 'es' ? 'Volver' : 'Back'}
            </button>

            <PreviewComparison
              lang={lang}
              originalImages={originalImageUrls}
              versionA={demoVersionA.slice(0, uploadedPhotos.length)}
              versionB={demoVersionB.slice(0, uploadedPhotos.length)}
              onSelectVersion={handleSelectVersion}
            />

            {/* Payment Method Selector */}
            <div className="mt-12 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">
                  {lang === 'es' ? 'Selecciona Método de Pago' : 'Select Payment Method'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setSelectedPaymentMethod('stripe')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'stripe'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Stripe</div>
                    <div className="text-sm text-slate-600 mt-1">Tarjeta de Crédito</div>
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('lemonsqueezy')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'lemonsqueezy'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-slate-200 hover:border-yellow-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Lemon Squeezy</div>
                    <div className="text-sm text-slate-600 mt-1">Múltiples Métodos</div>
                  </button>
                  <button
                    onClick={() => setSelectedPaymentMethod('mercadopago')}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedPaymentMethod === 'mercadopago'
                        ? 'border-emerald-500 bg-emerald-50'
                        : 'border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">Mercado Pago</div>
                    <div className="text-sm text-slate-600 mt-1">1 MXN (Prueba)</div>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={async () => {
                  if (!user || !selectedPackage) return;
                  
                  setProcessingPayment(true);
                  try {
                    // Subir fotos primero
                    const uploadIds: string[] = [];
                    for (const photo of uploadedPhotos) {
                      // Usar categoría 'mujer' por defecto (puede mejorarse con detección automática)
                      const result = await uploadPhoto(photo, user.id, 'mujer');
                      if (result.data) {
                        uploadIds.push(result.data.id);
                      }
                    }

                    if (uploadIds.length === 0) {
                      logger.error('Failed to upload photos');
                      // Toast will be shown by useToast
                      return;
                    }

                    // Crear orden
                    const order = await createOrder({
                      userId: user.id,
                      packageType: selectedPackage,
                      photoUploadIds: uploadIds,
                      paymentProvider: selectedPaymentMethod,
                    });

                    if (!order) {
                      logger.error('Failed to create order');
                      return;
                    }

                    // Crear checkout
                    const checkoutUrl = await createCheckout(order.id);
                    if (checkoutUrl) {
                      window.location.href = checkoutUrl;
                    } else {
                      logger.error('Failed to create checkout');
                    }
                  } catch (error: any) {
                    logger.error('Payment error:', error);
                  } finally {
                    setProcessingPayment(false);
                  }
                }}
                disabled={processingPayment || !user || uploadedPhotos.length === 0}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-5 rounded-full text-xl font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 disabled:hover:scale-100"
              >
                {processingPayment
                  ? lang === 'es'
                    ? 'Procesando...'
                    : 'Processing...'
                  : lang === 'es'
                  ? 'Proceder al Pago'
                  : 'Proceed to Payment'}
              </button>

              <p className="mt-4 text-slate-600">
                {lang === 'es'
                  ? 'Las imágenes sin marca de agua estarán disponibles después del pago'
                  : 'Unwatermarked images will be available after payment'}
              </p>
            </div>
          </div>
        </div>
      )}

      {currentView === 'dashboard' && (
        <UserDashboard
          lang={lang}
          onViewResults={(orderId) => {
            setSelectedOrderId(orderId);
            setCurrentView('results');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      )}

      {currentView === 'results' && selectedOrderId && (
        <ResultsGallery
          lang={lang}
          orderId={selectedOrderId}
          onClose={() => {
            setCurrentView('dashboard');
            setSelectedOrderId(null);
          }}
        />
      )}

      {currentView === 'success' && (
        <SuccessPage
          onNavigateHome={() => {
            setCurrentView('landing');
            window.location.href = '/';
          }}
          onNavigateDashboard={() => {
            setCurrentView('dashboard');
          }}
        />
      )}

      {currentView === 'cancel' && (
        <CancelPage
          onNavigateHome={() => {
            setCurrentView('landing');
            window.location.href = '/';
          }}
          onNavigatePricing={() => {
            setCurrentView('landing');
            setTimeout(() => {
              const pricingSection = document.getElementById('pricing');
              if (pricingSection) {
                pricingSection.scrollIntoView({ behavior: 'smooth' });
              }
            }, 100);
          }}
        />
      )}

      {/* {currentView === 'espacio' && (
        <Espacio />
      )} */}

      {currentView !== 'success' && currentView !== 'cancel' && (
        <Footer lang={lang} onLanguageChange={setLang} />
      )}
      <HelpDeskChat lang={lang} />
      <ConsentModal
        lang={lang}
        isOpen={showConsentModal}
        onAccept={handleConsentAccept}
        onDecline={handleConsentDecline}
      />
      <AuthModal
        lang={lang}
        isOpen={showAuthModal}
        onClose={() => {
          setShowAuthModal(false);
          // Si hay un paquete seleccionado y el usuario se autenticó, continuar al upload
          if (user && selectedPackage) {
            setCurrentView('upload');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        initialMode={authMode}
      />
      <ToastContainer toasts={toasts} onClose={removeToast} />
      <SecurityProtection />
    </div>
  );
}

export default App;
