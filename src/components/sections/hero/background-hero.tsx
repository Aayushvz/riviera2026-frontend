"use client"

import React from "react"

const HeroBG = () => {
  const text = "RISE RUSH REVEL"

  return (
    // h-screen ensures the container is exactly the height of the device
    // flex-col allows us to divide it vertically
    <div className="bg-background z-10 mt-20 flex h-full w-full flex-col overflow-hidden">
      {/* Top Half: flex-1 makes it take 50% height */}
      <div className="text-secondary-foreground flex w-full flex-1 items-center overflow-hidden whitespace-nowrap">
        <div className="animate-marquee-left flex w-fit">
          {[1, 2, 3, 4].map((_, i) => (
            <h1
              key={i}
              className="font-bebas-rounded pr-10 text-[40vh] leading-none tracking-wide"
            >
              {text}
            </h1>
          ))}
        </div>
      </div>

      {/* Bottom Half: flex-1 makes it take 50% height */}
      <div className="text-secondary-foreground flex w-full flex-1 items-center overflow-hidden whitespace-nowrap">
        <div className="animate-marquee-right flex w-fit">
          {[1, 2, 3, 4].map((_, i) => (
            <h1
              key={i}
              className="font-bebas-rounded pr-10 text-[40vh] leading-none tracking-wide"
            >
              {text}
            </h1>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          from {
            transform: translateX(-50%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-marquee-left {
          animation: marquee-left 40s linear infinite;
          will-change: transform;
        }

        .animate-marquee-right {
          animation: marquee-right 40s linear infinite;
          will-change: transform;
        }
      `}</style>
    </div>
  )
}

export default HeroBG
