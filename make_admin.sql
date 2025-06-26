-- Query untuk mengubah role user menjadi admin
-- Ganti 'your-email@example.com' dengan email yang sebenarnya

UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';

-- Verifikasi perubahan
SELECT email, role FROM public.user_profiles WHERE email = 'your-email@example.com'; 