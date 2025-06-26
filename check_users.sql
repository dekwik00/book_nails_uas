-- Query untuk melihat daftar user yang sudah terdaftar
SELECT 
  email,
  role,
  created_at
FROM public.user_profiles
ORDER BY created_at DESC; 