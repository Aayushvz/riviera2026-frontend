import React from "react"
import Image from "next/image"

interface EventProps {
  title: string
  date: string
  description: string
  name: string
  url: string
  color: string
}

export default function Card({
  title,
  date,
  description,
  name,
  url,
  color,
}: EventProps) {
  return (
    <div className="flex h-auto w-80 flex-col items-start space-y-2 rounded-t-full bg-black p-4 text-white">
      <Image
        src={url}
        alt={name}
        width={320}
        height={180}
        className="rounded-t-full"
      />
      <div className="font-bebas-rounded flex w-full items-center justify-between">
        <div className="mt-4 flex gap-1 text-4xl">
          <h2 className={`font-medium text-white`}>{title.split(" ")[0]}</h2>
          <h2 className={`font-medium`} style={{ color: color }}>
            {title.split(" ")[1]}
          </h2>
        </div>
        <p className="mt-4 text-2xl font-medium">{date}</p>
      </div>
      <p className="text-sm">{description}</p>
      <p
        className={`font-bebas-rounded text-[${color}] text-4xl font-bold`}
        style={{ color: color }}
      >
        {name}
      </p>
    </div>
  )
}
