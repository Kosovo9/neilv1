/**
 * Success Page - Payment Completed
 * Displays success message after successful payment
 */

import { useEffect, useState } from 'react';
import { CheckCircle, Home, Package } from 'lucide-react';

interface SuccessPageProps {
  onNavigateHome?: () => void;
  onNavigateDashboard?: () => void;
}

export default function SuccessPage({ onNavigateHome, onNavigateDashboard }: SuccessPageProps) {
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

  const handleDashboard = () => {
    if (onNavigateDashboard) {
      onNavigateDashboard();
    } else {
      window.location.href = '/#dashboard';
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
      <div className="max-w-2xl w-full bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-emerald-500/50 shadow-2xl">
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

          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-16 h-16 text-emerald-400" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ¡Pago Exitoso!
          </h1>
          <p className="text-xl text-emerald-200/90 mb-8">
            Tu pago ha sido procesado correctamente
          </p>

          {orderId && (
            <div className="bg-white/5 rounded-xl p-4 mb-8 border border-emerald-500/30">
              <p className="text-sm text-emerald-300/80 mb-2">ID de Orden:</p>
              <p className="text-lg font-mono text-emerald-200">{orderId}</p>
            </div>
          )}

          {/* Info Box */}
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl p-6 mb-8 border border-emerald-500/30">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-6 h-6 text-emerald-300" />
              <h2 className="text-xl font-semibold text-white">
                Próximos Pasos
              </h2>
            </div>
            <p className="text-emerald-100/90">
              Estamos procesando tu pedido. Recibirás un correo electrónico con
              los detalles y tus fotos profesionales estarán listas en breve.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleHome}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Volver al Inicio
            </button>
            <button
              onClick={handleDashboard}
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-full font-bold transition-all duration-300 border-2 border-white/20 hover:border-emerald-400/50"
            >
              <Package className="w-5 h-5" />
              Ver Mis Pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

