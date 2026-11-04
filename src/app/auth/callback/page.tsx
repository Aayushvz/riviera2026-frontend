"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase, signOutCompletely } from "@/lib/supabase"

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the session after OAuth redirect
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          router.push("/?error=auth_failed")
          return
        }

        if (session?.user) {
          const email = session.user.email || ""

          // Check if email is from VIT
          if (
            email.endsWith("@vitstudent.ac.in") ||
            email.endsWith("@vit.ac.in")
          ) {
            // Valid VIT email, redirect to root page
            router.push("/")
          } else {
            // Not a VIT email, sign out and redirect to root with error
            await signOutCompletely()
            router.push("/?error=invalid_email")
          }
        } else {
          router.push("/")
        }
      } catch (error) {
        console.error("Callback error:", error)
        router.push("/?error=callback_failed")
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-t-4 border-b-4 border-black"></div>
        <p className="mt-4 text-lg font-bold tracking-wider uppercase">
          Authenticating...
        </p>
      </div>
    </div>
  )
}
