'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import { supabase, getCurrentUser, getCurrentSession } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string
  ) => Promise<{ error: Error | null; needsConfirmation?: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check active session on mount
    checkUser()

    // Listen for auth changes
    if (supabase) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        const user = session?.user ?? null

        // Only set user if email is confirmed
        if (user && user.email_confirmed_at) {
          setUser(user)
          setLoading(false)

          if (event === 'SIGNED_IN') {
            router.push('/')
          }
        } else if (user && !user.email_confirmed_at) {
          // User exists but email not confirmed - don't set user
          setUser(null)
          setLoading(false)
        } else {
          // No user - signed out
          setUser(null)
          setLoading(false)

          if (event === 'SIGNED_OUT') {
            router.push('/login')
          }
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } else {
      setLoading(false)
      return
    }
  }, [router])

  async function checkUser() {
    try {
      const session = await getCurrentSession()
      const user = session?.user ?? null

      // Only set user if email is confirmed
      if (user && user.email_confirmed_at) {
        setUser(user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Error checking user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function signInUser(
    email: string,
    password: string
  ): Promise<{ error: Error | null }> {
    try {
      if (!supabase) {
        return { error: new Error('Supabase not configured') }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        // Check if error is due to unconfirmed email
        if (error.message.includes('Email not confirmed')) {
          return {
            error: new Error(
              'Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
            ),
          }
        }
        return { error }
      }

      // Check if user's email is confirmed
      if (data.user && !data.user.email_confirmed_at) {
        // Sign out immediately if email not confirmed
        await supabase.auth.signOut()
        return {
          error: new Error(
            'Por favor confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
          ),
        }
      }

      setUser(data.user)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async function signUpUser(
    email: string,
    password: string
  ): Promise<{ error: Error | null; needsConfirmation?: boolean }> {
    try {
      if (!supabase) {
        return { error: new Error('Supabase not configured') }
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) {
        return { error }
      }

      // Check if email confirmation is required
      const session = data.session
      const user = data.user

      // If no session was created, email confirmation is required
      if (!session && user) {
        // Don't set user in state - they need to confirm email first
        return { error: null, needsConfirmation: true }
      }

      // If session exists, user is confirmed and can access the app
      if (user) {
        setUser(user)
      }

      return { error: null, needsConfirmation: false }
    } catch (error) {
      return { error: error as Error }
    }
  }

  async function signOutUser() {
    try {
      if (!supabase) return

      await supabase.auth.signOut()
      setUser(null)
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn: signInUser,
    signUp: signUpUser,
    signOut: signOutUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
