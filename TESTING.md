# Panduan Testing - Book Nails Art

## 🧪 Testing Checklist

### 1. Setup Awal
- [ ] Database Supabase sudah dibuat
- [ ] SQL setup sudah dijalankan
- [ ] Aplikasi berjalan di `http://localhost:3000`

### 2. Testing User Flow

#### Registrasi User
1. Buka `http://localhost:3000`
2. Klik "Login User"
3. Klik "Belum punya akun? Daftar"
4. Isi email dan password
5. Klik "Daftar"
6. Verifikasi email (cek inbox atau spam)

#### Login User
1. Buka `http://localhost:3000/user/login`
2. Masukkan email dan password yang sudah terdaftar
3. Klik "Login"
4. Harus redirect ke dashboard user

#### Dashboard User
1. Setelah login, cek apakah:
   - [ ] Email user ditampilkan
   - [ ] Slot kosong ditampilkan dengan format yang benar
   - [ ] Tanggal ditampilkan dalam bahasa Indonesia
   - [ ] Status "Tersedia" ditampilkan dengan warna hijau
   - [ ] Tombol logout berfungsi

### 3. Testing Admin Flow

#### Registrasi Admin
1. Buka `http://localhost:3000/admin/login`
2. Klik "Belum punya akun? Daftar"
3. Isi email dan password
4. Klik "Daftar"
5. Verifikasi email

#### Menambahkan Admin Role
**Cara 1: SQL Editor**
```sql
UPDATE public.user_profiles 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

**Cara 2: Script Node.js**
```bash
node scripts/add-admin.js admin@example.com
```

#### Login Admin
1. Buka `http://localhost:3000/admin/login`
2. Masukkan email dan password admin
3. Klik "Login"
4. Harus redirect ke dashboard admin

#### Dashboard Admin
1. Setelah login, cek apakah:
   - [ ] Email admin ditampilkan
   - [ ] Form tambah slot ditampilkan
   - [ ] Daftar semua slot ditampilkan
   - [ ] Tombol edit dan hapus tersedia

#### CRUD Operations
1. **Tambah Slot:**
   - [ ] Isi tanggal dan jam
   - [ ] Pilih status (kosong/booked)
   - [ ] Klik "Tambah"
   - [ ] Slot baru muncul di daftar

2. **Edit Slot:**
   - [ ] Klik "Edit" pada slot yang ada
   - [ ] Form terisi dengan data slot
   - [ ] Ubah data
   - [ ] Klik "Update"
   - [ ] Data terupdate di daftar

3. **Hapus Slot:**
   - [ ] Klik "Hapus" pada slot
   - [ ] Konfirmasi dialog muncul
   - [ ] Klik "OK"
   - [ ] Slot hilang dari daftar

### 4. Testing Security

#### Role-based Access
- [ ] User tidak bisa akses `/admin/dashboard`
- [ ] Admin bisa akses `/admin/dashboard`
- [ ] User yang bukan admin mendapat alert "Anda tidak memiliki akses admin!"

#### Authentication
- [ ] User yang belum login diarahkan ke halaman login
- [ ] Logout berfungsi dan redirect ke login
- [ ] Session tersimpan setelah refresh halaman

### 5. Testing UI/UX

#### Responsive Design
- [ ] Tampilan bagus di desktop (1920x1080)
- [ ] Tampilan bagus di tablet (768x1024)
- [ ] Tampilan bagus di mobile (375x667)

#### Loading States
- [ ] Loading indicator muncul saat fetch data
- [ ] Loading indicator muncul saat login/register
- [ ] Button disabled saat loading

#### Error Handling
- [ ] Error message muncul saat login gagal
- [ ] Error message muncul saat CRUD gagal
- [ ] Form validation berfungsi

### 6. Testing Database

#### Row Level Security
- [ ] User hanya bisa melihat slot (SELECT)
- [ ] Admin bisa INSERT, UPDATE, DELETE slot
- [ ] User tidak bisa INSERT, UPDATE, DELETE slot

#### Data Integrity
- [ ] Tanggal dan jam tersimpan dengan benar
- [ ] Status hanya bisa 'kosong' atau 'booked'
- [ ] User profile otomatis dibuat saat registrasi

## 🐛 Troubleshooting

### Error: "must be owner of table users"
- **Solusi:** Hapus baris `ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;` dari SQL setup

### Error: "relation does not exist"
- **Solusi:** Pastikan SQL setup sudah dijalankan di Supabase SQL Editor

### Error: "invalid JWT"
- **Solusi:** Pastikan anon key di `supabaseClient.ts` benar

### Error: "permission denied"
- **Solusi:** Pastikan Row Level Security policies sudah dibuat

### User tidak bisa login
- **Solusi:** 
  1. Cek apakah email sudah diverifikasi
  2. Cek apakah password benar
  3. Cek console browser untuk error detail

### Admin tidak bisa CRUD
- **Solusi:** 
  1. Pastikan user sudah diubah role menjadi admin
  2. Cek apakah user profile sudah dibuat
  3. Cek RLS policies

## 📊 Performance Testing

### Load Testing
- [ ] Aplikasi tetap responsif dengan 100+ slot
- [ ] Loading time < 2 detik
- [ ] Memory usage stabil

### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## ✅ Acceptance Criteria

Aplikasi dianggap berhasil jika:
1. ✅ User bisa registrasi dan login
2. ✅ User bisa melihat slot kosong
3. ✅ Admin bisa registrasi dan login
4. ✅ Admin bisa CRUD slot
5. ✅ Security berfungsi (RLS, role-based access)
6. ✅ UI/UX menarik dan responsif
7. ✅ Error handling berfungsi
8. ✅ Loading states berfungsi 