"use client"

import React, { useEffect, useState } from "react"
import { Accordion } from "./accordion"
import Suggested from "./suggested"
import Markdown from "react-markdown"
import { SlotsTable } from "./slots-table"
import { EventHeader } from "./events-head"
import Navigation from "@/components/navigation"
import { EventsResponse, Event } from "@/app/types/eventList"
import { EventDetail } from "@/app/types/eventDetail"

interface Props {
  id: string
  type: "internal" | "external"
  eventData?: EventDetail
}

export default function EventsView({ id, type, eventData }: Props) {
  const [eventsData, setEventsData] = useState<Event[] | null>(null)

  useEffect(() => {
    if (!eventData?.category) return

    const fetchEvents = async () => {
      try {
        const res = await fetch(
          `/api/events?category=${eventData.category}&type=${type}`,
        )

        if (!res.ok) {
          console.error("Failed to fetch events:", res.statusText)
          return
        }

        const json: EventsResponse = await res.json()
        let filteredEvents = json.events.filter(
          (event: Event) => event.pid !== id,
        )

        if (filteredEvents.length > 5) {
          filteredEvents = filteredEvents.slice(0, 5)
        }

        console.log(
          "Fetched events for category:",
          eventData.category,
          filteredEvents,
        )

        setEventsData(filteredEvents || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }

    fetchEvents()
  }, [eventData?.category])

  if (!eventData) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <div className="font-nunito bg-background relative w-full pt-24">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Navigation state="event" type={type} name={eventData.name} />

        <EventHeader
          name={eventData.name}
          description={eventData.short_description}
          club={eventData.club}
          image={eventData.image}
          price={eventData.price_per_ticket}
          isTeamEvent={eventData.is_a_team_event}
          slot_details={eventData.slot_details}
          prizes={eventData.prizes}
          number_of_participants={eventData.number_of_participants}
          points={eventData.points}
          eventId={id}
          type={eventData.event_type}
          is_registrable={eventData.is_registrable}
          price_per_team={eventData.price_per_team}
          category={eventData.category}
        />

        <SlotsTable slots={eventData.slot_details} />

        <Accordion title="Event Description" defaultOpen>
          <Markdown
            components={{
              img: ({ alt, src, title }) => (
                <img
                  src={src}
                  alt={alt}
                  title={title}
                  className="m-1 inline-block aspect-square w-64 first:ml-0 last:mr-0"
                  draggable={false}
                />
              ),
            }}
          >
            {eventData.description}
          </Markdown>
        </Accordion>

        {eventData.rules && (
          <Accordion title="Rules">
            <Markdown>{eventData.rules}</Markdown>
          </Accordion>
        )}

        {eventData.judgement_criteria &&
          eventData.judgement_criteria != "NA" && (
            <Accordion title="Judgement Criteria">
              <Markdown>{eventData.judgement_criteria}</Markdown>
            </Accordion>
          )}

        {eventsData && eventsData.length > 0 && (
          <Suggested events={eventsData} type={type} />
        )}
      </div>
    </div>
  )
}
