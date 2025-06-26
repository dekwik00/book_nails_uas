# Book Nails Art - Aplikasi Jadwal Slot Nails Art

Aplikasi web untuk mengelola jadwal slot kosong nails art dengan sistem role-based access control (User dan Admin).

## 🚀 Fitur

### User
- ✅ Registrasi dan login
- ✅ Melihat jadwal slot kosong
- ✅ Tampilan yang menarik dan responsif

### Admin
- ✅ Registrasi dan login
- ✅ Menambah slot jadwal baru
- ✅ Mengedit slot jadwal
- ✅ Menghapus slot jadwal
- ✅ Mengubah status slot (kosong/booked)

## 🛠️ Teknologi

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Row Level Security)
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Akun Supabase

## 🚀 Instalasi

1. **Clone repository**
```bash
git clone <repository-url>
cd book_nails_uas
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Supabase**
   - Buat project baru di [Supabase](https://supabase.com)
   - Copy URL dan anon key dari Settings > API
   - Update `src/lib/supabaseClient.ts` dengan credentials Anda
   - Jalankan SQL setup di SQL Editor Supabase (lihat file `supabase_setup.sql`)

4. **Jalankan aplikasi**
```bash
npm run dev
```

5. **Buka browser**
```
http://localhost:3000
```

## 🗄️ Database Setup

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Create custom user profiles table
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create slots table
CREATE TABLE public.slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL,
  jam TIME NOT NULL,
  status TEXT CHECK (status IN ('kosong', 'booked')) DEFAULT 'kosong',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'user');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Slots policies
CREATE POLICY "Users can view slots" ON public.slots
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert slots" ON public.slots
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update slots" ON public.slots
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can delete slots" ON public.slots
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.user_profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

## 👥 Menambahkan Admin

Setelah user terdaftar, jalankan SQL berikut untuk mengubah role menjadi admin:

```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

## 📁 Struktur Project

```
src/
├── app/
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── dashboard/page.tsx
│   ├── user/
│   │   ├── login/page.tsx
│   │   └── dashboard/page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── lib/
│   └── supabaseClient.ts
└── types/
    └── database.ts
```

## 🔐 Keamanan

- Row Level Security (RLS) diaktifkan
- Role-based access control
- Hanya admin yang bisa CRUD slot
- User hanya bisa melihat slot

## 🎨 UI/UX

- Design system konsisten dengan Tailwind CSS
- Responsive design
- Loading states
- Error handling
- User-friendly interface

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository di Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

### Manual
```bash
npm run build
npm start
```

## 📝 License

MIT License

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📞 Support

Untuk pertanyaan atau bantuan, silakan buat issue di repository ini.
