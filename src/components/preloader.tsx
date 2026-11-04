"use client"

import { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { usePathname } from "next/navigation"
import { useLenis } from "@/hooks/useLenis"

const Preloader = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [counter, setCounter] = useState(0)
  const pathname = usePathname()
  const lenis = useLenis()

  useGSAP(
    () => {
      if (pathname !== "/") return
      if (/^\/events\/[a-zA-Z0-9_-]+$/.test(pathname)) return

      document.documentElement.style.overflowY = "hidden"
      document.body.style.overflowY = "hidden"
      lenis.stop()

      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflowY = ""
          document.body.style.overflowY = ""
          lenis.start()
        },
      })

      // Animate counter from 0 to 100 (shorter: ~1.6s)
      tl.to(
        {},
        {
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: function () {
            setCounter(Math.round(this.progress() * 100))
          },
        },
      )

      tl.to(
        ".progress-bar",
        {
          width: "100%",
          duration: 1.6,
          ease: "power2.inOut",
        },
        "<",
      )

      // Fade out counter and progress bar
      tl.to(".loader-content", {
        opacity: 0,
        duration: 0.4,
        ease: "power1.inOut",
      })

      // Strip exit animation (short duration + tighter stagger)
      tl.fromTo(
        ".strip-col",
        { yPercent: 0 },
        {
          yPercent: -100,
          duration: 0.25,
          ease: "none",
          stagger: {
            amount: 0.2,
            from: "start",
          },
        },
        "<",
      )

      return () => {
        document.documentElement.style.overflowY = "unset"
        document.body.style.overflowY = "unset"
      }
    },
    { scope: containerRef, dependencies: [pathname] },
  )

  if (pathname !== "/") return null
  if (!pathname.includes("/events/")) return null

  return (
    <div
      ref={containerRef}
      className="pointer-events-none fixed inset-0 z-100 h-screen w-screen overflow-hidden"
    >
      {/* Strip columns */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative h-full w-full overflow-hidden">
            <div className="strip-col h-full w-full border-r border-white/10 bg-[#121212]" />
          </div>
        ))}
      </div>

      {/* Counter and progress bar */}
      <div className="loader-content absolute inset-0 flex flex-col justify-end">
        <div className="relative z-10 px-4 pb-4 md:px-10 md:pb-10">
          <h1 className="font-bebas-rounded text-9xl leading-none text-white md:text-[12rem]">
            {counter}%
          </h1>
        </div>

        <div className="relative h-16 w-full overflow-hidden bg-white/10 md:h-12">
          <div
            className="progress-bar h-full w-0 bg-[#AD7CFF]"
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% 20%, calc(100% - 8px) 20%, calc(100% - 8px) 30%, calc(100% - 24px) 30%, calc(100% - 24px) 40%, calc(100% - 16px) 40%, calc(100% - 16px) 60%, calc(100% - 24px) 60%, calc(100% - 24px) 70%, calc(100% - 8px) 70%, calc(100% - 8px) 80%, 100% 80%, 100% 100%, 0 100%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Preloader
