import React from "react"
import {
  Clock,
  Calendar,
  Users,
  IndianRupee,
  Trophy,
  Shapes,
} from "lucide-react"
import type { Event } from "@/app/types/eventList"
import Image from "next/image"
import Markdown from "react-markdown"
import Link from "next/link"

const EventCard = ({
  event,
  type,
}: {
  event: Event
  type: "internal" | "external"
}) => {
  const isFeatured = event.pid === "evt_9f3b7c1a6d2e8b4c5a1d9e7f2c6b3a8d"
  const basePath = type === "internal" ? "/events" : "/external-events"
  return (
    <Link
      href={`${basePath}/${event.pid}`}
      className={`flex w-full flex-col overflow-hidden rounded-lg border-2 border-black bg-white font-sans shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 hover:shadow-none lg:flex-row`}
    >
      <div className="relative aspect-square w-full border-b-2 border-black bg-gray-100 lg:w-50 lg:shrink-0 lg:border-r-2 lg:border-b-0 xl:w-1/5">
        <Image
          src={event.image}
          alt={event.name}
          fill
          className="object-cover"
          draggable={false}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="p-4 pb-2">
          <div className="flex max-w-full items-center justify-between gap-2 whitespace-nowrap">
            <h1 className="font-bebas-rounded max-w-3/4 min-w-0 truncate text-2xl font-black text-black uppercase sm:text-2xl lg:text-4xl">
              {event.name}
            </h1>
            <div className="flex gap-1">
              {event.total_prize && event.total_prize != "NA" && (
                <span className="bg-primary font-nunito clip-path-ticket flex items-center gap-1 border-2 border-black px-2 py-1 text-[10px] font-bold lg:text-xs">
                  <Trophy size={12} />
                  {event.total_prize &&
                    event.total_prize !== "NA" &&
                    event.total_prize !== "TBD" &&
                    Number(event.total_prize).toLocaleString("en-IN")}
                  {event.total_prize &&
                    !Number(event.total_prize) &&
                    event.total_prize}
                  {!event.total_prize && <>NA</>}
                </span>
              )}
              <span
                className={`bg-chart-2 font-nunito clip-path-ticket flex items-center gap-1 border-2 border-black px-2 py-1 text-[10px] font-bold lg:text-xs`}
              >
                <IndianRupee size={12} strokeWidth={3} />
                {event.price_per_ticket === 0
                  ? "FREE"
                  : Number(event.price_per_ticket).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <p className="font-nunito mt-1 truncate text-sm font-bold tracking-wider text-gray-600 uppercase">
              {event.club}
            </p>
          </div>
        </div>

        <div className="h-0.5 w-full bg-black" />

        <div className="flex-1 p-4">
          <div className="font-nunito line-clamp-3 text-sm leading-relaxed font-medium text-black">
            <Markdown>{event.description}</Markdown>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t-2 border-black text-[11px] font-bold tracking-wide uppercase lg:grid-cols-4">
          <div className="font-bebas-rounded flex items-center justify-center gap-2 border-r-2 border-b-2 border-black p-3 text-lg lg:border-b-0 lg:text-sm xl:text-lg">
            <Clock size={20} className="text-primary" />
            {new Date(event.start_date).getFullYear() === 2030 ? (
              "TBA"
            ) : (
              <>
                {new Date(event.start_date).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                -{" "}
                {new Date(event.end_date).toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </>
            )}
          </div>

          <div className="font-bebas-rounded flex items-center justify-center gap-2 border-b-2 border-black p-3 text-lg lg:border-r-2 lg:border-b-0 lg:text-sm xl:text-lg">
            <Calendar size={20} className="text-primary" />
            {new Date(event.start_date).getFullYear() === 2030 ? (
              "TBA"
            ) : (
              <>
                {new Date(event.start_date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}{" "}
                -{" "}
                {new Date(event.end_date).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                })}
              </>
            )}
          </div>

          <div className="font-bebas-rounded flex items-center justify-center gap-2 truncate border-r-2 border-black p-3 text-lg lg:text-sm xl:text-lg">
            <Users size={20} className="text-primary" />
            {event.team_size}
          </div>

          <div className="font-bebas-rounded flex items-center justify-center gap-2 p-3 text-lg lg:text-sm xl:text-lg">
            <Shapes size={20} className="text-primary" />
            {event.category.toUpperCase().replace("_", " ")}
          </div>

          {/* <div className="font-bebas-rounded flex items-center justify-center gap-2 p-3 text-lg lg:text-sm xl:text-lg">
            <Trophy size={20} className="text-primary" />
            {event.total_prize &&
              event.total_prize !== "NA" &&
              event.total_prize !== "TBD" &&
              Number(event.total_prize).toLocaleString("en-IN")}
            {event.total_prize &&
              !Number(event.total_prize) &&
              event.total_prize}
            {!event.total_prize && <>NA</>}
          </div> */}
        </div>
      </div>
    </Link>
  )
}

export default EventCard
