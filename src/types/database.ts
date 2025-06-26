export interface UserProfile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Slot {
  id: string;
  tanggal: string;
  jam: string;
  status: 'kosong' | 'booked';
  created_at: string;
  updated_at: string;
}

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserProfile, 'created_at' | 'updated_at'>>;
      };
      slots: {
        Row: Slot;
        Insert: Omit<Slot, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Slot, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
} 