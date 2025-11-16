import { useState, useEffect, useCallback, useMemo } from 'react';
import { User, Package, Clock, CheckCircle, XCircle, Download, Image as ImageIcon } from 'lucide-react';
import { Language } from '../lib/translations';
import { useAuth } from '../lib/hooks/useAuth';
import { getUserOrders, type Order } from '../lib/services/orderService';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/utils/logger';

interface UserDashboardProps {
  lang: Language;
  onViewResults?: (orderId: string) => void;
}

export default function UserDashboard({ lang, onViewResults }: UserDashboardProps) {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  const loadOrders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await getUserOrders(user.id);
      if (!error && data) {
        setOrders(data);
      } else if (error) {
        logger.error('Error loading orders:', error);
      }
    } catch (error) {
      logger.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user, loadOrders]);

  const getStatusBadge = useCallback((status: string) => {
    const statusConfig = {
      pending: { icon: Clock, color: 'bg-yellow-100 text-yellow-800', text: lang === 'es' ? 'Pendiente' : 'Pending' },
      processing: { icon: Clock, color: 'bg-blue-100 text-blue-800', text: lang === 'es' ? 'Procesando' : 'Processing' },
      completed: { icon: CheckCircle, color: 'bg-green-100 text-green-800', text: lang === 'es' ? 'Completado' : 'Completed' },
      failed: { icon: XCircle, color: 'bg-red-100 text-red-800', text: lang === 'es' ? 'Fallido' : 'Failed' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.text}
      </span>
    );
  }, [lang]);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === 'es' ? 'es-MX' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, [lang]);

  // Memoize translations
  const translations = useMemo(() => ({
    loading: lang === 'es' ? 'Cargando...' : 'Loading...',
    signIn: lang === 'es' ? 'Por favor inicia sesión' : 'Please sign in',
    title: lang === 'es' ? 'Mi Cuenta' : 'My Account',
    subtitle: lang === 'es' ? 'Gestiona tus órdenes y perfil' : 'Manage your orders and profile',
    orders: lang === 'es' ? 'Mis Órdenes' : 'My Orders',
    profile: lang === 'es' ? 'Perfil' : 'Profile',
    noOrders: lang === 'es' ? 'No tienes órdenes aún' : 'No orders yet',
    noOrdersDesc: lang === 'es' ? 'Comienza creando tu primera orden' : 'Start by creating your first order',
    order: lang === 'es' ? 'Orden' : 'Order',
    package: lang === 'es' ? 'Paquete' : 'Package',
    price: lang === 'es' ? 'Precio' : 'Price',
    date: lang === 'es' ? 'Fecha' : 'Date',
    method: lang === 'es' ? 'Método' : 'Method',
    viewPhotos: lang === 'es' ? 'Ver Fotos' : 'View Photos',
    fullName: lang === 'es' ? 'Nombre Completo' : 'Full Name',
    email: lang === 'es' ? 'Correo Electrónico' : 'Email',
    referralCode: lang === 'es' ? 'Código de Referido' : 'Referral Code',
    credits: lang === 'es' ? 'Créditos' : 'Credits',
    totalSpent: lang === 'es' ? 'Total Gastado' : 'Total Spent',
  }), [lang]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">{translations.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <p className="text-xl text-slate-600">{translations.signIn}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {translations.title}
          </h1>
          <p className="text-slate-600">{translations.subtitle}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'orders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-5 h-5 inline-block mr-2" />
            {translations.orders}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-4 px-6 font-semibold transition-colors ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-5 h-5 inline-block mr-2" />
            {translations.profile}
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl border-2 border-slate-200 p-12 text-center">
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  {translations.noOrders}
                </h3>
                <p className="text-slate-600 mb-6">
                  {translations.noOrdersDesc}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          <h3 className="text-lg font-bold text-slate-900">
                            {translations.order} #{order.id.substring(0, 8).toUpperCase()}
                          </h3>
                          {getStatusBadge(order.payment_status)}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 mb-1">{translations.package}</p>
                            <p className="font-semibold text-slate-900">{order.package_type}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">{translations.price}</p>
                            <p className="font-semibold text-slate-900">${order.final_price_mxn} MXN</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">{translations.date}</p>
                            <p className="font-semibold text-slate-900">{formatDate(order.created_at)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 mb-1">{translations.method}</p>
                            <p className="font-semibold text-slate-900">{order.payment_provider}</p>
                          </div>
                        </div>
                      </div>
                      {order.payment_status === 'completed' && (
                        <button
                          onClick={() => onViewResults?.(order.id)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
                        >
                          <Download className="w-5 h-5" />
                          {translations.viewPhotos}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {translations.fullName}
                </label>
                <p className="text-lg text-slate-900">{user.fullName || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {translations.email}
                </label>
                <p className="text-lg text-slate-900">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {translations.referralCode}
                </label>
                <p className="text-lg font-mono text-blue-600">{user.affiliateCode}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {translations.credits}
                </label>
                <p className="text-lg text-slate-900">{user.credits}</p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {translations.totalSpent}
                </label>
                <p className="text-lg text-slate-900">${user.totalSpent} MXN</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

