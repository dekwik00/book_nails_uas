-- Script untuk mengubah role user menjadi admin
-- Jalankan ini setelah user terdaftar di Supabase Auth

-- Ganti 'admin@example.com' dengan email admin yang sebenarnya
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com'; 