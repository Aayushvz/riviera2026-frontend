"use client"

import React, { useEffect, useState, useRef } from "react"
import MenuOverlay from "./navbar-opened"
import Modal from "../spinner/Modal"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { usePathname } from "next/navigation"
import ActionButton from "@/components/radio/action-button"
import { sendGAEvent } from "@next/third-parties/google"

import { supabase, signOutCompletely } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"
import VerticalFlipMarquee from "@/components/ui/flip-marquee"
import scrollToSection from "@/lib/scroll-to-section"
import MarqueeCustom from "@/components/marquee"
import HorizontalMarquee from "@/components/ui/flip-marquee"

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const pathname = usePathname()
  const date = new Date()
  const containerRef = useRef<HTMLButtonElement | null>(null)
  const hoverTweenRef = useRef<gsap.core.Tween | null>(null)
  const [user, setUser] = useState<User | null>(null)

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
          await signOutCompletely()
          setUser(null)
        }
      }
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
        } else {
          signOutCompletely()
          setUser(null)
        }
      } else {
        setUser(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const { contextSafe } = useGSAP({
    scope: containerRef,
  })

  const onHoverStart = contextSafe(() => {
    gsap.killTweensOf(".music-bar")

    hoverTweenRef.current = gsap.to(".music-bar", {
      scaleX: () => gsap.utils.random(0.2, 1.6),
      duration: 0.12,
      ease: "power1.inOut",
      overwrite: "auto",
      stagger: {
        each: 0.05,
        repeat: -1,
        yoyo: true,
        repeatRefresh: true,
      },
    })
  })

  const onHoverEnd = contextSafe(() => {
    if (hoverTweenRef.current) {
      hoverTweenRef.current.kill()
    }

    gsap.killTweensOf(".music-bar")

    gsap.to(".music-bar", {
      scaleX: 1,
      duration: 0.25,
      ease: "power3.out",
      overwrite: true,
    })
  })

  useEffect(() => {
    const html = document.documentElement
    const body = document.body

    if (isMenuOpen) {
      html.style.overflow = "hidden"
      body.style.overflow = "hidden"
    } else {
      html.style.overflow = ""
      body.style.overflow = ""
    }

    return () => {
      html.style.overflow = ""
      body.style.overflow = ""
    }
  }, [isMenuOpen])

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isMenuOpen])

  return (
    <div className="fixed top-0 right-0 left-0 z-40">
      <nav className="bg-foreground border-foreground font-bebas grid h-24 w-full grid-cols-3 items-center justify-between border-b px-6">
        <div className="flex justify-start">
          <Link href="https://vit.ac.in">
            <Image
              src="/logos/vit-logo.svg"
              alt="VIT Logo"
              className="w-20 sm:w-40"
              width={1000}
              height={1000}
              draggable={false}
            />
          </Link>
        </div>
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/logos/riviera-2026-logo-white.svg"
              alt="Riviera 2026"
              className="w-20 sm:w-40"
              width={1000}
              height={1000}
              draggable={false}
            />
          </Link>
        </div>
        <div className="flex items-center justify-end gap-2">
          <Link href={"/?s=proshows"} className="hidden sm:block">
            <ActionButton
              playAction={true}
              riveFile="/assets/hero/action/proshow-anim.riv"
              onClick={() => {
                sendGAEvent("event", "button_click", {
                  location: "navbar",
                  button_name: "proshow_button",
                })
              }}
            />
          </Link>
          <button
            ref={containerRef}
            onClick={toggleMenu}
            onMouseEnter={onHoverStart}
            onMouseLeave={onHoverEnd}
            className={`border-background bg-background flex h-12 w-12 cursor-pointer flex-col items-center justify-center gap-1.5 border p-3 transition-all duration-300`}
          >
            <span className="music-bar block h-0.5 w-full origin-center rounded-full bg-current" />
            <span className="music-bar block h-0.5 w-full origin-center rounded-full bg-current" />
            <span className="music-bar block h-0.5 w-full origin-center rounded-full bg-current" />
          </button>
        </div>
      </nav>
      {pathname === "/" && (
        <HorizontalMarquee
          items={[
            {
              text: "Explore what's happening today",
              href: `/events?eventDate=${date.getFullYear()}-${(
                date.getMonth() + 1
              )
                .toString()
                .padStart(2, "0")}-${date
                .getDate()
                .toString()
                .padStart(2, "0")}`,
            },
            {
              text: "Infusion 8.0 International Cultural Exhibit",
              href: "/announcements?announcement=o8dGA4",
            },
          ]}
        />
      )}
      <MenuOverlay isOpen={isMenuOpen} closeMenu={() => setIsMenuOpen(false)} />
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

export default Navbar
