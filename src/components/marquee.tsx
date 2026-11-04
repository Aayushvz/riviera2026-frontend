import React from "react"
import Marquee from "react-fast-marquee"
import Image from "next/image"

interface MarqueeCustomProps {
  words: string[]
  logoSrc?: string
  logoAlt?: string
  speed?: number
  direction?: "left" | "right"
  className?: string
  textClassName?: string
  logoClassName?: string
}

const MarqueeCustom: React.FC<MarqueeCustomProps> = ({
  words,
  logoSrc = "/logos/riviera-marquee-logo.svg",
  logoAlt = "Riviera 2026",
  speed = 50,
  direction = "left",
  className = "",
  textClassName = "",
  logoClassName = "",
}) => {
  return (
    <Marquee autoFill speed={speed} direction={direction}>
      <div
        className={`font-bebas-rounded flex min-h-20 items-center justify-center gap-6 bg-white pr-6 text-3xl lg:text-5xl ${className}`}
      >
        {words.map((word, index) => (
          <React.Fragment key={index}>
            <span className={textClassName}>{word}</span>
            <Image
              src={logoSrc}
              alt={logoAlt}
              className={`w-14 lg:w-18 ${logoClassName}`}
              width={1000}
              height={1000}
              draggable={false}
            />
          </React.Fragment>
        ))}
      </div>
    </Marquee>
  )
}

export default MarqueeCustom
