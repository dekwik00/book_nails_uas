'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UserLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Clear any existing session on component mount
    const clearSession = async () => {
      await supabase.auth.signOut();
    };
    clearSession();
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/user/login`
          }
        });
        if (error) throw error;
        alert('Registrasi berhasil! Silakan cek email Anda untuk verifikasi.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) throw error;
        router.push('/user/dashboard');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      setError(error.message || 'Terjadi kesalahan saat login/registrasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
      <h2 className="text-2xl font-bold text-pink-600">
        {isRegistering ? 'Registrasi User' : 'Login User'}
      </h2>
      <form onSubmit={handleAuth} className="flex flex-col gap-4 w-full max-w-xs">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-500"
          required
        />
        {error && (
          <div className="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="bg-pink-500 text-white py-2 rounded hover:bg-pink-600 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : (isRegistering ? 'Daftar' : 'Login')}
        </button>
      </form>
      
      <div className="text-center">
        <button
          onClick={() => setIsRegistering(!isRegistering)}
          className="text-pink-600 hover:underline text-sm"
        >
          {isRegistering ? 'Sudah punya akun? Login' : 'Belum punya akun? Daftar'}
        </button>
      </div>
      
      <Link href="/" className="text-gray-600 hover:underline text-sm">
        ← Kembali ke Beranda
      </Link>
    </div>
  );
} 