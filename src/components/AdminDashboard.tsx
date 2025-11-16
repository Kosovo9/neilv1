'use client';

import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Users, DollarSign, ShoppingBag, TrendingUp, Activity } from 'lucide-react';
import { Language, translations } from '../lib/translations';
import { logger } from '../lib/utils/logger';

interface AdminDashboardProps {
  lang: Language;
}

export default function AdminDashboard({ lang }: AdminDashboardProps) {
  const t = translations[lang].admin;
  const supabase = createClientComponentClient();
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeAffiliates: 0,
    monthlyGrowth: 0
  });
  
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
    
    // Real-time subscription for orders
    const ordersSubscription = supabase
      .channel('orders-channel')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' },
        () => loadDashboardData()
      )
      .subscribe();

    // Real-time subscription for users
    const usersSubscription = supabase
      .channel('users-channel')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'users' },
        () => loadDashboardData()
      )
      .subscribe();

    return () => {
      ordersSubscription.unsubscribe();
      usersSubscription.unsubscribe();
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get total users
      const { count: usersCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get total orders and revenue
      const { data: orders } = await supabase
        .from('orders')
        .select('amount, status, created_at')
        .order('created_at', { ascending: false });

      const totalRevenue = orders?.reduce((sum, order) => 
        order.status === 'completed' ? sum + order.amount : sum, 0) || 0;

      // Get active affiliates
      const { count: affiliatesCount } = await supabase
        .from('affiliates')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get recent 10 orders
      const { data: recent } = await supabase
        .from('orders')
        .select('*, users(email)')
        .order('created_at', { ascending: false })
        .limit(10);

      // Calculate monthly growth
      const now = new Date();
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const { count: lastMonthOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', currentMonth.toISOString());

      const { count: currentMonthOrders } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', currentMonth.toISOString());

      const growth = lastMonthOrders ? 
        ((currentMonthOrders! - lastMonthOrders) / lastMonthOrders) * 100 : 0;

      setStats({
        totalUsers: usersCount || 0,
        totalOrders: orders?.length || 0,
        totalRevenue,
        activeAffiliates: affiliatesCount || 0,
        monthlyGrowth: growth
      });

      setRecentOrders(recent || []);
      setLoading(false);
    } catch (error) {
      logger.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Dashboard de Administración</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Usuarios</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalUsers}</p>
              </div>
              <Users className="w-12 h-12 text-purple-300" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Total Órdenes</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.totalOrders}</p>
              </div>
              <ShoppingBag className="w-12 h-12 text-blue-300" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Revenue Total</p>
                <p className="text-3xl font-bold text-white mt-2">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-300" />
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium">Afiliados Activos</p>
                <p className="text-3xl font-bold text-white mt-2">{stats.activeAffiliates}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-yellow-300" />
            </div>
          </div>
        </div>

        {/* Monthly Growth */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Crecimiento Mensual</h2>
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-400 mr-4" />
            <div>
              <p className="text-3xl font-bold text-white">
                {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}%
              </p>
              <p className="text-white/70 text-sm">vs. mes anterior</p>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Órdenes Recientes</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="pb-3 text-white/95 font-medium">ID</th>
                  <th className="pb-3 text-white/95 font-medium">Usuario</th>
                  <th className="pb-3 text-white/95 font-medium">Monto</th>
                  <th className="pb-3 text-white/95 font-medium">Estado</th>
                  <th className="pb-3 text-white/95 font-medium">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/10">
                    <td className="py-3 text-white/95 font-medium">{order.id.slice(0, 8)}...</td>
                    <td className="py-3 text-white/95">{order.users?.email || 'N/A'}</td>
                    <td className="py-3 text-white/95">${order.amount}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        order.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                        order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-white/95">
                      {new Date(order.created_at).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
