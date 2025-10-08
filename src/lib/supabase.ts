import { createClient, type User, type AuthError } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials not found. Cloud backup features will be disabled.'
  )
}

// Create Supabase client with auth configuration
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          storageKey: 'rolapp-auth-token',
        },
      })
    : null

// Helper to check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return supabase !== null
}

// Storage bucket name for campaign backups
export const BACKUP_BUCKET = 'campaign-backups'

// Auth helper functions
export async function signUp(
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> {
  if (!supabase) {
    return {
      user: null,
      error: { message: 'Supabase not configured' } as AuthError,
    }
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  return { user: data.user, error }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ user: User | null; error: AuthError | null }> {
  if (!supabase) {
    return {
      user: null,
      error: { message: 'Supabase not configured' } as AuthError,
    }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { user: data.user, error }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  if (!supabase) {
    return { error: { message: 'Supabase not configured' } as AuthError }
  }

  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser(): Promise<User | null> {
  if (!supabase) return null

  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentSession() {
  if (!supabase) return null

  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session
}
