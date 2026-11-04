import React from "react"
import Image from "next/image"

type SlideCardProps = {
  day: string
  image: string
  artistName: string
  date: string
  description: string
  color: string
  hidden?: boolean
}

const SlideCard = ({
  day,
  image,
  artistName,
  date,
  description,
  color,
  hidden = false,
}: SlideCardProps) => {
  return (
    <div
      className={`border-background mx-auto flex h-full w-full min-w-[320px] flex-col gap-3 border bg-transparent p-6 ${
        hidden ? "hidden opacity-0" : "flex"
      }`}
    >
      <div className="relative w-fit">
        <Image
          src={image}
          alt={artistName}
          width={1000}
          height={1000}
          draggable={false}
          priority={false}
        />
        <p
          className={`font-bebas-rounded text-background absolute top-2 left-2 text-3xl lg:top-0 lg:left-0 lg:text-2xl xl:text-4xl`}
        >
          <span style={{ color }}>{day.split(" ")[0]}</span> {day.split(" ")[1]}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <p
          style={{ color }}
          className="font-bebas-rounded text-3xl leading-none lg:text-3xl xl:text-5xl"
        >
          {artistName}
        </p>
        <p className="font-bebas-rounded text-background text-2xl lg:text-xl xl:text-3xl">
          {date}
        </p>
        <p className="font-bebas-nunito text-background xl:text-md w-full text-sm leading-tight">
          {description}
        </p>
      </div>
    </div>
  )
}

export default SlideCard
