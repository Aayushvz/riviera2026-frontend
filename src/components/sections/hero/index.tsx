"use client"
import React, { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import BackgroundHero from "./background-hero"
import Canvas3DGrid from "./canvas-3d-grid"
import Canvas2DFlippingGrid from "./canvas-2d-grid"
import MusicPlayerRadio from "@/components/radio"

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const radioRef = useRef<HTMLDivElement>(null)
  const heroMainRef = useRef<HTMLElement>(null)
  const bgHeroRef = useRef<HTMLDivElement>(null)
  const canvas2DRef = useRef<HTMLDivElement>(null)
  const canvas3DRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    updateIsMobile()

    window.addEventListener("resize", updateIsMobile)
    return () => window.removeEventListener("resize", updateIsMobile)
  }, [])

  useEffect(() => {
    if (!radioRef.current || !heroMainRef.current) return

    const ctx = gsap.context(() => {
      // Main pin for the entire section
      ScrollTrigger.create({
        trigger: heroMainRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: radioRef.current,
        pinSpacing: false,
        onRefresh: () => {
          // Add pointer-events-none to the pin-spacer after it's created
          const pinSpacer = radioRef.current?.parentElement
          if (pinSpacer && pinSpacer.classList.contains("pin-spacer")) {
            pinSpacer.style.pointerEvents = "none"
          }
        },
      })

      // Add pointer-events-none immediately after creation
      setTimeout(() => {
        const pinSpacer = radioRef.current?.parentElement
        if (pinSpacer && pinSpacer.classList.contains("pin-spacer")) {
          pinSpacer.style.pointerEvents = "none"
        }
      }, 0)

      // Animate z-index for Canvas2D (10 to -20)
      if (canvas2DRef.current) {
        gsap.to(canvas2DRef.current, {
          zIndex: -20,
          visibility: "hidden",
          scrollTrigger: {
            trigger: heroMainRef.current,
            start: "top top",
            end: "top top-=100",
            scrub: true,
          },
        })
      }

      // Animate z-index for Canvas3D (10 to 20)
      if (canvas3DRef.current) {
        gsap.to(canvas3DRef.current, {
          zIndex: 20,
          scrollTrigger: {
            trigger: heroMainRef.current,
            start: "top top",
            end: "top top-=100",
            scrub: true,
          },
        })
      }

      // Background Hero opacity animation
      if (bgHeroRef.current) {
        gsap.fromTo(
          bgHeroRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            scrollTrigger: {
              trigger: bgHeroRef.current,
              start: "top center",
              end: "bottom center",
              scrub: true,
            },
          },
        )
      }
    })

    return () => ctx.revert()
  }, [isClient])

  const boxSize = isMobile ? 120 : 200

  return (
    <main ref={heroMainRef} className="bg-hero-fg relative overflow-hidden">
      <section className="relative h-[200vh]">
        <div ref={canvas2DRef} className="relative z-10">
          <Canvas2DFlippingGrid
            gridCount={14}
            boxSize={boxSize}
            scrollHeight="200vh"
            imageFolder="/assets/hero/stars"
            imageCount={12}
          />
        </div>
        <div ref={canvas3DRef} className="absolute inset-0 z-0">
          <Canvas3DGrid
            gridCount={14}
            boxSize={boxSize}
            scrollHeight="200vh"
            faceColor="#212121"
            sideColor="#B780FF"
            BackgroundComponent={BackgroundHero}
          />
        </div>
      </section>
      <div
        ref={radioRef}
        className="pointer-events-none absolute top-0 left-0 z-30 flex h-screen w-screen items-center justify-center [&_*]:pointer-events-auto"
      >
        <MusicPlayerRadio
          songs={[
            { title: "Riviera Theme Song", url: "/assets/music/riviera.mp3" },
            {
              title: "Sheela Ki Jawani",
              artist: "Sunidhi Chauhan, Vishal-Shekhar, Vishal Dadlani",
              url: "/assets/music/sheela-ki-jawani.mpeg",
            },
            {
              title: "Hungry Cheetah",
              artist: "Thaman S",
              url: "/assets/music/hungry-cheetah.mpeg",
            },
            {
              title: "Bang Bang",
              artist: "Benny Dayal, Neeti Mohan, Vishal-Shekhar",
              url: "/assets/music/bang-bang.mpeg",
            },
            {
              title: "Just a Boy",
              url: "/assets/music/just-a-boy.mp3",
            },
            {
              title: "Dead Eyes",
              artist: "Powfu, Ouse",
              url: "/assets/music/dead-eyes.mp3",
            },
            {
              title: "In The End",
              artist: "Promoting Sounds & Ocean",
              url: "/assets/music/in-the-end.mp3",
            },
            {
              title: "In My Head",
              artist: "idkjack, luvjools",
              url: "/assets/music/in-my-head.mp3",
            },
            { title: "Rasputin", url: "/assets/music/rasputin.mp3" },
            {
              title: "Take It All",
              artist: "Kado & Promoting Sounds",
              url: "/assets/music/take-it-all.mp3",
            },
            {
              title: "On and On",
              artist: "Cartoon, Jéja",
              url: "/assets/music/on-and-on.mp3",
            },
            {
              title: "Mortals",
              artist: "Warriyo, Laura Brehm",
              url: "/assets/music/mortals.mp3",
            },
          ]}
          targetDate="2026-02-26T00:00:00"
        />
      </div>
    </main>
  )
}
