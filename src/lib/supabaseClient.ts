import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kfhmwipqohckjtpxdfxt.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtmaG13aXBxb2hja2p0cHhkZnh0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA1MDQxNDYsImV4cCI6MjA2NjA4MDE0Nn0.bK30m3VKDHcYaVHrKIkqzENKm87_Mo4BGY8SrOL08AI';

export const supabase = createBrowserClient<Database>(supabaseUrl, supabaseAnonKey); 