"use client"

import React, { useEffect, useRef, useState } from "react"
import { PillBadge } from "../about"
import SlideCard from "./slide-card"
import artistsData from "./artists"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ActionButton from "@/components/radio/action-button"
import Link from "next/link"
import MarqueeCustom from "@/components/marquee"
import SectionTransition from "@/components/transitions/section-transition"

import { sendGAEvent } from "@next/third-parties/google"

gsap.registerPlugin(ScrollTrigger)

const ProshowsSection = () => {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const column1Ref = useRef<HTMLDivElement>(null)
  const column2Ref = useRef<HTMLDivElement>(null)
  const horizontalScrollRef = useRef<HTMLDivElement>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  // Detect desktop
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Image load handler
  useEffect(() => {
    const images = document.querySelectorAll("#proshows img")
    let loadedCount = 0
    const totalImages = images.length

    if (totalImages === 0) {
      setImagesLoaded(true)
      return
    }

    const imageLoadHandler = () => {
      loadedCount++
      if (loadedCount === totalImages) {
        setImagesLoaded(true)
      }
    }

    images.forEach((img) => {
      if ((img as HTMLImageElement).complete) {
        imageLoadHandler()
      } else {
        img.addEventListener("load", imageLoadHandler)
        img.addEventListener("error", imageLoadHandler)
      }
    })

    return () => {
      images.forEach((img) => {
        img.removeEventListener("load", imageLoadHandler)
        img.removeEventListener("error", imageLoadHandler)
      })
    }
  }, [])

  useEffect(() => {
    if (imagesLoaded) {
      ScrollTrigger.refresh()
    }
  }, [imagesLoaded])

  useEffect(() => {
    if (!isDesktop || !imagesLoaded) return

    // Add a small delay to ensure layout is stable
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Force a reflow before calculations
        if (column1Ref.current) column1Ref.current.offsetHeight
        if (column2Ref.current) column2Ref.current.offsetHeight

        const column1Height = column1Ref.current?.scrollHeight || 0
        const column2Height = column2Ref.current?.scrollHeight || 0

        const column1ScrollDistance = (column1Height - window.innerHeight) * 0.6
        const column2ScrollDistance = column2Height - window.innerHeight
        const maxScrollDistance = Math.max(
          column1ScrollDistance,
          column2ScrollDistance,
        )

        // Pin the left section with invalidateOnRefresh for better cross-browser support
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 140px",
          end: `+=${maxScrollDistance}`,
          pin: leftRef.current,
          pinSpacing: false,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          markers: false, // Set to true for debugging
        })

        // Animate column 1
        gsap.to(column1Ref.current, {
          y: -column1ScrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 10%",
            end: () => `+=${maxScrollDistance}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        // Animate column 2
        gsap.to(column2Ref.current, {
          y: -column2ScrollDistance,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 10%",
            end: () => `+=${maxScrollDistance}`,
            scrub: true,
            invalidateOnRefresh: true,
          },
        })

        // Refresh ScrollTrigger after setup
        ScrollTrigger.refresh()
      })

      return () => {
        ctx.revert()
      }
    }, 100)

    return () => {
      clearTimeout(timer)
    }
  }, [isDesktop, imagesLoaded])

  return (
    <div id="proshow" className="relative">
      <div className="absolute inset-0 hidden sm:block">
        <SectionTransition />
      </div>

      <div
        id="proshows"
        ref={containerRef}
        className="bg-foreground flex w-full flex-col gap-2 lg:max-h-[200vh] lg:flex-row"
      >
        {/* LEFT SECTION */}
        <div
          ref={leftRef}
          className="flex h-screen w-full flex-1 flex-col gap-6 px-8 py-10 lg:max-w-1/2"
        >
          <PillBadge
            text="Proshow"
            className="text-background border-background!"
          />

          <h1 className="font-bebas-rounded text-background text-7xl font-medium uppercase lg:max-w-2xl xl:max-w-lg xl:text-9xl">
            The Stage Is Yours.
          </h1>

          <p className="font-nunito text-background max-w-2xl text-xl">
            We&apos;re bringing together powerful voices and vibrant performers
            for a lineup that promises music, memories, and magic. This is where
            campus meets culture.
          </p>

          <Link href={"https://web.vit.ac.in/rivierainternal"} target="_blank">
            <ActionButton
              playAction={true}
              riveFile="/proshows/buy-tickets.riv"
              onClick={() => {
                sendGAEvent("event", "button_click", {
                  location: "proshows_section",
                  button_name: "buy_tickets",
                })
                console.log("Easter Egg lol!")
              }}
              className="scale-130 sm:scale-100"
            />
          </Link>
        </div>

        {/* MOBILE VIEW */}
        {!isDesktop ? (
          <div
            ref={horizontalScrollRef}
            className="grid w-full grid-cols-1 items-center justify-center gap-10 p-6 pb-10 sm:grid-cols-2 sm:gap-6"
          >
            {artistsData.map((artist, index) => (
              <SlideCard
                key={index}
                day={artist.day}
                image={artist.image}
                artistName={artist.artistName}
                date={artist.date}
                description={artist.description}
                color={artist.color}
                hidden={artist.hidden}
              />
            ))}
          </div>
        ) : (
          /* DESKTOP COLUMNS */
          <div
            ref={rightRef}
            className="bg-foreground w-full flex-1 flex-col gap-2 lg:flex lg:flex-row"
          >
            <div ref={column1Ref} className="w-full flex-1 pt-30">
              <div className="flex w-full flex-col items-center gap-4 bg-[#141414] px-4 py-4">
                {artistsData
                  .filter((_, index) => index % 2 === 0)
                  .map((artist, index) => (
                    <SlideCard
                      key={index}
                      day={artist.day}
                      image={artist.image}
                      artistName={artist.artistName}
                      date={artist.date}
                      description={artist.description}
                      color={artist.color}
                      hidden={artist.hidden}
                    />
                  ))}
              </div>
            </div>

            <div ref={column2Ref} className="w-full flex-1 pt-30">
              <div className="flex w-full flex-col items-center gap-4 bg-[#141414] px-4 pt-4 pb-4 lg:pt-50">
                {artistsData
                  .filter((_, index) => index % 2 !== 0)
                  .map((artist, index) => (
                    <SlideCard
                      key={index}
                      day={artist.day}
                      image={artist.image}
                      artistName={artist.artistName}
                      date={artist.date}
                      description={artist.description}
                      color={artist.color}
                      hidden={artist.hidden}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <MarqueeCustom words={["RIVIERA", "2026"]} direction="right" />
    </div>
  )
}

export default ProshowsSection
