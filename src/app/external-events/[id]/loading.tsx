import { EventSkeleton } from "@/components/sections/event-details/skeleton"

export default function Loading() {
  return (
    <div className="relative w-full pt-24">
      <EventSkeleton />
    </div>
  )
}
