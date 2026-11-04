"use client"

import React, { useRef, useEffect } from "react"
import { PillBadge } from "../about"
import Link from "next/link"
import ActionButton from "@/components/radio/action-button"
import MarqueeCustom from "@/components/marquee"
import CategoryCard from "./category-card"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import MobileCategoryCarousel from "./mobile-category-carousel"

gsap.registerPlugin(ScrollTrigger)

const dummyCategories = [
  {
    title: "adventure_sports",
    description:
      "Thrill-packed events designed to push physical limits, teamwork, and the spirit of adventure.",
  },
  {
    title: "art_drama",
    description:
      "A celebration of theatrical expression through drama, mime, and powerful storytelling on stage.",
  },
  {
    title: "cyber_engage",
    description:
      "Interactive tech and digital events exploring gaming, innovation, and the future of creativity.",
  },
  {
    title: "dance",
    description:
      "A vibrant mix of classical, contemporary, and freestyle performances filled with energy and expression.",
  },
  {
    title: "informal",
    description:
      "Easygoing, crowd-favorite events focused on fun, laughter, and spontaneous participation.",
  },
  {
    title: "music",
    description:
      "From soulful melodies to high-energy performances, this category celebrates musical talent in all forms.",
  },
  {
    title: "pre_riviera",
    description:
      "A series of exciting lead-up events that set the tone and build momentum for the main fest.",
  },
  {
    title: "premium",
    description:
      "Curated, large-scale events offering exclusive experiences and standout entertainment.",
  },
  {
    title: "quiz_words_worth",
    description:
      "Thought-provoking quizzes that test knowledge, quick thinking, and teamwork across domains.",
  },
  {
    title: "sports",
    description:
      "Competitive sporting events that highlight athletic skill, strategy, and team spirit.",
  },
  {
    title: "workshop",
    description:
      "Hands-on learning sessions led by experts, focused on skill-building and creative exploration.",
  },
]

const CategorySection = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return

    const ctx = gsap.context(() => {
      const scroller = scrollerRef.current!
      const container = containerRef.current!

      const getScrollDistance = () =>
        scroller.scrollWidth - scroller.clientWidth + 20

      gsap.to(scroller, {
        x: () => -getScrollDistance(),
        ease: "power1.inOut",
        scrollTrigger: {
          trigger: scroller,
          start: "top 50%",
          end: () => `+=${getScrollDistance()}`,
          scrub: 1,
          pin: container,
          pinSpacing: true,
          markers: false,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative">
      <div
        id="categories"
        ref={containerRef}
        className="bg-foreground flex min-h-screen w-full flex-col"
      >
        <div className="flex w-full flex-col gap-6 px-8 py-10">
          <PillBadge
            text="Events"
            className="text-background border-background!"
          />

          <h1 className="font-bebas-rounded text-background text-7xl font-medium uppercase lg:max-w-3xl xl:max-w-5xl xl:text-9xl">
            A FEST OF MANY BEATS
          </h1>

          <p className="font-nunito text-background text-xl lg:max-w-5xl">
            A power-packed lineup of cultural events awaits - electrifying
            competitions, immersive performances, creative showcases, and
            crowd-favorite fun zones. From spotlight stages to behind-the-scenes
            magic, every event is designed to celebrate passion, talent, and
            pure fest spirit. Step in, stand out, and soak it all in.
          </p>

          {/* Horizontal Category Cards*/}
          <MobileCategoryCarousel items={dummyCategories} />
          <div
            ref={scrollerRef}
            className="scrollbar-hide overflow--x-auto relative -mx-8 mt-6 hidden w-[calc(100%+4rem)] px-8 pb-4 md:block"
          >
            <div className="flex w-max gap-6 md:pr-6">
              {dummyCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  href={`/events?category=${cat.title}`}
                  className="block"
                >
                  <CategoryCard
                    key={idx}
                    title={cat.title}
                    description={cat.description}
                    size="md"
                  />
                </Link>
              ))}
            </div>
          </div>

          <Link href="/events">
            <ActionButton
              playAction={true}
              riveFile="/categories/explore.riv"
              className="scale-130 sm:scale-100"
            />
          </Link>
        </div>
      </div>

      <MarqueeCustom words={["RIVIERA", "2026"]} direction="left" />
    </div>
  )
}

export default CategorySection
