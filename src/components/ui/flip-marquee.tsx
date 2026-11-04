"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import Marquee from "react-fast-marquee"

type MarqueeItem = {
  text: string
  href: string
}

export default function HorizontalMarquee({
  items,
  interval = 3000,
}: {
  items: MarqueeItem[]
  interval?: number
}) {
  return (
    <div className="bg-primary perspective relative flex h-10 w-full items-center justify-center overflow-hidden">
      <Marquee
        speed={items.length === 1 ? 0 : 120}
        className="flex h-full w-full items-center justify-start whitespace-nowrap"
      >
        {items.map((item, index) => (
          <div
            className={`${items.length === 1 ? "w-screen" : "px-[10rem] md:w-[70vw]"} flex justify-center`}
            key={index}
          >
            <Link
              key={index}
              href={item.href}
              className="flex items-center gap-2 text-sm font-bold uppercase lg:text-lg"
            >
              <p>{item.text}</p>
              <ArrowRight className="-rotate-45 font-bold" />
            </Link>
          </div>
        ))}
      </Marquee>
    </div>
  )
}
