"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Carousel } from "@/components/ui/carouselUI"
import { Modal } from "@/components/ui/modal"
import Markdown from "react-markdown"
import { useLenis } from "@/hooks/useLenis"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface Media {
  type: "image" | "video" | "pdf"
  url: string
  thumbnailUrl?: string
}

interface Announcement {
  id: string
  date: string
  content: string
  media: Media[]
}

interface AnnouncementCardProps {
  announcement: Announcement
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const lenis = useLenis()

  const [isModalOpen, setIsModalOpen] = useState(false)

  const announcementId = announcement.id
  const paramId = searchParams.get("announcement")

  useEffect(() => {
    if (paramId === announcementId) {
      setIsModalOpen(true)
    } else {
      setIsModalOpen(false)
    }
  }, [paramId, announcementId])

  useEffect(() => {
    if (isModalOpen) {
      lenis.stop()
      document.documentElement.style.overflowY = "hidden"
    } else {
      lenis.start()
      document.documentElement.style.overflowY = "unset"
    }
  }, [isModalOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAnnouncement()
      }
    }

    if (isModalOpen) {
      window.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isModalOpen, searchParams])

  if (!announcement?.media?.length) return null

  const hasMultipleMedia =
    announcement.media.length > 1 ||
    announcement.media[0].type === "video" ||
    announcement.media[0].type === "pdf"

  const getThumbnailUrl = (media: Media) => {
    if (media.type === "video" || media.type === "pdf") {
      return media.thumbnailUrl || "/placeholder.svg"
    }
    return media.url
  }

  const openAnnouncement = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("announcement", announcementId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const closeAnnouncement = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("announcement")
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <>
      <div
        className="w-full max-w-sm border-2 border-black bg-white shadow-[6px_6px_0_0_#000] transition-all duration-300 hover:translate-x-1.5 hover:translate-y-1.5 hover:shadow-none"
        onClick={openAnnouncement}
        style={{ cursor: hasMultipleMedia ? "pointer" : "default" }}
      >
        <div className="flex border-b-2 border-black bg-white">
          <div className="border-r-2 border-black px-3 py-1 font-bold text-black">
            {announcement.date}
          </div>
          <div className="truncate px-3 py-1 font-bold text-black">
            Announcement
          </div>
        </div>

        <div className="relative aspect-[1080/1350] w-full border-b-2 border-black">
          <Image
            src={getThumbnailUrl(announcement.media[0])}
            alt={announcement.content}
            fill
            className="object-cover object-center"
          />

          {announcement.media.length > 1 && (
            <div className="absolute top-2 right-2 rounded-full bg-black px-3 py-1 text-xs font-bold text-white">
              +{announcement.media.length - 1}
            </div>
          )}
        </div>

        <div className="p-6">
          <p className="line-clamp-3 text-sm leading-relaxed text-black">
            <Markdown
              components={{
                p: ({ children }) => <p className="mb-4">{children}</p>,
                ol: ({ children }) => (
                  <ol className="mb-4 ml-6 list-decimal space-y-2">
                    {children}
                  </ol>
                ),
                ul: ({ children }) => (
                  <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
                ),
                li: ({ children }) => <li className="mb-1">{children}</li>,
                a: ({ children, href }) => (
                  <a
                    href={href}
                    className="text-primary underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {announcement.content}
            </Markdown>
          </p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeAnnouncement}>
        <Carousel media={announcement.media} content={announcement.content} />
      </Modal>
    </>
  )
}

export default AnnouncementCard
