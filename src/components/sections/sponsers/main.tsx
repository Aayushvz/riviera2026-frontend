"use client"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Image from "next/image"
import React from "react"

const PillBadge = ({
  text,
  className,
}: {
  text: string
  className?: string
}) => (
  <div className="z-10 flex w-fit items-center justify-center justify-self-center md:justify-self-auto">
    <span
      className={`font-bebas rounded-full border border-black px-4 py-1 text-2xl font-medium tracking-wider uppercase ${className}`}
    >
      {text}
    </span>
  </div>
)

const SponsorWrapper = ({
  title = "SPONSOR",
  children,
}: {
  children: React.ReactNode
  title?: string | React.ReactNode
}) => (
  <div className="z-10 mt-16 flex flex-col items-center gap-4 md:mt-28 md:gap-10">
    <h2 className="font-nunito text-foreground max-w-6xl items-center text-center text-2xl font-bold tracking-wide md:text-5xl md:leading-15">
      {title}
    </h2>
    <div className="flex flex-wrap items-center justify-center gap-8">
      {children}
    </div>
  </div>
)

const SponsorItem = ({
  src,
  alt,
  height,
}: {
  src: string
  alt: string
  height?: string
}) => (
  <div className="z-10 flex flex-col items-center justify-center gap-4">
    <Image
      src={src}
      className={`${height ? height : "w-32 md:w-40"}`}
      width={100}
      height={100}
      alt={alt}
      draggable={false}
    />
  </div>
)

export default function SponsorSection() {
  const svgContainerRef = React.useRef<HTMLDivElement>(null)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const svgRef = React.useRef<SVGSVGElement>(null)
  gsap.registerPlugin(ScrollTrigger)

  React.useEffect(() => {
    if (!svgRef.current || !svgContainerRef.current || !contentRef.current)
      return
    const paths = svgRef.current.querySelectorAll("path")

    paths.forEach((path) => {
      const length = path.getTotalLength()

      // Initial hidden state
      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        duration: 2,
        trigger: svgContainerRef.current,
        start: "top +20%",
        end: "bottom +40%",
        scrub: true,
      },
    })

    tl.to(paths, {
      strokeDashoffset: (i, el) => -el.getTotalLength(),
      ease: "none",
      stagger: 0.06,
      duration: 2,
    })

    tl.to(paths, {
      strokeDashoffset: (i, el) => -el.getTotalLength(),
      ease: "none",
      duration: 1,
      stagger: 0.08,
    })

    ScrollTrigger.create({
      trigger: ".sponsor",
      start: "top top",
      end: "bottom bottom",
      pin: svgContainerRef.current,
    })

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, [])

  return (
    <div ref={contentRef} className="sponsor relative overflow-hidden pb-24">
      <div className="z-10 mt-34 min-h-screen px-8 md:px-16">
        <PillBadge text="Sponsors" className="my-8 text-black" />

        <SponsorWrapper title="TITLE SPONSOR">
          <SponsorItem src="/sponsors/pepsi.svg" alt="Pepsi Logo" />
        </SponsorWrapper>

        <div className="flex flex-col justify-around md:flex-row">
          <SponsorWrapper title="SKINCARE PARTNER">
            <SponsorItem src="/sponsors/vcare.svg" alt="Vcare Logo" />
          </SponsorWrapper>

          <SponsorWrapper title="NUTRITION PARTNER">
            <SponsorItem src="/sponsors/4uwell.svg" alt="4UWell Logo" />
          </SponsorWrapper>
        </div>

        <div className="flex flex-col items-center justify-around md:flex-row">
          <SponsorWrapper title="EYEWEAR PARTNER">
            <SponsorItem
              height="w-72"
              src="/sponsors/specsmaker.png"
              alt="SpecsMaker Logo"
            />
          </SponsorWrapper>

          <SponsorWrapper
            title={
              <p>
                MARATHON
                <br /> REFRESHMENT PARTNER
              </p>
            }
          >
            <SponsorItem
              height="w-56"
              src="/sponsors/marathon_partner.png"
              alt="Marathon Partner Logo"
            />
          </SponsorWrapper>
        </div>

        <SponsorWrapper title="OTHER PARTNERS">
          <SponsorItem
            height="h-max w-96"
            src="/sponsors/kvb.png"
            alt="KVB Logo"
          />
          <SponsorItem
            height="h-28 w-max"
            src="/sponsors/cub.png"
            alt="CUB Logo"
          />
          <SponsorItem
            height="h-28 w-max"
            src="/sponsors/indianBank.png"
            alt="Indian Bank Logo"
          />
          <SponsorItem
            height="h-max w-92"
            src="/sponsors/school_needs.png"
            alt="School Needs"
          />
          <SponsorItem
            height="h-34 w-max"
            src="/sponsors/mojo-cafe.png"
            alt="Mojo Cafe Logo"
          />
          <SponsorItem
            height="h-28 w-max"
            src="/sponsors/raj.png"
            alt="Raj Sweets Logo"
          />
        </SponsorWrapper>
      </div>

      <div
        ref={svgContainerRef}
        className="absolute top-0 -left-56 z-0 h-658 w-screen object-contain opacity-30"
      >
        <svg
          ref={svgRef}
          width="2631"
          height="2632"
          viewBox="0 0 2631 2632"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.6">
            <path
              d="M0.896047 0.474095C214.443 431.477 477.817 864.24 729.328 1082.38C1410.31 1652.36 1859.6 2017.42 2629.9 2630.47"
              stroke="#404040"
              style={{ mixBlendMode: "plus-lighter" }}
              strokeWidth="2"
            />
            <path
              d="M35.1993 0.474095C201.526 345.032 419.599 667.088 639.52 818.974C731.923 930.077 1968.29 1599.5 2629.9 2035.47"
              stroke="#404040"
              style={{ mixBlendMode: "plus-lighter" }}
              strokeWidth="2"
            />
            <path
              d="M73.6189 0.474095C228.232 308.251 353.641 507.991 700.663 725.319C774.853 771.782 1973.65 1232.84 2629.9 1613.47"
              stroke="#404040"
              style={{ mixBlendMode: "plus-lighter" }}
              strokeWidth="2"
            />
            <path
              d="M109.294 0.474095C264.461 288.645 416.18 489.776 798.925 656.798C798.925 656.798 1861.82 1032.6 2629.9 1315.47"
              stroke="#404040"
              style={{ mixBlendMode: "plus-lighter" }}
              strokeWidth="2"
            />
            <path
              d="M142.225 0.474095C261.634 272.125 477.487 468.99 786.723 581.17C816.004 591.792 2020.61 961.701 2629.9 1113.47"
              stroke="#404040"
              style={{ mixBlendMode: "plus-lighter" }}
              strokeWidth="2"
            />
            {/* <path
              d="M177.901 0.474095C297.773 261.228 523.685 434.36 832.586 526.205C862.805 535.19 2055.13 810.184 2629.9 910.474"
              stroke="#404040"
              style={{ mixBlendMode: "plus-lighter" }}
              strokeWidth="2"
            /> */}
          </g>
        </svg>
      </div>
    </div>
  )
}
