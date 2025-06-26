'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Slot } from '@/types/database';
import Link from 'next/link';

export default function AdminDashboard() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ tanggal: '', jam: '', status: 'kosong' as 'kosong' | 'booked' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [bookingFilter, setBookingFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          router.push('/admin/login');
          return;
        }

        if (!session) {
          router.push('/admin/login');
          return;
        }

        setUser(session.user);
        
        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        // yang aku tambahkan
        console.log(profile?.role)
        console.log(session.user.id)
        console.log(session.user.email)
        
        if (profileError) {
          console.error('Profile error:', profileError);
          setError('Gagal memverifikasi role admin');
          return;
        }
        
        if (profile?.role !== 'admin') {
          alert('Anda tidak memiliki akses admin!');
          router.push('/user/login');
          return;
        }
        
        setIsAdmin(true);
        fetchSlots();
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const fetchSlots = async () => {
    try {
      const { data, error } = await supabase
        .from('slots')
        .select('*')
        .order('tanggal', { ascending: true })
        .order('jam', { ascending: true });
      
      if (error) {
        console.error('Error fetching slots:', error);
        setError('Gagal memuat data slot');
      } else {
        setSlots(data || []);
      }
    } catch (error) {
      console.error('Fetch slots error:', error);
      setError('Gagal memuat data slot');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: name === 'status' ? (value as 'kosong' | 'booked') : value,
    });
  };

  const handleAdd = async () => {
    if (!form.tanggal || !form.jam) {
      alert('Tanggal dan jam harus diisi!');
      return;
    }

    try {
      const { error } = await supabase
        .from('slots')
        .insert([{ tanggal: form.tanggal, jam: form.jam, status: form.status }]);

      if (error) {
        alert('Error menambah slot: ' + error.message);
      } else {
        setForm({ tanggal: '', jam: '', status: 'kosong' });
        fetchSlots();
      }
    } catch (error) {
      console.error('Add slot error:', error);
      alert('Gagal menambah slot');
    }
  };

  const handleEdit = (slot: Slot) => {
    setEditId(slot.id);
    setForm({ tanggal: slot.tanggal, jam: slot.jam, status: slot.status });
  };

  const handleUpdate = async () => {
    if (!editId) return;

    try {
      const { error } = await supabase
        .from('slots')
        .update({ tanggal: form.tanggal, jam: form.jam, status: form.status })
        .eq('id', editId);

      if (error) {
        alert('Error mengupdate slot: ' + error.message);
      } else {
        setEditId(null);
        setForm({ tanggal: '', jam: '', status: 'kosong' });
        fetchSlots();
      }
    } catch (error) {
      console.error('Update slot error:', error);
      alert('Gagal mengupdate slot');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus slot ini?')) return;

    try {
      const { error } = await supabase
        .from('slots')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error menghapus slot: ' + error.message);
      } else {
        fetchSlots();
      }
    } catch (error) {
      console.error('Delete slot error:', error);
      alert('Gagal menghapus slot');
    }
  };

  // Helper untuk filter bookingan
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  
  const getFilteredBookings = () => {
    const bookedSlots = slots.filter(slot => slot.status === 'booked');
    
    switch (bookingFilter) {
      case 'today':
        return bookedSlots.filter(slot => slot.tanggal === todayStr);
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekAgoStr = weekAgo.toISOString().slice(0, 10);
        return bookedSlots.filter(slot => slot.tanggal >= weekAgoStr && slot.tanggal <= todayStr);
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        const monthAgoStr = monthAgo.toISOString().slice(0, 10);
        return bookedSlots.filter(slot => slot.tanggal >= monthAgoStr && slot.tanggal <= todayStr);
      default:
        return bookedSlots;
    }
  };

  const filteredBookings = getFilteredBookings();

  // Group bookings by date
  const bookingsByDate = filteredBookings.reduce((acc, slot) => {
    const date = slot.tanggal;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

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

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-pink-600">Dashboard Admin</h2>
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
        <h3 className="font-semibold text-lg mb-4">Kelola Slot Jadwal</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-6">
          <input 
            type="date" 
            name="tanggal" 
            value={form.tanggal} 
            onChange={handleChange} 
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500" 
          />
          <input 
            type="time" 
            name="jam" 
            value={form.jam} 
            onChange={handleChange} 
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500" 
          />
          <select 
            name="status" 
            value={form.status} 
            onChange={handleChange} 
            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          >
            <option value="kosong">Kosong</option>
            <option value="booked">Booked</option>
          </select>
          {editId ? (
            <button 
              onClick={handleUpdate} 
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 transition"
            >
              Update
            </button>
          ) : (
            <button 
              onClick={handleAdd} 
              className="bg-pink-500 text-white px-3 py-2 rounded hover:bg-pink-600 transition"
            >
              Tambah
            </button>
          )}
        </div>
        
        <div className="space-y-3">
          {slots.length === 0 ? (
            <p className="text-gray-500 text-center py-4">Belum ada slot jadwal.</p>
          ) : (
            slots.map(slot => (
              <div 
                key={slot.id} 
                className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
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
                  <span className={`ml-2 px-2 py-1 rounded text-xs ${
                    slot.status === 'kosong' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {slot.status === 'kosong' ? 'Kosong' : 'Booked'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(slot)} 
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(slot.id)} 
                    className="text-red-500 hover:underline text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* SECTION BARU: Detail Total Bookingan */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Detail Total Bookingan</h3>
        
        {/* Filter Options */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              bookingFilter === 'all' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setBookingFilter('all')}
          >
            Semua Bookingan
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              bookingFilter === 'today' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setBookingFilter('today')}
          >
            Hari Ini
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              bookingFilter === 'week' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setBookingFilter('week')}
          >
            7 Hari Terakhir
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              bookingFilter === 'month' 
                ? 'bg-pink-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setBookingFilter('month')}
          >
            30 Hari Terakhir
          </button>
        </div>

        {/* Summary Stats */}
        <div className="bg-pink-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">{filteredBookings.length}</p>
              <p className="text-sm text-gray-600">Total Bookingan</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">{Object.keys(bookingsByDate).length}</p>
              <p className="text-sm text-gray-600">Jumlah Tanggal</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-pink-600">
                {filteredBookings.length > 0 ? (filteredBookings.length / Object.keys(bookingsByDate).length).toFixed(1) : '0'}
              </p>
              <p className="text-sm text-gray-600">Rata-rata per Hari</p>
            </div>
          </div>
        </div>

        {/* Detail Bookingan per Tanggal */}
        {Object.keys(bookingsByDate).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Tidak ada bookingan untuk periode yang dipilih.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(bookingsByDate)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([date, dateBookings]) => (
                <div key={date} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-semibold text-lg">
                      {new Date(date).toLocaleDateString('id-ID', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h4>
                    <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded-full text-sm font-medium">
                      {dateBookings.length} Bookingan
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {dateBookings
                      .sort((a, b) => a.jam.localeCompare(b.jam))
                      .map((booking) => (
                        <div key={booking.id} className="bg-white border border-gray-200 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">{booking.jam}</p>
                              <p className="text-sm text-gray-600">Slot Booked</p>
                            </div>
                            <div className="text-right">
                              <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                Booked
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      
      <Link href="/" className="text-gray-600 hover:underline text-sm text-center">
        ← Kembali ke Beranda
      </Link>
    </div>
  );
} 