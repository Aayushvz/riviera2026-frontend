"use client"

import React, { useState, useRef } from "react"
import CategoryCard from "./category-card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

type Item = {
  title: string
  description: string
}

export default function MobileCategoryCarousel({ items }: { items: Item[] }) {
  const [index, setIndex] = useState(0)
  const touchStartX = useRef<number | null>(null)

  const prev = () => setIndex((i) => Math.max(0, i - 1))
  const next = () => setIndex((i) => Math.min(items.length - 1, i + 1))

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta > 50) prev()
    if (delta < -50) next()
    touchStartX.current = null
  }

  return (
    <div
      className="relative mx-auto mt-6 flex w-full max-w-xs items-center justify-center md:hidden"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Left */}
      <button
        onClick={prev}
        disabled={index === 0}
        className="bg-primary absolute -left-4 z-10 rounded-full p-2 text-white shadow disabled:opacity-40"
        aria-label="Previous category"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Card */}
      <Link href={`/events?category=${items[index].title}`} className="block">
        <CategoryCard
          title={items[index].title}
          description={items[index].description}
          size="md"
        />
      </Link>

      {/* Right */}
      <button
        onClick={next}
        disabled={index === items.length - 1}
        className="bg-primary absolute -right-4 z-10 rounded-full p-2 text-white shadow disabled:opacity-40"
        aria-label="Next category"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  )
}
