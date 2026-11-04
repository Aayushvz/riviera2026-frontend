"use client"
import Image from "next/image"
import Link from "next/link"
import React, { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { FastForward, Play, Pause, Loader2 } from "lucide-react"
import ActionButton from "./action-button"
import ActionMusicButton from "./radio-btn"
import { is } from "date-fns/locale"
import { sendGAEvent } from "@next/third-parties/google"

interface Song {
  title: string
  artist?: string
  url: string
}

interface MusicPlayerProps {
  songs: Song[]
  bgColors?: string[]
  targetDate?: string
  actionOneText?: string
  actionTwoText?: string
  onActionOneClick?: () => void
  onActionTwoClick?: () => void
}

function FlipDigit({ value }: { value: number }) {
  const digitRef = useRef<HTMLDivElement>(null)
  const prevValue = useRef(value)

  useEffect(() => {
    if (prevValue.current !== value && digitRef.current) {
      const timeline = gsap.timeline()
      timeline.fromTo(
        digitRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" },
      )
      prevValue.current = value
    }
  }, [value])

  return (
    <span ref={digitRef} className="inline-block tabular-nums">
      {value}
    </span>
  )
}

function FlipNumber({ value }: { value: number }) {
  const tens = Math.floor(value / 10)
  const ones = value % 10
  return (
    <>
      <FlipDigit value={tens} />
      <FlipDigit value={ones} />
    </>
  )
}

export default function MusicPlayerRadio({
  songs,
  targetDate,
  actionOneText = "EVENTS",
  actionTwoText = "PROSHOW",
  onActionOneClick,
  onActionTwoClick,
  bgColors = [
    "bg-[#d27441]",
    "bg-[#d24c41]",
    "bg-[#ffd401]",
    "bg-[#fe44ff]",
    "bg-[#aaf038]",
    "bg-[#a6bfff]",
    "bg-[#73d242]",
    "bg-[#4ffff0]",
  ],
}: MusicPlayerProps) {
  const [bgColor, setBgColor] = useState(bgColors[0])
  const [time, setTime] = useState([0, 0, 0, 0])
  const [mounted, setMounted] = useState(false)
  const [currentSongIndex, setCurrentSongIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showPlayer, setShowPlayer] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const seekTimeRef = useRef<number>(0)
  const isSeekingRef = useRef<boolean>(false)
  const transitionTimelineRef = useRef<gsap.core.Timeline | null>(null)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const nextAudioRef = useRef<HTMLAudioElement | null>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const songInfoRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const finalTargetDate = targetDate || "2025-02-26T00:00:00"

  // Mount logic
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    setCurrentSongIndex(0)
  }, [mounted])

  // Audio initialization with preloading
  useEffect(() => {
    if (!mounted || songs.length === 0) return

    if (!audioRef.current) {
      audioRef.current = new Audio(songs[0].url)
      audioRef.current.preload = "auto"
    }

    const audio = audioRef.current

    const updateTime = () => {
      if (!isSeekingRef.current) {
        setCurrentTime(audio.currentTime)
      }
    }

    const updateDuration = () => {
      setDuration(audio.duration)
      setIsLoading(false)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleNext)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleNext)
    }
  }, [mounted])

  // Preload next song in background
  useEffect(() => {
    if (!mounted || songs.length <= 1) return

    const nextIndex = (currentSongIndex + 1) % songs.length
    nextAudioRef.current = new Audio(songs[nextIndex].url)
    nextAudioRef.current.preload = "auto"
    nextAudioRef.current.load()

    return () => {
      if (nextAudioRef.current) {
        nextAudioRef.current.pause()
        nextAudioRef.current = null
      }
    }
  }, [mounted, currentSongIndex, songs])

  // Countdown timer logic
  useEffect(() => {
    if (!mounted) return
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const target = new Date(finalTargetDate).getTime()
      const difference = target - now
      if (difference > 0) {
        setTime([
          Math.floor(difference / (1000 * 60 * 60 * 24)),
          Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          Math.floor((difference % (1000 * 60)) / 1000),
        ])
      } else {
        setTime([0, 0, 0, 0])
      }
    }
    const interval = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(interval)
  }, [mounted, finalTargetDate])

  // Play/Pause toggle with optimized animations
  const togglePlayPause = () => {
    if (!audioRef.current || isTransitioning) return

    // Kill existing timeline if any
    if (transitionTimelineRef.current) {
      transitionTimelineRef.current.kill()
    }

    setIsTransitioning(true)

    if (isPlaying) {
      // === PAUSE SEQUENCE ===
      audioRef.current.pause()
      setIsPlaying(false)
      sendGAEvent("event", "button_click", {
        location: "hero_section",
        button_name: "pause_radio",
      })

      if (playerRef.current && logoRef.current) {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false)
          },
        })
        transitionTimelineRef.current = tl

        // Animate child elements out first with stagger
        if (progressBarRef.current) {
          tl.to(progressBarRef.current, {
            opacity: 0,
            y: 15,
            scale: 0.95,
            duration: 0.25,
            ease: "power3.in",
          })
        }

        if (songInfoRef.current) {
          tl.to(
            songInfoRef.current,
            {
              opacity: 0,
              y: 20,
              scale: 0.95,
              duration: 0.25,
              ease: "power3.in",
            },
            "-=0.15",
          )
        }

        // Epic exit for player - rotate and scale down
        tl.to(
          playerRef.current,
          {
            opacity: 0,
            y: 30,
            scale: 0.85,
            rotationX: 15,
            duration: 0.4,
            ease: "power3.in",
          },
          "-=0.1",
        )

        // Logo dramatic entrance - flip and bounce in
        tl.set(logoRef.current, {
          opacity: 0,
          scale: 0.7,
          y: -20,
          rotationY: -90,
        })
        tl.call(() => setShowPlayer(false))
        tl.to(logoRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          rotationY: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.6)",
        })
      } else {
        setIsTransitioning(false)
      }
    } else {
      // === PLAY SEQUENCE ===
      setShowPlayer(true) // Set this FIRST so player exists in DOM
      setIsPlaying(true)
      setIsLoading(true)
      sendGAEvent("event", "button_click", {
        location: "hero_section",
        button_name: "play_radio",
      })

      // Start audio playback
      const playPromise = audioRef.current.play()
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsLoading(false)
          })
          .catch((error) => {
            console.error("Playback failed:", error)
            setIsPlaying(false)
            setShowPlayer(false)
            setIsLoading(false)
            setIsTransitioning(false)

            // Reset to logo state on error
            if (logoRef.current && playerRef.current) {
              gsap.set(logoRef.current, { opacity: 1, scale: 1, y: 0 })
              gsap.set(playerRef.current, { opacity: 0 })
            }
          })
      }

      if (logoRef.current && playerRef.current) {
        // Initialize player to invisible state
        gsap.set(playerRef.current, {
          opacity: 0,
          y: 30,
          scale: 0.85,
          rotationX: -15,
        })

        const tl = gsap.timeline({
          onComplete: () => {
            setIsTransitioning(false)
          },
        })
        transitionTimelineRef.current = tl

        // Epic logo exit - flip and scale down
        tl.to(logoRef.current, {
          opacity: 0,
          scale: 0.7,
          y: -20,
          rotationY: 90,
          duration: 0.45,
          ease: "power3.in",
        })

        // Player dramatic entrance - flip and bounce in
        tl.to(
          playerRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: 0.65,
            ease: "elastic.out(1, 0.65)",
          },
          "+=0.05",
        )

        // Animate child elements using call() to ensure DOM is ready
        tl.call(
          () => {
            if (songInfoRef.current) {
              gsap.fromTo(
                songInfoRef.current,
                { opacity: 0, y: 25, scale: 0.9 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.5,
                  ease: "back.out(2)",
                },
              )
            }

            if (progressBarRef.current) {
              gsap.fromTo(
                progressBarRef.current,
                { opacity: 0, y: 20, scale: 0.9 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.5,
                  delay: 0.1,
                  ease: "back.out(2)",
                },
              )
            }
          },
          [],
          "-=0.5",
        )
      } else {
        setIsTransitioning(false)
      }
    }
  }

  const handlePause = () => {
    if (isPlaying) togglePlayPause()
  }

  const handleNext = () => {
    if (!audioRef.current || isTransitioning) return

    const audio = audioRef.current
    const wasPlaying = isPlaying

    const nextIndex = (currentSongIndex + 1) % songs.length
    setCurrentSongIndex(nextIndex)
    setBgColor(bgColors[nextIndex % bgColors.length])
    setCurrentTime(0)
    setIsLoading(true)

    // 🔥 change source, DO NOT recreate audio
    audio.src = songs[nextIndex].url
    audio.load()

    if (wasPlaying) {
      audio.play().finally(() => setIsLoading(false))
    }

    // UI stays locked in PLAY state
    setIsPlaying(wasPlaying)

    // Optional smooth title transition
    if (songInfoRef.current) {
      gsap.fromTo(
        songInfoRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
      )
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    seekTimeRef.current = newTime
    sendGAEvent("event", "radio_seeked", {
      location: "hero_section",
    })
    // Always update currentTime during seeking - the isSeeking flag just prevents audio timeupdate from overwriting
    setCurrentTime(newTime)
  }

  const handleSeekStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    setIsSeeking(true)
    isSeekingRef.current = true
    // Capture the initial seek position
    if (audioRef.current) {
      seekTimeRef.current = audioRef.current.currentTime
    }
  }

  const handleSeekEnd = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()

    // Update the audio position BEFORE setting isSeeking to false
    if (
      audioRef.current &&
      !isNaN(seekTimeRef.current) &&
      seekTimeRef.current >= 0
    ) {
      audioRef.current.currentTime = seekTimeRef.current
      setCurrentTime(seekTimeRef.current)
    }

    // Set isSeeking to false after updating the audio position
    setIsSeeking(false)
    isSeekingRef.current = false
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00"
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!mounted)
    return (
      <div className="border-hero-fg bg-radio-edge relative mx-auto flex aspect-video w-[95vw] max-w-[400px] flex-col rounded-[24px] border-2 p-2 shadow-2xl sm:max-w-[450px] sm:rounded-[32px] sm:border-3 sm:p-3 md:max-w-[500px]" />
    )

  const currentSong = songs[currentSongIndex]

  return (
    <div
      className="border-hero-fg bg-radio-edge relative mx-auto flex aspect-video w-[95vw] max-w-[400px] translate-y-20 flex-col rounded-[24px] border-2 p-2 sm:max-w-[450px] sm:rounded-[32px] sm:border-3 sm:p-3 md:max-w-[500px]"
      style={{
        boxShadow:
          "0 8px 16px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2)",
      }}
    >
      <div className="absolute top-0 right-6 flex -translate-y-full gap-0 sm:right-10">
        {/* Play button */}
        <button
          onClick={togglePlayPause}
          disabled={isPlaying}
          className={`border-hero-accent bg-radio-btn-one relative flex w-12 cursor-pointer items-center justify-center rounded-tl-lg border-2 transition-all duration-150 sm:border-3 md:w-20 ${isPlaying || isLoading ? "cursor-not-allowed brightness-75" : "hover:brightness-110"}`}
          style={
            isPlaying
              ? {
                  height: "26px",
                  marginTop: "6px",
                  boxShadow:
                    "inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 2px 3px rgba(0,0,0,0.3), 0 -2px 0 var(--color-radio-btn-one-hover)",
                  transform: "perspective(100px)",
                }
              : {
                  height: "32px",
                  boxShadow:
                    "0 -6px 0 var(--color-radio-btn-one-hover), 0 -7px 10px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
                }
          }
          title="Play"
        >
          <div className={`flex items-center justify-center`}>
            {isLoading && !isPlaying ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Play
                size={14}
                className={`transition-transform ${isPlaying ? "scale-90" : ""}`}
                fill="#121212"
              />
            )}
          </div>
        </button>

        {/* Pause button */}
        <button
          onClick={handlePause}
          disabled={!isPlaying}
          className={`border-hero-accent bg-radio-btn-two relative flex w-12 cursor-pointer items-center justify-center overflow-hidden border-y-2 transition-all duration-150 sm:border-3 md:w-20 ${!isPlaying ? "cursor-not-allowed brightness-75" : "hover:brightness-90"}`}
          style={
            !isPlaying
              ? {
                  height: "26px",
                  marginTop: "6px",
                  boxShadow:
                    "inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 2px 3px rgba(0,0,0,0.3), 0 -2px 0 var(--color-radio-btn-two-hover)",
                  transform: "perspective(100px)",
                }
              : {
                  height: "32px",
                  boxShadow:
                    "0 -6px 0 var(--color-radio-btn-two-hover), 0 -7px 10px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
                }
          }
          title="Pause"
        >
          <div className={`flex items-center gap-0.5`}>
            <Pause
              size={14}
              className={`transition-transform ${isPlaying ? "scale-90" : ""}`}
              fill="#121212"
            />
          </div>
        </button>

        {/* Next song button */}
        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`border-hero-accent bg-radio-btn-three relative flex w-12 cursor-pointer items-center justify-center rounded-tr-lg border-2 transition-all duration-150 sm:border-3 md:w-20 ${isLoading ? "cursor-not-allowed brightness-75" : "hover:brightness-110"}`}
          style={{
            height: "32px",
            boxShadow:
              "0 -6px 0 var(--color-radio-btn-three-hover), 0 -7px 10px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)",
          }}
          onMouseDown={(e) => {
            if (!isLoading) {
              e.currentTarget.style.height = "26px"
              e.currentTarget.style.marginTop = "6px"
              e.currentTarget.style.boxShadow =
                "inset 0 -4px 8px rgba(0,0,0,0.5), inset 0 2px 3px rgba(0,0,0,0.3), 0 -2px 0 var(--color-radio-btn-three-hover)"
              e.currentTarget.style.transform = "perspective(100px)"
            }
          }}
          onMouseUp={(e) => {
            const icon = e.currentTarget.querySelector(
              ".next-icon-wrapper",
            ) as HTMLElement
            e.currentTarget.style.height = "32px"
            e.currentTarget.style.marginTop = "0"
            e.currentTarget.style.boxShadow =
              "0 -6px 0 var(--color-radio-btn-three), 0 -7px 10px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
            e.currentTarget.style.transform = ""
            if (icon) icon.style.marginTop = "0"
          }}
          onMouseLeave={(e) => {
            const icon = e.currentTarget.querySelector(
              ".next-icon-wrapper",
            ) as HTMLElement
            e.currentTarget.style.height = "32px"
            e.currentTarget.style.marginTop = "0"
            e.currentTarget.style.boxShadow =
              "0 -6px 0 var(--color-radio-btn-three), 0 -7px 10px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
            e.currentTarget.style.transform = ""
            if (icon) icon.style.marginTop = "0"
          }}
          title="Next Song"
        >
          <div className="next-icon-wrapper flex items-center justify-center transition-all duration-150">
            <FastForward size={14} className="sm:scale-125" fill="#121012" />
          </div>
        </button>
      </div>

      {/* Header with marquee title */}
      <div className="flex items-center justify-between gap-1 pt-1 pb-2 sm:gap-2 sm:pb-3">
        <div
          className="relative flex h-8 w-full shrink-0 items-center justify-end overflow-hidden rounded-md bg-stone-800 px-1.5 sm:h-10 sm:rounded-lg sm:px-2"
          style={{
            boxShadow:
              "inset 0 2px 4px rgba(0,0,0,0.8), inset 0 -1px 2px rgba(255,255,255,0.1), inset 2px 0 4px rgba(0,0,0,0.6), inset -2px 0 4px rgba(0,0,0,0.6)",
            border: "1px solid rgba(0,0,0,0.5)",
          }}
        >
          <div className="text-hero-fg font-neopixel t w-fit min-w-0 shrink overflow-hidden text-[13px] leading-tight font-semibold sm:text-[18px] md:text-[22px]">
            <span className="inline-block px-0.5 text-[#06E606]">
              <FlipNumber value={time[0]} />
            </span>{" "}
            <span className="inline">days </span>
            <span className="inline-block px-0.5 text-[#06E606]">
              <FlipNumber value={time[1]} />
            </span>{" "}
            <span className="inline">hrs </span>
            <span className="inline-block px-0.5 text-[#06E606]">
              <FlipNumber value={time[2]} />
            </span>{" "}
            <span className="inline">mins </span>
            <span className="inline-block px-0.5 text-[#06E606]">
              <FlipNumber value={time[3]} />
            </span>{" "}
            <span className="inline">secs</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee-container {
          position: relative;
        }

        .marquee-content {
          width: 100%;
          display: inline-block;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        @keyframes blink {
          0%,
          50%,
          100% {
            opacity: 1;
          }
          25%,
          75% {
            opacity: 0;
          }
        }

        .animate-marquee {
          animation: marquee 10s linear infinite;
        }

        .animate-blink {
          animation: blink 3s step-start infinite;
        }

        /* Progress slider styling */
        .progress-slider::-webkit-slider-thumb {
          appearance: none;
          width: 14px;
          height: 14px;
          margin-top: -4px;
          border-radius: 50%;
          background: #0a0a0a;
          cursor: pointer;
          border: 2px solid #2a2a2a;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .progress-slider::-webkit-slider-thumb:hover {
          transform: scale(1.25);
          background: #151515;
          border-color: #3a3a3a;
          box-shadow:
            0 0 0 2px rgba(0, 0, 0, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        .progress-slider::-webkit-slider-thumb:active {
          transform: scale(1.15);
          background: #050505;
          border-color: #1a1a1a;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.5),
            0 1px 2px rgba(0, 0, 0, 0.6),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .progress-slider::-moz-range-thumb {
          width: 14px;
          height: 14px;
          margin-top: -4px;
          border: 2px solid #2a2a2a;
          border-radius: 50%;
          background: #0a0a0a;
          cursor: pointer;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.3),
            0 2px 4px rgba(0, 0, 0, 0.4),
            inset 0 1px 1px rgba(255, 255, 255, 0.1);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }

        @media (max-width: 768px) {
          .progress-slider::-moz-range-thumb {
            width: 10px;
            height: 10px;
            margin-top: -3px;
          }

          .progress-slider::-webkit-slider-thumb {
            width: 10px;
            height: 10px;
            margin-top: -3px;
          }
        }

        .progress-slider::-moz-range-thumb:hover {
          transform: scale(1.25);
          background: #151515;
          border-color: #3a3a3a;
          box-shadow:
            0 0 0 2px rgba(0, 0, 0, 0.4),
            0 4px 8px rgba(0, 0, 0, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        .progress-slider::-moz-range-thumb:active {
          transform: scale(1.15);
          background: #050505;
          border-color: #1a1a1a;
          box-shadow:
            0 0 0 1px rgba(0, 0, 0, 0.5),
            0 1px 2px rgba(0, 0, 0, 0.6),
            inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .progress-slider:disabled::-webkit-slider-thumb {
          cursor: not-allowed;
          opacity: 0.5;
          transform: scale(1);
        }

        .progress-slider:disabled::-moz-range-thumb {
          cursor: not-allowed;
          opacity: 0.5;
          transform: scale(1);
        }

        .progress-slider:focus {
          outline: none;
        }

        .progress-slider:focus::-webkit-slider-thumb {
          box-shadow:
            0 0 0 3px rgba(26, 26, 26, 0.5),
            0 4px 8px rgba(0, 0, 0, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        .progress-slider:focus::-moz-range-thumb {
          box-shadow:
            0 0 0 3px rgba(26, 26, 26, 0.5),
            0 4px 8px rgba(0, 0, 0, 0.5),
            inset 0 1px 2px rgba(255, 255, 255, 0.15);
        }

        .progress-slider::-webkit-slider-runnable-track {
          height: 100%;
          border-radius: 9999px;
        }

        .progress-slider::-moz-range-track {
          height: 100%;
          border-radius: 9999px;
          background: transparent;
        }

        /* Prevent drag selection */
        .progress-slider {
          -webkit-user-drag: none;
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>

      <div
        className={`relative flex h-full flex-col justify-center overflow-hidden rounded-2xl ${isPlaying ? bgColor : bgColors[0]} sm:rounded-3xl} p-3 sm:p-4 md:p-5`}
      >
        {/* Corner edges */}
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-6 -left-6 h-14 w-14 rotate-45 bg-[#1F1F1F] sm:-top-8 sm:-left-8 sm:h-20 sm:w-20"
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          />
          <div
            className="absolute -top-6 -right-6 h-14 w-14 -rotate-45 bg-[#1F1F1F] sm:-top-8 sm:-right-8 sm:h-20 sm:w-20"
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          />
          <div
            className="absolute -bottom-6 -left-6 h-14 w-14 rotate-45 bg-[#1F1F1F] sm:-bottom-8 sm:-left-8 sm:h-20 sm:w-20"
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          />
          <div
            className="absolute -right-6 -bottom-6 h-14 w-14 -rotate-45 bg-[#1F1F1F] sm:-right-8 sm:-bottom-8 sm:h-20 sm:w-20"
            style={{
              clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
            }}
          />
        </div>

        {/* Content wrapper with safe padding */}
        <div className="relative z-10 flex h-full flex-col items-center justify-between py-2 sm:py-3">
          {/* Rivera Logo - Shows when paused */}
          <div
            ref={logoRef}
            className="flex w-full flex-1 items-center justify-center px-4 sm:px-6"
            style={{
              opacity: showPlayer ? 0 : 1,
              position: showPlayer ? "absolute" : "relative",
              pointerEvents: showPlayer ? "none" : "auto",
              zIndex: showPlayer ? -1 : 0,
            }}
          >
            <div className="w-full max-w-[280px] sm:max-w-[320px]">
              <Image
                src="/assets/hero/action/radio-logo.svg"
                alt="Logo"
                width={400}
                height={100}
                className="h-auto w-full"
              />
            </div>
          </div>

          {/* Now Playing Display - Shows when playing */}
          {showPlayer && (
            <div
              ref={playerRef}
              className="flex w-full flex-1 flex-col items-center justify-center gap-1.5 px-4 transition-opacity duration-75 sm:gap-2 sm:px-6"
            >
              <div ref={songInfoRef} className="w-full max-w-[90%] text-center">
                <h3 className="font-bebus-rounded text-hero-bg line-clamp-1 text-xs font-medium sm:text-sm md:text-base">
                  {currentSong?.title || "No Song"}
                </h3>
                {currentSong?.artist && (
                  <p className="line-clamp-1 text-[10px] text-[#1F1F1F]/70 sm:text-xs">
                    {currentSong.artist}
                  </p>
                )}
              </div>

              {/* Progress bar slider */}
              <div
                ref={progressBarRef}
                className="flex w-full max-w-[90%] flex-col gap-1.5"
              >
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  onMouseDown={handleSeekStart}
                  onMouseUp={handleSeekEnd}
                  onTouchStart={handleSeekStart}
                  onTouchEnd={handleSeekEnd}
                  onDragStart={(e) => e.preventDefault()}
                  disabled={!duration || isLoading}
                  className="progress-slider h-1 w-full appearance-none rounded-full sm:h-1.5"
                  style={{
                    background: `linear-gradient(to right, #1a1a1a 0%, #1a1a1a ${(currentTime / duration) * 100 || 0}%, rgba(31, 31, 31, 0.3) ${(currentTime / duration) * 100 || 0}%, rgba(31, 31, 31, 0.3) 100%)`,
                    opacity: !duration || isLoading ? 0.5 : 1,
                    cursor: !duration || isLoading ? "not-allowed" : "",
                    userSelect: "none",
                    WebkitUserSelect: "none",
                  }}
                />
                <div className="font-digital flex justify-between text-[10px] text-[#1F1F1F]/70 sm:text-[14px]">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Song queue indicator */}
              <div className="font-digital text-[10px] text-[#1F1F1F]/60 sm:text-[12px]">
                <p>
                  TRACK {currentSongIndex + 1} / {songs.length}
                </p>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex w-full flex-row items-center justify-center gap-3">
            <Link href="/events" target="_blank">
              <ActionButton
                playAction={true}
                riveFile="/assets/hero/action/events-anim.riv"
                onClick={() => {
                  sendGAEvent("event", "button_click", {
                    location: "hero_section",
                    button_name: "events_button",
                  })
                }}
              />
            </Link>
            <Link href="/?s=proshows">
              <ActionButton
                playAction={true}
                riveFile="/assets/hero/action/proshow-anim.riv"
                onClick={() => {
                  sendGAEvent("event", "button_click", {
                    location: "hero_section",
                    button_name: "proshow_button",
                  })
                }}
              />
            </Link>
            {/* <Link href="https://web.vit.ac.in/rivierainternal" target="_blank">
              <ActionMusicButton
                type={`${isPlaying ? "secondary" : "primary"}`}
                text="EVENTS"
                animate={true}
              />
            </Link>
            <Link href="https://web.vit.ac.in/rivierainternal" target="_blank">
              <ActionMusicButton
                type={`${!isPlaying ? "secondary" : "primary"}`}
                text="PROSHOW"
                animate={true}
              />
            </Link> */}
          </div>
        </div>

        {/* Top and bottom inner tabs */}
        <div
          className="absolute top-0 left-1/2 h-3 w-24 -translate-x-1/2 bg-[#1F1F1F] sm:h-5 sm:w-40"
          style={{ clipPath: "polygon(0% 0%, 100% 0%, 85% 100%, 15% 100%)" }}
        />
        <div
          className="absolute bottom-0 left-1/2 h-3 w-24 -translate-x-1/2 bg-[#1F1F1F] sm:h-5 sm:w-40"
          style={{ clipPath: "polygon(0% 100%, 15% 0%, 85% 0%, 100% 100%)" }}
        />
      </div>
    </div>
  )
}
