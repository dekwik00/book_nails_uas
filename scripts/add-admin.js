// Script untuk menambahkan admin
// Jalankan dengan: node scripts/add-admin.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nqhavobbrdbrdbrdlloiyqw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xaGF2b2JicmRicmRsbG9peXF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NDEzMzksImV4cCI6MjA2MjAxNzMzOX0.VeKGnga2kNoy2PFq__WJTG0V7YzOpXv0SV4yFOxPf50';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function listUsers() {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('email, role');

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    console.log('\n📋 Daftar User yang Terdaftar:');
    console.log('================================');
    data.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} (${user.role})`);
    });
    console.log('================================\n');
    
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function addAdmin(email) {
  try {
    // Update user role to admin
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ role: 'admin' })
      .eq('email', email);

    if (error) {
      console.error('Error updating user role:', error);
      return;
    }

    console.log(`✅ Successfully updated ${email} to admin role`);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function main() {
  const email = process.argv[2];
  
  if (!email) {
    console.log('🔍 Menampilkan daftar user...');
    await listUsers();
    console.log('💡 Untuk mengubah user menjadi admin, gunakan:');
    console.log('   node scripts/add-admin.js <email>');
    console.log('\n📝 Contoh:');
    console.log('   node scripts/add-admin.js user@example.com');
    return;
  }

  console.log(`🔄 Mengubah role ${email} menjadi admin...`);
  await addAdmin(email);
}

main(); 