"use client"
import React, { useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import DjKnob from "./ui/dj-knob"
import DjButton from "./ui/dj-button"
import DjSmallFader from "./ui/dj-smallfader"

export default function MixerSection() {
  const textRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!textRef.current) return
      gsap.to(textRef.current, {
        xPercent: -50,
        duration: 10,
        ease: "none",
        repeat: -1,
      })
    },
    { scope: textRef },
  )

  return (
    <div className="grid h-full w-full grid-rows-[auto_1fr] gap-10">
      {/* Mixer Console */}
      <div className="relative aspect-[487/269] w-full">
        <div className="absolute inset-0 origin-top-left">
          <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center gap-1 overflow-hidden rounded-sm border-1 border-[#FDF2F0] bg-[#114C80] px-3 pt-4 pb-2 shadow-xl">
            {/* Digital Screen */}
            <div className="relative flex aspect-[12/1] w-full items-center overflow-hidden bg-black px-[4%] shadow-[1px_1px_0px_0px_#FFFFFF]">
              <div
                ref={textRef}
                className="flex gap-[6%] text-[clamp(0.9rem,1rem,1.6rem)] tracking-[0.13em] whitespace-nowrap text-[#00FF00] lg:text-[2rem] xl:text-[1.6rem]"
                style={{ fontFamily: "NEOPIXEL, monospace" }}
              >
                <span>Now Playing - Riviera 2026</span>
                <span>Now Playing - Riviera 2026</span>
                <span>Now Playing - Riviera 2026</span>
              </div>
            </div>

            {/* Knobs Panel */}
            <div className="grid w-full grid-cols-4 place-items-center bg-[#D9D9D9] px-4 py-3">
              <DjKnob />
              <DjKnob />
              <DjKnob />
              <DjKnob />
            </div>

            {/* Controls Area */}
            <div className="grid w-full grid-cols-[3fr_4fr_3fr] items-stretch">
              {/* Left Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-x-[10%] gap-y-[12%] px-[4%] py-[14%]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex w-[24%] justify-center">
                    <DjButton
                      variant="cyan"
                      className="border-b-4 hover:opacity-85"
                    />
                  </div>
                ))}
              </div>

              {/* Center Faders */}
              <div className="flex scale-75 items-center justify-around border-x-7 border-[#D9D9D9] px-[3%] py-[14%] sm:scale-90 md:scale-100">
                <div className="absolute top-[2%] left-[8%] flex gap-[20%]">
                  <div className="h-[8%] min-h-1.5 w-[20%] min-w-7 bg-[#CCFF00]" />
                  <div className="h-[8%] min-h-1.5 w-[20%] min-w-7 bg-[#CCFF00]" />
                </div>
                <div className="-mt-[12%] w-[22%]">
                  <DjSmallFader />
                </div>
                <div className="mt-[10%] w-[22%]">
                  <DjSmallFader />
                </div>
                <div className="-mt-[16%] w-[22%]">
                  <DjSmallFader />
                </div>
              </div>

              {/* Right Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-x-[10%] gap-y-[12%] px-[4%] py-[14%]">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex w-[24%] justify-center">
                    <DjButton
                      variant="yellow"
                      className="border-b-4 hover:opacity-85"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="mx-auto hidden h-[clamp(4rem,12vw,8rem)] w-full max-w-[1200px] items-center justify-center overflow-hidden rounded-sm border-[1.45px] border-[#FDF2F0] bg-[#114C80] px-4 py-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] md:flex">
        <Image
          src="/logos/riviera-2026-logo-white.svg"
          alt="Riviera 2026"
          width={350}
          height={350}
          className="h-full w-[70%] object-contain"
        />
      </div>
    </div>
  )
}
