-- Create custom user profiles table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create slots table (only if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tanggal DATE NOT NULL,
  jam TIME NOT NULL,
  status TEXT CHECK (status IN ('kosong', 'booked')) DEFAULT 'kosong',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to handle user creation
-- Drop existing trigger and function first to avoid "already exists" error
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create the function that inserts a new row into public.user_profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
-- This is important! It makes the function run with admin privileges.
SECURITY DEFINER SET search_path = public AS $$
BEGIN
  -- Insert a new profile for the new user
  INSERT INTO public.user_profiles (id, email, role)
  VALUES (new.id, new.email, 'user');
  RETURN new;
END;
$$;

-- Create the trigger that calls the function on new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Row Level Security Policies

-- User profiles policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;

CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Slots policies
ALTER TABLE public.slots ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view slots" ON public.slots;
DROP POLICY IF EXISTS "Admins can insert slots" ON public.slots;
DROP POLICY IF EXISTS "Admins can update slots" ON public.slots;
DROP POLICY IF EXISTS "Admins can delete slots" ON public.slots;

-- Users can view all slots
CREATE POLICY "Users can view slots" ON public.slots
  FOR SELECT USING (true);

-- Only admins can insert, update, delete slots
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

-- Insert sample data (only if slots table is empty)
INSERT INTO public.slots (tanggal, jam, status) 
SELECT * FROM (VALUES
  ('2024-06-10'::date, '10:00:00'::time, 'kosong'),
  ('2024-06-10'::date, '13:00:00'::time, 'booked'),
  ('2024-06-11'::date, '09:00:00'::time, 'kosong'),
  ('2024-06-11'::date, '14:00:00'::time, 'kosong'),
  ('2024-06-12'::date, '11:00:00'::time, 'kosong'),
  ('2024-06-12'::date, '15:00:00'::time, 'booked')
) AS v(tanggal, jam, status)
WHERE NOT EXISTS (SELECT 1 FROM public.slots LIMIT 1);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_slots_updated_at ON public.slots;
CREATE TRIGGER update_slots_updated_at
  BEFORE UPDATE ON public.slots
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column(); 