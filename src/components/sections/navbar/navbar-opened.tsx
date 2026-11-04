"use client"

import React, { useRef } from "react"
import { X, ArrowRight } from "lucide-react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import scrollToSection from "@/lib/scroll-to-section"
import { useRouter, usePathname } from "next/navigation"

interface MenuOverlayProps {
  isOpen: boolean
  closeMenu: () => void
}

const menuItems = [
  { label: "HOME", type: "page", href: "/" },
  { label: "ABOUT", type: "section", sectionId: "about" },
  { label: "INTERNAL EVENTS", type: "page", href: "/events" },
  { label: "EXTERNAL EVENTS", type: "page", href: "/external-events" },
  { label: "MERCH", type: "page", href: "/merch" },
  { label: "TEAM", type: "page", href: "/team" },
  { label: "FAQS", type: "page", href: "/faq" },
  { label: "ANNOUNCEMENTS", type: "page", href: "/announcements" },
]

const MenuOverlay: React.FC<MenuOverlayProps> = ({ isOpen, closeMenu }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const arrowWrapperRefs = useRef<(HTMLDivElement | null)[]>([])
  const arrowIconRefs = useRef<(HTMLDivElement | null)[]>([])

  const hoveredIndexRef = useRef<number | null>(null)

  const pathname = usePathname()
  const router = useRouter()

  const getActiveIndex = () => {
    const pageIndex = menuItems.findIndex(
      (item) => item.type === "page" && item.href === pathname,
    )

    if (pageIndex !== -1) return pageIndex

    if (pathname === "/") {
      const params = new URLSearchParams(window.location.search)
      const section = params.get("s")

      if (section) {
        const sectionIndex = menuItems.findIndex(
          (item) => item.type === "section" && item.sectionId === section,
        )
        if (sectionIndex !== -1) return sectionIndex
      }
    }

    return -1
  }

  const { contextSafe } = useGSAP(
    () => {
      gsap.defaults({ overwrite: "auto" })
      gsap.ticker.lagSmoothing(0)

      gsap.set(containerRef.current, { autoAlpha: 0 })
      gsap.set(".menu-block", { xPercent: -100 })

      menuItems.forEach((_, index) => {
        const activeIndex = getActiveIndex()
        const isActive = index === activeIndex

        gsap.set(arrowWrapperRefs.current[index], {
          width: isActive ? "auto" : 0,
        })

        gsap.set(arrowIconRefs.current[index], {
          x: isActive ? 0 : -30,
        })
      })
    },
    { scope: containerRef },
  )

  useGSAP(
    () => {
      const activeIndex = getActiveIndex()

      menuItems.forEach((_, index) => {
        const wrapper = arrowWrapperRefs.current[index]
        const icon = arrowIconRefs.current[index]
        if (!wrapper || !icon) return

        gsap.killTweensOf([wrapper, icon])

        gsap.set(icon, {
          rotation: 0,
          x: -30,
          opacity: 1,
        })

        if (index === activeIndex) {
          gsap.to(wrapper, {
            width: "auto",
            duration: 0.4,
            ease: "power3.out",
          })

          gsap.to(icon, {
            x: 0,
            duration: 0.4,
            ease: "power3.out",
          })
        } else {
          gsap.to(wrapper, {
            width: 0,
            duration: 0.3,
            ease: "power3.inOut",
          })

          gsap.to(icon, {
            x: -30,
            duration: 0.3,
            ease: "power3.inOut",
          })
        }
      })
    },
    {
      dependencies: [pathname],
      scope: containerRef,
    },
  )

  const setArrowActive = (index: number) => {
    const wrapper = arrowWrapperRefs.current[index]
    const icon = arrowIconRefs.current[index]
    if (!wrapper || !icon) return

    gsap.to(wrapper, {
      width: "auto",
      duration: 0.3,
      ease: "power3.out",
    })

    gsap.to(icon, {
      x: 0,
      rotation: 0,
      opacity: 1,
      duration: 0.3,
      ease: "power3.out",
    })
  }

  const setArrowDimmed = (index: number) => {
    const icon = arrowIconRefs.current[index]
    if (!icon) return

    gsap.to(icon, {
      rotation: -45,
      x: -6,
      duration: 0.25,
      ease: "power3.out",
    })
  }

  const setArrowClosed = (index: number) => {
    const wrapper = arrowWrapperRefs.current[index]
    const icon = arrowIconRefs.current[index]
    if (!wrapper || !icon) return

    gsap.to(wrapper, {
      width: 0,
      duration: 0.25,
      ease: "power3.inOut",
    })

    gsap.to(icon, {
      x: -30,
      rotation: 0,
      opacity: 1,
      duration: 0.25,
      ease: "power3.inOut",
    })
  }

  useGSAP(() => {
    const container = containerRef.current
    if (!container) return

    if (isOpen) {
      gsap.set(container, { autoAlpha: 1 })

      gsap.fromTo(
        ".menu-block",
        { xPercent: -100 },
        {
          xPercent: 0,
          duration: 0.8,
          ease: "power3.inOut",
          stagger: { amount: 0.4, from: "random" },
          force3D: true,
        },
      )
    } else {
      gsap.to(".menu-block", {
        xPercent: -100,
        duration: 0.6,
        ease: "power3.in",
        stagger: { amount: 0.2, from: "random" },
        onComplete: () => {
          gsap.set(container, { autoAlpha: 0 })
        },
      })
    }
  }, [isOpen])

  const handleMouseEnter = contextSafe((index: number) => {
    hoveredIndexRef.current = index
    const activeIndex = getActiveIndex()
    if (activeIndex !== -1 && activeIndex !== index) {
      setArrowDimmed(activeIndex)
    }
    setArrowActive(index)
    const wrapper = arrowWrapperRefs.current[index]
    const icon = arrowIconRefs.current[index]
    if (!wrapper || !icon) return
    gsap.killTweensOf([wrapper, icon])
    gsap.to(wrapper, { width: "auto", duration: 0.4, ease: "power3.out" })
    gsap.to(icon, { x: 0, duration: 0.4, ease: "power3.out" })
  })

  const handleMouseLeave = contextSafe((index: number) => {
    hoveredIndexRef.current = null
    const activeIndex = getActiveIndex()
    if (index !== activeIndex) {
      setArrowClosed(index)
    }
    if (activeIndex !== -1) {
      setArrowActive(activeIndex)
    }
    if (index === activeIndex) return
    const wrapper = arrowWrapperRefs.current[index]
    const icon = arrowIconRefs.current[index]
    if (!wrapper || !icon) return
    gsap.killTweensOf([wrapper, icon])
    gsap.to(wrapper, { width: 0, duration: 0.25, ease: "power3.inOut" })
    gsap.to(icon, { x: -30, duration: 0.25, ease: "power3.inOut" })
  })

  return (
    <div
      ref={containerRef}
      className="font-bebas pointer-events-auto invisible fixed inset-0 z-999 flex max-h-screen w-full flex-col"
    >
      <div className="relative h-24 w-full shrink-0 overflow-hidden">
        <div className="menu-block border-foreground bg-primary absolute inset-0 flex items-center justify-end border border-b px-6 will-change-transform">
          <button
            onClick={closeMenu}
            className="bg-background border-foreground cursor-pointer border p-2 transition-colors hover:bg-gray-100"
          >
            <X size={32} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="grid w-full grow grid-cols-1 md:grid-cols-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`${item.label === "" ? "hidden md:block" : ""} relative h-full w-full overflow-hidden`}
            onClick={() => {
              closeMenu()

              if (item.type === "section" && item.sectionId) {
                if (pathname === "/") {
                  scrollToSection(item.sectionId)
                } else {
                  router.push(`/?s=${item.sectionId}`)
                }
                return
              }

              if (item.type === "page") {
                router.push(item.href!)
              }
            }}
          >
            <div
              onClick={closeMenu}
              onMouseEnter={() => item.label !== "" && handleMouseEnter(index)}
              onMouseLeave={() => item.label !== "" && handleMouseLeave(index)}
              className={`menu-block border-foreground bg-primary absolute inset-0 flex cursor-pointer items-center border border-b px-6 py-8 ${index % 2 === 0 ? "md:border-r" : ""}`}
            >
              <h2 className="flex items-center text-5xl font-bold tracking-tight uppercase md:text-7xl">
                <div
                  ref={(el) => {
                    arrowWrapperRefs.current[index] = el
                  }}
                  className={`relative justify-start overflow-hidden ${index === 0 ? "" : "w-0"}`}
                >
                  <div
                    ref={(el) => {
                      arrowIconRefs.current[index] = el
                    }}
                    className="will-change-transform"
                  >
                    <ArrowRight
                      lengthAdjust={10}
                      strokeWidth={4}
                      strokeLinecap="butt"
                      strokeLinejoin="miter"
                      className="h-10 w-10 md:h-14 md:w-14"
                    />
                  </div>
                </div>
                <span>{item.label}</span>
              </h2>
            </div>
          </div>
        ))}
      </div>

      <div className="relative h-48 w-full shrink-0 overflow-hidden md:h-56">
        <div className="menu-block border-foreground bg-primary absolute inset-0 flex flex-col items-end justify-start border border-t p-6 md:p-10">
          <div className="text-right">
            <h3 className="font-nunito mb-2 text-3xl font-bold tracking-tighter uppercase md:text-4xl">
              RISE RUSH REVEL
            </h3>
            <p className="font-nunito font-sans text-sm font-medium tracking-tight opacity-90 md:text-lg">
              Get ready to move, groove and shine.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MenuOverlay
