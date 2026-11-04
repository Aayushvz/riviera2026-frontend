"use client"

import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, signOutCompletely } from "@/lib/supabase"
import { FancyButton } from "@/components/ui/fancy-button"
import { Loader } from "lucide-react"

export default function Home({ isSignedIn }: { isSignedIn: () => void }) {
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const email = session.user.email || ""
        if (
          email.endsWith("@vitstudent.ac.in") ||
          email.endsWith("@vit.ac.in")
        ) {
          setUser(session.user)
        } else {
          setError(
            "Only VIT email (@vitstudent.ac.in or @vit.ac.in) is allowed",
          )
          await signOutCompletely()
          setUser(null)
        }
      }
      setLoading(false)
    }
    checkUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const email = session.user.email || ""
        if (
          email.endsWith("@vitstudent.ac.in") ||
          email.endsWith("@vit.ac.in")
        ) {
          setUser(session.user)
          isSignedIn()
        } else {
          setError(
            "Only VIT email (@vitstudent.ac.in or @vit.ac.in) is allowed",
          )
          signOutCompletely()
          setUser(null)
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [isSignedIn])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      setError("")

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            hd: "vitstudent.ac.in",
          },
        },
      })

      if (error) throw error
    } catch (err: unknown) {
      const e = err as Error
      setError(e?.message || "Failed to sign in with Google")
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader className="text-primary animate-spin" size={48} />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <main className="h-full w-full flex-1 px-4 py-6 sm:px-6 sm:py-8 md:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Action buttons based on authentication status */}
          <div className="mb-8 flex items-center justify-center">
            {!user ? (
              <div className="w-full max-w-xs space-y-3">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 text-xs font-bold tracking-wide text-black uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
                >
                  <FancyButton>
                    <svg
                      className="mr-2 h-4 w-4 shrink-0 sm:h-5 sm:w-5"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    {loading ? "SIGNING IN..." : "SIGN IN WITH GOOGLE"}
                  </FancyButton>
                </button>
              </div>
            ) : (
              <div className="flex w-full max-w-xs flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
                <FancyButton>
                  <span className="font-bold">SIGNED IN AS:</span> {user.email}
                </FancyButton>
              </div>
            )}
          </div>
          {error && (
            <div className="mt-4 flex justify-center">
              <p className="font-medium text-red-600">{error}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
