import AnnouncementCard from "@/components/sections/announcements/announcement-card"
import { announcements } from "./data"
import { Suspense } from "react"

const AnnouncementsPage = () => {
  return (
    <Suspense fallback={null}>
      <div className="bg-background flex min-h-screen flex-col items-center justify-center bg-[url('/assets/team/riv-grid.svg')] bg-contain px-8 pt-32 pb-8">
        <div className="flex h-full w-full max-w-360 flex-wrap justify-center gap-10 md:gap-14 lg:gap-18">
          {announcements.map((announcement, index) => (
            <AnnouncementCard key={index} announcement={announcement} />
          ))}
        </div>
      </div>
    </Suspense>
  )
}

export default AnnouncementsPage
