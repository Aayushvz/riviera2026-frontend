"use client"

import Image from "next/image"
import React, { useState } from "react"
import { EventDescription } from "./description"
import { EventStats } from "./stats"
import { SlotDetail } from "@/app/types/eventDetail"
import { FancyButton } from "@/components/ui/fancy-button"
import { ShareDialog } from "@/components/ui/dialog-box"
import { ShareIcon } from "lucide-react"
import Link from "next/link"

interface EventHeaderProps {
  name: string
  description?: string
  club: string
  image: string
  price: number
  isTeamEvent: boolean
  slot_details: SlotDetail[]
  number_of_participants: string
  eventId: string
  prizes: string
  points?: string
  type: string
  is_registrable: boolean
  price_per_team: boolean
  category: string
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  name,
  description,
  club,
  image,
  price,
  isTeamEvent,
  slot_details,
  prizes,
  number_of_participants,
  eventId,
  points,
  type,
  is_registrable,
  price_per_team,
  category,
}) => {
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)

  // Generate the event URL

  const basePath = type === "internal" ? "/events" : "/external-events"
  const eventUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_APP_URL}${basePath}/${eventId}`
  return (
    <>
      <div
        className={`body absolute top-0 left-0 h-screen w-screen bg-transparent ${!isShareDialogOpen ? "pointer-events-none" : ""}`}
      >
        <ShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          shareUrl={eventUrl}
          type="event"
        />
      </div>

      <div className="mb-6 flex flex-col gap-10 lg:max-h-96 lg:flex-row">
        {/* Event Image */}
        <div className="relative flex w-full items-center justify-center lg:w-[350px]">
          <div className="relative aspect-square w-[95%] bg-white md:w-full">
            <Image
              src={image}
              alt={name}
              fill
              sizes="230px"
              className="border border-black object-cover shadow-[8px_8px_0px_0px_#AD7CFF]"
              loading="eager"
              draggable={false}
              unoptimized
            />
          </div>
        </div>

        {/* Event Info */}
        <div className="flex flex-1 flex-col">
          <div className="font-nunito mb-6 flex items-start justify-between">
            <div>
              <h1 className="font-bebas-rounded text-4xl leading-tight font-semibold sm:text-5xl md:text-6xl">
                {name}
              </h1>
              <p className="text-gray-700">{club}</p>
            </div>
            <div className="flex gap-4">
              <FancyButton
                variant="blue"
                size="default"
                onClick={() => setIsShareDialogOpen(true)}
              >
                <ShareIcon className="size-5" />
              </FancyButton>
              <Link
                target={is_registrable ? `_blank` : undefined}
                href={
                  !is_registrable
                    ? ""
                    : type === "external"
                      ? "http://web.vit.ac.in/riviera"
                      : "http://web.vit.ac.in/rivierainternal"
                }
              >
                <FancyButton
                  disabled={!is_registrable}
                  variant="green"
                  size="default"
                  className="disabled:opacity-100"
                >
                  {is_registrable ? "Register" : "Registrations Closed"}
                </FancyButton>
              </Link>
            </div>
          </div>

          {/* Price */}
          <div className="font-nunito mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">₹ {price}</span>
              <span className="text-sm text-gray-600">
                ({price_per_team ? "per team" : "per person"})
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-500">inclusive of GST</p>
          </div>

          {description && <EventDescription description={description} />}
          <EventStats
            slotDetails={slot_details}
            numberOfParticipants={number_of_participants}
            prizes={prizes}
            category={category}
          />
        </div>
      </div>
    </>
  )
}
