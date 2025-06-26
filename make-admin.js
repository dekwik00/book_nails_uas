const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

const supabaseUrl = 'https://nqhavobbrdbrdlloiyqw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaGF2b2JicmRicmRsbG9peXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NDEzMzksImV4cCI6MjA2MjAxNzMzOX0.VeKGnga2kNoy2PFq__WJTG0V7YzOpXv0SV4yFOxPf50';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function listUsers() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('email, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching users:', error.message);
      return;
    }

    if (data.length === 0) {
      console.log('📭 Tidak ada user yang terdaftar.');
      return;
    }

    console.log('\n📋 Daftar User yang Terdaftar:');
    console.log('================================');
    data.forEach((user, index) => {
      const status = user.role === 'admin' ? '👑 ADMIN' : '👤 USER';
      console.log(`${index + 1}. ${user.email} (${status})`);
    });
    console.log('================================\n');
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function makeAdmin(email) {
  try {
    console.log(`🔄 Mengubah role ${email} menjadi admin...`);
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('email', email)
      .select();

    if (error) {
      console.error('❌ Error updating user role:', error.message);
      return false;
    }

    if (data.length === 0) {
      console.log('❌ Email tidak ditemukan dalam database.');
      return false;
    }

    console.log('✅ Berhasil mengubah role menjadi admin!');
    console.log(`📧 Email: ${data[0].email}`);
    console.log(`👑 Role: ${data[0].role}`);
    return true;
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Book Nails Art - Admin Setup');
  console.log('================================\n');

  // Tampilkan daftar user
  const users = await listUsers();
  
  if (!users || users.length === 0) {
    rl.close();
    return;
  }

  // Tanya email yang akan diubah
  rl.question('📧 Masukkan email yang akan diubah menjadi admin: ', async (email) => {
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      console.log('❌ Email tidak boleh kosong!');
      rl.close();
      return;
    }

    const success = await makeAdmin(trimmedEmail);
    
    if (success) {
      console.log('\n🎉 Selesai! Sekarang Anda bisa login sebagai admin.');
      console.log('💡 Langkah selanjutnya:');
      console.log('   1. Kembali ke aplikasi');
      console.log('   2. Login dengan email yang baru diubah');
      console.log('   3. Akses dashboard admin');
    } else {
      console.log('\n❌ Gagal mengubah role. Silakan coba lagi.');
    }
    
    rl.close();
  });
}

main().catch(console.error); 