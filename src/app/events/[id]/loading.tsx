import { EventSkeleton } from "@/components/sections/event-details/skeleton"

export default function Loading() {
  return (
    <div className="bg-background h-screen w-full pt-30">
      <EventSkeleton />
    </div>
  )
}
