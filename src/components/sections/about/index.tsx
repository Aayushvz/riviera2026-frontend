"use client"

import React, { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

import PixelStrips from "../../pixel-strips"

gsap.registerPlugin(ScrollTrigger)

const AboutSection = () => {
  const section1Ref = useRef(null)
  const section2Ref = useRef(null)
  const section3Ref = useRef(null)
  const parallaxRef = useRef(null)
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([])
  const text = "Four days. Infinite energy. One unforgettable campus takeover."
  const words = text.split(" ")
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768

  useGSAP(
    () => {
      const validWords = wordsRef.current.filter((el) => el !== null)

      if (!isMobile) {
        gsap.from(validWords, {
          y: "110%",
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: section1Ref.current,
            start: "top 60%",
            end: "top 10%",
            scrub: 0.4,
            markers: false,
          },
        })

        gsap.to(section1Ref.current, {
          y: -150,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section1Ref.current,
            start: "top 80%",
            end: "bottom 40%",
            scrub: true,
            markers: false,
          },
        })
      }

      gsap.to(section2Ref.current, {
        y: -150,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section3Ref.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
          markers: false,
        },
      })

      gsap.to(section3Ref.current, {
        y: -100,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section3Ref.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
          markers: false,
        },
      })

      gsap.to(parallaxRef.current, {
        y: -110,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: section3Ref.current,
          start: "top 250%",
          end: "bottom 100%",
          scrub: true,
          markers: false,
        },
      })

      requestAnimationFrame(() => {
        ScrollTrigger.refresh()
      })
    },
    { scope: section1Ref },
  )

  return (
    <div id="about" className="relative h-full">
      <div className="bg-foreground absolute left-1/2 h-full w-px" />
      <section
        ref={section1Ref}
        className="relative flex h-auto items-center overflow-hidden px-8 pt-50 md:px-16"
      >
        <div className="bg-background z-10 max-w-5xl">
          <div className="flex h-auto flex-col gap-4 py-8 md:gap-10">
            <PillBadge text="About Riviera" />
            <h2 className="font-nunito text-foreground flex flex-wrap gap-x-[0.25em] text-[10vw] leading-[0.9] font-bold tracking-tight md:text-[7vw]">
              {words.map((word, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    paddingBottom: "0.1em",
                  }}
                >
                  <span
                    ref={(el) => {
                      wordsRef.current[index] = el
                    }}
                    style={{ display: "inline-block", willChange: "transform" }}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h2>
          </div>
        </div>
      </section>
      <section
        ref={section2Ref}
        className="relative flex justify-center px-8 py-30 md:px-16"
      >
        <div className="relative">
          <PixelStrips
            src="/videos/bg.webm"
            className="h-90 w-90 sm:h-100 sm:w-100 md:h-150 md:w-150 xl:h-250 xl:w-250"
          />

          {/* OVERLAY GROUP – positioned RELATIVE to upper PixelStrips */}
          <div
            ref={parallaxRef}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <div className="absolute top-30 -left-5 sm:-left-15 md:top-70 xl:top-50 xl:-left-30">
              <PixelStrips
                src="/videos/1.webm"
                className="h-30 w-30 xl:h-60 xl:w-60"
              />
            </div>

            <div className="absolute -bottom-15 left-40 sm:-bottom-35 xl:-bottom-50 xl:left-50">
              <PixelStrips
                src="/videos/2.webm"
                className="h-30 w-30 xl:h-50 xl:w-50"
              />
            </div>

            <div className="absolute top-10 -right-5 sm:-right-20 md:top-40 md:-right-15 xl:top-40 xl:-right-30">
              <PixelStrips
                src="/videos/3.webm"
                className="h-35 w-35 xl:h-80 xl:w-80"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        ref={section3Ref}
        className="flex flex-col items-center justify-center gap-4 px-8 py-8 md:gap-10 md:px-16"
      >
        <div className="bg-background z-10 flex flex-col items-center justify-center gap-4 py-10 md:gap-10">
          <PillBadge text="About VIT" />
          <h2 className="font-nunito text-foreground max-w-6xl items-center text-center text-2xl font-bold tracking-wide md:text-6xl md:leading-15">
            At VIT, we empower students through globally benchmarked{" "}
            <PillBgBadge text="Education" bg="bg-[#ad7dfe] text-foreground" />,
            innovation driven{" "}
            <PillBgBadge text="Learning" bg="bg-[#ff44fe] text-foreground" />,
            and a diverse campus culture. Supported by{" "}
            <PillBgBadge text="Experienced" bg="bg-[#aaf039] text-foreground" />{" "}
            faculty, we foster excellence in teaching and research as a core
            institutional ethos.
          </h2>
        </div>
      </section>
    </div>
  )
}

const PillBgBadge = ({ text, bg }: { text: string; bg?: string }) => (
  <span
    className={`font-nunito inline-flex rounded-full px-4 py-0.5 align-baseline text-xl font-bold md:text-5xl ${bg ? bg : "bg-black text-white"}`}
  >
    {text}
  </span>
)

export const PillBadge = ({
  text,
  className,
}: {
  text: string
  className?: string
}) => (
  <div className="flex w-fit items-center justify-center">
    <span
      className={`font-bebas rounded-full border border-black px-4 py-1 text-2xl font-medium tracking-wider uppercase ${className}`}
    >
      {text}
    </span>
  </div>
)

export default AboutSection
