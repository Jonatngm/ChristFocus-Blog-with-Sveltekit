import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';
import { AuthUser } from '@/types';

// Whitelist of authorized admin emails
const AUTHORIZED_EMAILS = ['victor@truthhub.blog'];

function mapUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    username: user.user_metadata?.username || user.email!.split('@')[0],
  };
}

class AuthService {
  mapUser(user: User): AuthUser {
    return mapUser(user);
  }

  async signUp(email: string, password: string, username: string) {
    // Security: Only allow authorized emails to register
    if (!AUTHORIZED_EMAILS.includes(email.toLowerCase())) {
      throw new Error('This email is not authorized to create an account');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });
    if (error) throw error;
    return data.user;
  }

  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data.user;
  }

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }
}

export const authService = new AuthService();
