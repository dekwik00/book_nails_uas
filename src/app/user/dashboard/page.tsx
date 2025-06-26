'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Slot } from '@/types/database';
import Link from 'next/link';

export default function UserDashboard() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          router.push('/user/login');
          return;
        }

        if (!session) {
          router.push('/user/login');
          return;
        }

        setUser(session.user);
        
        // Fetch slots
        const { data, error } = await supabase
          .from('slots')
          .select('*')
          .order('tanggal', { ascending: true })
          .order('jam', { ascending: true });

        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')

        console.log(profile)
        console.log(session.user.id)
        console.log(session.user.email)
        
        if (error) {
          console.error('Error fetching slots:', error);
          setError('Gagal memuat data slot');
        } else {
          setSlots(data || []);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/user/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/user/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const availableSlots = slots.filter(slot => slot.status === 'kosong');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-pink-600">Dashboard User</h2>
          <p className="text-gray-600">Selamat datang, {user?.email}</p>
        </div>
        <button 
          onClick={handleLogout} 
          className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Jadwal Slot Kosong</h3>
        {availableSlots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Tidak ada slot kosong saat ini.</p>
            <p className="text-sm mt-2">Silakan cek kembali nanti.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {availableSlots.map(slot => (
              <div 
                key={slot.id} 
                className="flex justify-between items-center p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div>
                  <span className="font-medium">
                    {new Date(slot.tanggal).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="text-gray-600 ml-2">• {slot.jam}</span>
                </div>
                <span className="text-green-600 font-semibold bg-green-100 px-2 py-1 rounded text-sm">
                  Tersedia
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex flex-col items-center gap-2 mt-4">
        <a
          href="https://wa.me/6285333860766?text=Halo%2C%20saya%20ingin%20booking%20slot%20nail%20art."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold shadow transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-whatsapp"><path d="M21.67 20.13a10 10 0 1 0-3.54 3.54l2.2-.63a1 1 0 0 0 .7-.7l.63-2.2z"></path><path d="M16.29 11.37a4 4 0 0 1-5.66 5.66l-.7-.7a1 1 0 0 1 0-1.41l.7-.7a1 1 0 0 1 1.41 0l.7.7a2 2 0 0 0 2.83 0l.7-.7a1 1 0 0 1 1.41 0z"></path></svg>
          Booking via WhatsApp
        </a>
      </div>
      
      <Link href="/" className="text-gray-600 hover:underline text-sm text-center">
        ← Kembali ke Beranda
      </Link>
    </div>
  );
} 