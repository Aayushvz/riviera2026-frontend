import React from "react"
import Link from "next/link"
import type { Event } from "@/app/types/eventList"

// icons
import { Clock, Calendar, Users, IndianRupee } from "lucide-react"

const EventList = ({ events }: { events: Event[] }) => {
  return (
    <div className="overflow-x-auto shadow-[4.68px_5.46px_0px_0px_#000000]">
      {/* This wrapper scrolls horizontally */}
      <div className="w-full min-w-[1000px]">
        {/* TABLE HEADER */}
        <div className="grid h-fit w-full grid-cols-7 divide-x-2 divide-black border-2 border-black">
          <div className="bg-primary font-bebas-rounded col-span-3 py-1 pl-4 text-left text-3xl text-white">
            Event Name
          </div>
          <div className="bg-primary font-bebas-rounded col-span-1 flex items-center justify-center gap-2 py-1 text-center text-2xl text-white">
            <Clock className="inline-block" /> Time
          </div>
          <div className="bg-primary font-bebas-rounded col-span-1 flex items-center justify-center gap-2 py-1 text-center text-2xl text-white">
            <Calendar className="inline-block" /> Date
          </div>
          <div className="bg-primary font-bebas-rounded col-span-1 flex items-center justify-center gap-2 py-1 text-center text-2xl text-white">
            <Users className="inline-block" /> Team Size
          </div>
          <div className="bg-primary font-bebas-rounded col-span-1 flex items-center justify-center gap-2 py-1 text-center text-2xl text-white">
            <IndianRupee className="inline-block" /> Price
          </div>
        </div>

        {/* TABLE ROWS */}
        {events.map((event) => (
          <Link
            href={`/events/${event.pid}`}
            key={event.pid}
            className="grid h-fit w-full grid-cols-7 divide-x-2 divide-black border-2 border-t-0 border-black bg-white transition-colors duration-200 hover:bg-gray-200"
          >
            {/* EVENT NAME */}
            <div className="font-bebas-rounded col-span-3 flex items-end gap-2 pl-4 text-left text-2xl text-black lg:text-3xl">
              {event.name}
              <span className="text-sm text-gray-500">{event.club}</span>
            </div>

            <div className="text-md font-bebas-rounded col-span-1 flex items-center justify-center gap-1 py-1 text-center text-lg text-black lg:text-2xl">
              {/* <Clock className="text-chart-6 inline-block w-4" /> */}
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

            <div className="text-md font-bebas-rounded col-span-1 flex items-center justify-center gap-2 py-1 text-center text-lg text-black lg:text-2xl">
              {/* <Calendar className="text-chart-6 inline-block w-4" /> */}
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

            <div className="text-md font-bebas-rounded col-span-1 flex items-center justify-center gap-2 py-1 text-center text-lg text-black lg:text-2xl">
              {/* <Users className="text-chart-6 inline-block w-4" /> */}
              {event.team_size}{" "}
              {Number(event.team_size) === 1 ? "member" : "members"}
            </div>

            <div className="text-md font-bebas-rounded col-span-1 flex items-center justify-center gap-2 py-1 text-center text-lg text-black lg:text-2xl">
              {/* <IndianRupee className="text-chart-6 inline-block w-4" /> */}
              {event.price_per_ticket === 0
                ? "FREE"
                : Number(event.price_per_ticket).toLocaleString("en-IN")}{" "}
              {event.price_per_team ? "/team" : ""}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default EventList
