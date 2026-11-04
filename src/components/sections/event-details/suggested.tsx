import { EventDetail } from "@/app/types/eventDetail"
import { Event } from "@/app/types/eventList"
import { Button } from "@/components/ui/button"
import {
  CarouselContent,
  Carousel,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { sendGAEvent } from "@next/third-parties/google"
import { IndianRupee } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

export default function Suggested({
  events,
  type,
}: {
  events: Event[]
  type?: "internal" | "external"
}) {
  const basePath = type === "internal" ? "/events" : "/external-events"
  const redirectCategory = () => {
    window.open(`${basePath}?category=${events[0].category}`, "_blank")
  }

  return (
    <div className="my-8 flex flex-wrap gap-4">
      <Carousel
        opts={{
          align: "center",
          containScroll: "trimSnaps",
          slidesToScroll: 1,
          skipSnaps: false,
          axis: "x",
          dragFree: true,
          breakpoints: {
            640: {
              slidesToScroll: 1,
            },
            1024: {
              slidesToScroll: 3,
            },
          },
        }}
        className="w-full"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bebas-rounded mb-6 text-2xl font-bold uppercase sm:text-3xl">
            Suggested Events
          </h2>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="font-bebas-rounded text-md mb-7 rounded-full border-2 border-gray-500 uppercase hover:bg-gray-100"
              onClick={redirectCategory}
            >
              SEE MORE
            </Button>
            <div className="flex items-center gap-2">
              <CarouselPrevious className="static rounded-full border-2 border-gray-500" />
              <CarouselNext className="static rounded-full border-2 border-gray-500" />
            </div>
          </div>
        </div>

        <CarouselContent>
          {events.map((event: Event, id) => (
            <CarouselItem key={id} className="md:basis-1/2 lg:basis-1/3">
              <Link
                href={`${basePath}/${event.pid}`}
                onClick={() => {
                  sendGAEvent("event", "event_click", {
                    location: `suggested-events-${event.pid}`,
                  })
                }}
                target="_blank"
              >
                <div className="m-auto h-full w-full max-w-sm border-2 border-black bg-white font-sans shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow duration-200 hover:shadow-none">
                  <div>
                    <Image
                      src={event.image}
                      alt={event.name}
                      width={400}
                      height={300}
                      className="aspect-square w-full border-b border-black object-cover"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex w-3/4 flex-col items-start justify-center p-3">
                      <h2 className="font-bebas-rounded line-clamp-1 text-xl font-black text-black uppercase">
                        {event.name}
                      </h2>
                      <p className="mt line-clamp-1 text-sm text-gray-700">
                        {event.club}
                      </p>
                    </div>
                    <div className="flex w-1/4 items-start justify-center">
                      <span
                        className={`bg-chart-2 font-nunito clip-path-ticket flex w-fit items-center gap-1 border-2 border-black px-2 py-1 text-[10px] font-bold lg:text-xs`}
                      >
                        {Number(event.price_per_ticket).toLocaleString(
                          "en-IN",
                        ) !== "0" && <IndianRupee size={12} strokeWidth={3} />}
                        {Number(event.price_per_ticket).toLocaleString(
                          "en-IN",
                        ) === "0"
                          ? "FREE"
                          : Number(event.price_per_ticket).toLocaleString(
                              "en-IN",
                            )}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  )
}
