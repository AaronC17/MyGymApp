'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Calendar, CreditCard, User, LogOut } from 'lucide-react';
import Link from 'next/link';

interface Membership {
  _id: string;
  planType: string;
  startDate: string;
  endDate: string;
  status: string;
  price: number;
}

export default function ClientDashboard() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [membership, setMembership] = useState<Membership | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Early return if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Redirect admin to admin dashboard
    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
      return;
    }

    // Fetch membership if user exists
    const fetchMembership = async () => {
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/memberships', {
          params: { userId: user._id, status: 'active' },
        });
        if (response.data.memberships && response.data.memberships.length > 0) {
          setMembership(response.data.memberships[0]);
        }
      } catch (error) {
        console.error('Error fetching membership:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'expired':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'suspended':
        return 'Suspendida';
      case 'expired':
        return 'Expirada';
      default:
        return 'Desconocido';
    }
  };

  const formatPlanType = (planType: string): string => {
    return planType.charAt(0).toUpperCase() + planType.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Mi Dashboard</h1>
            <div className="flex items-center space-x-4">
              <Link href="/perfil" className="text-gray-700 hover:text-primary-600">
                <User className="h-5 w-5" />
              </Link>
              <button onClick={handleLogout} className="text-gray-700 hover:text-red-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Membership Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Mi Membresía</h2>
              {membership && (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(membership.status)}`}>
                  {getStatusText(membership.status)}
                </span>
              )}
            </div>

            {membership ? (
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>
                    Vence: {new Date(membership.endDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <CreditCard className="h-5 w-5 mr-2" />
                  <span>Plan: {formatPlanType(membership.planType)}</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-2xl font-bold text-primary-600">
                    ${membership.price}
                    <span className="text-sm text-gray-600 font-normal">/mes</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No tienes una membresía activa</p>
                <Link href="/planes" className="btn btn-primary">
                  Ver Planes
                </Link>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Accesos Rápidos</h2>
            <div className="space-y-3">
              <Link href="/recibos" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Ver Recibos</span>
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
              <Link href="/perfil" className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Editar Perfil</span>
                  <User className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

