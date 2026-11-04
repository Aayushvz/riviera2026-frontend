import React from "react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About - Riviera 26",
  description:
    "Discover upcoming events at Riviera26. Stay updated with the latest happenings, workshops, and community gatherings in our vibrant space.",
}

const EventsPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-10 flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="relative h-full w-full overflow-hidden">
            <div className="strip-col border-background/20 bg-foreground h-full w-full border-r"></div>
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute inset-0 z-20 flex h-full items-center justify-center mix-blend-difference">
        <div className="font-nunito text-background text-center text-[15vw] leading-none font-bold uppercase sm:text-[10vw]">
          Coming Soon
        </div>
      </div>
    </div>
  )
}

export default EventsPage
