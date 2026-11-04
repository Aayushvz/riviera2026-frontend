import React from "react"
import CardLayout from "./ui/card-layout"

const TeamHero = () => {
  return (
    <div className="relative grid h-screen w-screen grid-cols-6 grid-rows-1 gap-px bg-white">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-full w-full bg-[#212121]" />
      ))}
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
        <h1 className="font-bebas-rounded text-center text-[30vw] leading-none tracking-[0.08em] text-[#FDF2F0] md:text-[20vw] lg:text-[12vw]">
          MEET THE TEAM
        </h1>
      </div>
    </div>
  )
}

export default TeamHero
