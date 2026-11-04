import React from "react"
import Card from "./card"
import { data } from "./data"

export default function Proshow() {
  return (
    <div className="flex min-h-[110vh] w-screen flex-col items-center space-y-6 bg-black bg-[url('/bg.svg')] bg-cover bg-center bg-no-repeat py-20">
      <div className="font-bebas left-8 z-50 mt-20 flex items-center justify-center gap-1 rounded-full border-[1.5px] border-[#2BA9A8] px-4 py-1 text-center text-2xl leading-none tracking-wide text-[#2BA9A8] uppercase md:left-16 md:text-[32px]">
        Proshow Artists
      </div>
      <div className="relative mx-auto mt-20 grid w-screen max-w-6xl grid-cols-1 gap-8 md:grid-cols-2">
        {data.map((event) => (
          <div
            className="flex w-full items-center justify-center"
            key={event.name}
          >
            <Card
              key={event.name}
              title={event.title}
              date={event.date}
              description={event.description}
              name={event.name}
              url={event.url}
              color={event.color}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
