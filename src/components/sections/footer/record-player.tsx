"use client"
import React from "react"
import Image from "next/image"

export default function RecordPlayer({
  className = "",
}: {
  className?: string
}) {
  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`}>
      {/* Blue Box */}
      <div className="absolute top-7 right-0 bottom-[10%] left-0 w-full rounded-l-3xl border-1 border-[#FDF2F0] bg-[#114C80] shadow-lg">
        <div className="absolute top-1/2 left-4 flex -translate-y-1/2 flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-4 w-4 rounded-full border-2 border-white bg-[#374151] shadow-sm"
            />
          ))}
        </div>
        <div className="absolute bottom-6 left-6 flex gap-3">
          <div className="h-8 w-3 border-2 border-white bg-[#374151]" />
          <div className="h-8 w-3 border-2 border-white bg-[#374151]" />
        </div>
        {/* Tone Arm */}
        <div className="pointer-events-none absolute top-2 -left-1 z-50 h-1/3 w-1/3 origin-top-left animate-[sway_3s_ease-in-out_infinite]">
          <div className="relative h-full w-full">
            <Image
              src="/footer/player-needle.svg"
              alt="Tone Arm"
              fill
              className="w-[90%] object-contain drop-shadow-xl"
              priority
            />
          </div>
        </div>
      </div>

      {/* Vinyl Disc + Curved Text */}
      <div className="absolute top-0 right-[-10%] bottom-0 z-40 flex w-full items-center justify-center">
        <div className="relative flex h-full w-full animate-[spin_12s_linear_infinite] items-center justify-center">
          {/* The Disc Image */}
          <Image
            src="/footer/player-disc.svg"
            alt="Vinyl Disc"
            fill
            sizes="(max-width: 768px) 80vw, 50vw"
            className="object-contain drop-shadow-2xl"
            priority
          />
          <svg
            viewBox="0 0 100 100"
            className="pointer-events-none absolute inset-0 h-full w-full"
          >
            <defs>
              <path
                id="textCircle"
                d="M 50, 50 m -30, 0 a 30,30 0 1,1 60, 0 a 30,30 0 1,1 -60, 0"
              />
            </defs>

            <text
              className="font-[family-name:var(--font-koloss)]"
              fill="#EAB308"
              fontSize="16"
              fontWeight="bold"
              letterSpacing="0.05em"
            >
              <textPath
                xlinkHref="#textCircle"
                startOffset="50%"
                textAnchor="middle"
              >
                RISE{"\u00A0"}RUSH{"\u00A0"}REVEL{"\u00A0"}
              </textPath>
            </text>
          </svg>
        </div>
      </div>

      <style jsx global>{`
        @keyframes sway {
          0%,
          100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(2deg);
          }
        }
      `}</style>
    </div>
  )
}
