"use client"
import React from "react"
import RecordPlayer from "./record-player"
import DjButton from "@/components/sections/footer/ui/dj-button"
import DjKnob from "@/components/sections/footer/ui/dj-knob"
import DjFader from "@/components/sections/footer/ui/dj-fader"
import Image from "next/image"

export default function PlayerSection() {
  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-hidden md:gap-0 lg:flex-row">
      {/* Left Controls */}
      <div className="flex hidden h-auto w-full flex-col items-center justify-between bg-[#AD7CFF] p-4 pl-0 lg:flex lg:h-full lg:w-[35%]">
        {/* Knobs (Top) */}
        <div className="-mb-4 flex gap-4">
          <DjKnob />
          <DjKnob />
        </div>

        {/* Pads Grid */}
        <div className="flex w-full flex-wrap items-center justify-center gap-x-1 gap-y-4 px-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex w-[30%] justify-center">
              <div className="w-7">
                <DjButton
                  variant="yellow"
                  className="border-b-4 shadow-lg hover:opacity-85"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Faders (Lower Middle) */}
        <div className="flex w-full justify-center gap-2">
          <DjFader initialPos={60} />
          <DjFader initialPos={40} />
          <DjFader initialPos={80} />
        </div>

        {/* Grey Buttons */}
        <div className="mb-4 flex gap-6">
          {" "}
          {/* Increased gap-4 to gap-6 so big logos don't overlap each other */}
          {/* Button 1 */}
          <div className="relative h-11 w-10 cursor-pointer rounded-xs border-2 border-white bg-gray-300 shadow-md transition-transform select-none hover:opacity-85 active:scale-95">
            <div className="pointer-events-none absolute -top-2 -left-2 h-14 w-14 -rotate-12">
              <Image
                src="/logos/riviera-lettermark-blue.svg"
                alt="Riviera Logo"
                fill
                className="object-contain drop-shadow-sm"
              />
            </div>
          </div>
          {/* Button 2 */}
          <div className="relative h-11 w-10 cursor-pointer rounded-xs border-2 border-white bg-gray-300 shadow-md transition-transform select-none hover:opacity-85 active:scale-95">
            <div className="pointer-events-none absolute -top-2 -left-2 h-14 w-14 -rotate-12">
              <Image
                src="/logos/riviera-lettermark-blue.svg"
                alt="Riviera Logo"
                fill
                className="object-contain drop-shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Record Player */}
      <div className="pointer-events-none relative h-full w-[65%] overflow-hidden">
        <div className="absolute top-0 right-[-45%] bottom-0 flex w-[140%] items-center justify-center lg:pr-0">
          <RecordPlayer />
        </div>
      </div>
    </div>
  )
}
