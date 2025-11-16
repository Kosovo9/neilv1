/**
 * Cancel Page - Payment Cancelled/Failed
 * Displays cancellation message and options to retry
 */

import { useEffect, useState } from 'react';
import { XCircle, Home, ArrowLeft, CreditCard } from 'lucide-react';

interface CancelPageProps {
  onNavigateHome?: () => void;
  onNavigatePricing?: () => void;
}

export default function CancelPage({ onNavigateHome, onNavigatePricing }: CancelPageProps) {
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get order ID from URL params
    const urlParams = new URLSearchParams(window.location.search);
    const order = urlParams.get('order');
    setOrderId(order);
    
    // Simulate loading state
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleHome = () => {
    if (onNavigateHome) {
      onNavigateHome();
    } else {
      window.location.href = '/';
    }
  };

  const handlePricing = () => {
    if (onNavigatePricing) {
      onNavigatePricing();
    } else {
      window.location.href = '/#pricing';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-red-500/50 shadow-2xl">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8">
            <img
              src="/NexoraLOGO.jpg"
              alt="Studio Nexora Logo"
              className="h-24 mx-auto rounded-full shadow-xl"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Cancel Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-400" />
            </div>
          </div>

          {/* Cancel Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pago Cancelado
          </h1>
          <p className="text-xl text-red-200/90 mb-8">
            Tu pago no se completó. No se realizó ningún cargo.
          </p>

          {orderId && (
            <div className="bg-white/5 rounded-xl p-4 mb-8 border border-red-500/30">
              <p className="text-sm text-red-300/80 mb-2">ID de Orden:</p>
              <p className="text-lg font-mono text-red-200">{orderId}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl p-6 mb-8 border border-red-500/30">
            <h2 className="text-xl font-semibold text-white mb-3">
              ¿Qué pasó?
            </h2>
            <p className="text-red-100/90 mb-4">
              El proceso de pago fue cancelado. Esto puede suceder si:
            </p>
            <ul className="text-left text-red-100/80 space-y-2 max-w-md mx-auto">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Cancelaste el proceso de pago</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>Ocurrió un error durante el procesamiento</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>El método de pago no fue aceptado</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePricing}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-900 px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <CreditCard className="w-5 h-5" />
              Intentar de Nuevo
            </button>
            <button
              onClick={handleHome}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 border-2 border-white/20 hover:border-amber-400/50"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 border border-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
              Atrás
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

