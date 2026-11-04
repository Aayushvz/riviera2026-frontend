import { Metadata } from "next"
import { getEventByIdServer } from "@/lib/api"
import { Suspense } from "react"
import EventsView from "@/components/sections/event-details/events-view"
import notFound from "@/app/not-found"

interface EventPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  try {
    const eventData = await getEventByIdServer((await params).id)

    if (!eventData) {
      throw new Error("Event not found")
    }

    return {
      title: `${eventData.name} | ${eventData.club}`,
      description:
        eventData.short_description || eventData.description.substring(0, 160),
      openGraph: {
        title: eventData.name,
        description:
          eventData.short_description ||
          eventData.description.substring(0, 160),
        images: [eventData.image],
        type: "website",
      },
    }
  } catch (err) {
    console.log(err)
    return {
      title: "Event Not Found",
      description: "The requested event could not be found.",
    }
  }
}

export default async function EventPage({ params }: EventPageProps) {
  let eventData

  try {
    eventData = await getEventByIdServer((await params).id)
  } catch (error) {
    console.error("Error fetching event:", error)
    notFound()
  }
  return (
    <Suspense fallback={null}>
      <EventsView
        id={(await params).id}
        type="external"
        eventData={eventData}
      />
    </Suspense>
  )
}

export const dynamic = "force-dynamic"
