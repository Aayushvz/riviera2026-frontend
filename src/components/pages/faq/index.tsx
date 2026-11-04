"use client"

import React, { useRef, useEffect, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { X } from "lucide-react"
import Markdown from "react-markdown"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import scrollToSection from "@/lib/scroll-to-section"

const FAQs = [
  {
    id: "CoaVRM",
    question:
      "Are there accommodation facilities available for outstation participants?",
    answer:
      "Yes, accommodation is provided for outstation participants in VIT hostels on a paid and first come first served basis. The cost will be minimal, exclusive of breakfast and lunch served in the regular hostel mess.",
  },
  {
    id: "E9cZoD",
    question:
      "Is transportation provided to and from the venue, or should attendees arrange their own transportation?",
    answer:
      "No, VIT does not provide transportation. Attendees are required to make their own transportation arrangements.",
  },
  {
    id: "ZJE8wP",
    question: "What is required for identity verification at the event?",
    answer: `Check-in Guidelines for External Participants
All external participants must check in at the RnR External Desk upon arrival. It is mandatory to bring the following documents in hard copy for verification:

Required Documents:

- **NOC (No Objection Certificate)** from your institution signed by the dean/principal/director.
- **Copy of Aadhar Card** (or any valid government-issued ID).
- **Payment Receipt (Invoice)** as proof of successful registration.
- **College ID Card** for identity verification.
- **Accommodation Payment Receipt** (if accommodation is required).
- **Additional Notes:**
Faculty members, coaches, or students accompanying participants for events who require assistance must also carry their College ID Card and, if applicable, their Accommodation Payment Receipt.

Participants from all colleges, including other VIT campuses (except Vellore campus), must carry all the above-mentioned documents in hard copy.

Ensure you have these documents ready to avoid any inconvenience during check-in.
    `,
  },
  {
    id: "jzPNEy",
    question: "How many teams can a college send for the events?",
    answer: "Each college is permitted to send only one team per event.",
  },
  {
    id: "tyKZUZ",
    question: "Is there a provision for on-spot registrations for events?",
    answer:
      "Registration for events is exclusively through the official Riviera website, and on-spot registrations will not be available.",
  },
  {
    id: "n80HW1",
    question: "Who is eligible to participate in the events?",
    answer:
      "Only college students with valid identification cards are allowed to participate in the events.",
  },
  {
    id: "OeoNLn",
    question: "How does the rolling trophy and ranking system work?",
    answer: `Riviera Rolling Trophy
The most prestigious award of Riviera, recognizing the collective excellence of participating colleges across a variety of cultural, literary, artistic, and musical events. This coveted trophy symbolizes teamwork, versatility, and exceptional talent displayed during the festival.

Eligibility and Highlights:
1. Participation Criteria:
A team must participate in a minimum of 15 out of 25 events listed in the competition lineup.
Events span categories such as Quiz, Informal Activities, Art/Drama, and Music, offering a platform for all kinds of talents.
A team must participate in at least one event from each category: Quiz, Informal, Art & Drama, and Music.
2. Scoring System:
Points are awarded for 1st, 2nd, and 3rd positions in each event, with varying weightage depending on the event's significance.
Total points determine the winning team, encouraging participants to perform consistently across multiple events.
3. Category Balance:
To promote balanced representation, teams are required to participate in events across all categories, showcasing their versatility.
4. Competition Spirit:
The Rolling Trophy is a celebration of camaraderie, creativity, and competition, fostering an environment where participants push their limits and inspire others.
Why Compete?
Winning the Riviera Rolling Trophy is not just about points—it's about earning the distinction of being the most versatile and talented team in one of India's largest and most vibrant cultural fests. Competing teams will create memories, forge friendships, and leave a lasting mark in Riviera’s history.

Gear up and compete for glory—claim the Rolling Trophy and etch your name among the legends of Riviera!`,
  },
  {
    id: "ohmFXt",
    question:
      "What should participants do if they face any issues or have additional queries?",
    answer: `Participants who face issues or have queries related to events, proshows, registration, payments, or any other concerns are requested to submit their details through the official Riviera Enquiry Form for further assistance.
[Riviera Enquiry Form](https://forms.gle/6PSgfNxxtiV75sG59)`,
  },
]

const FAQSection = () => {
  const [openId, setOpenId] = useState<string | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const container = useRef<HTMLDivElement | null>(null)
  const FAQRef = useRef<HTMLDivElement | null>(null)

  // READ ID FROM URL AND OPEN + SCROLL
  useEffect(() => {
    const questionId = searchParams.get("question")

    if (questionId) {
      const exists = FAQs.some((faq) => faq.id === questionId)

      if (exists) {
        setOpenId(questionId)
        scrollToSection(`faq-item-${questionId}`, 200)
      }
    } else {
      setOpenId(null)
    }
  }, [searchParams])

  // TOGGLE HANDLER (USES ID)
  const handleToggle = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (openId === id) {
      setOpenId(null)
      params.delete("question")
    } else {
      setOpenId(id)
      params.set("question", id)
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div
      ref={container}
      className="bg-background relative min-h-screen w-full bg-[url('/assets/team/riv-grid.svg')] pt-60 pb-10"
    >
      <div ref={FAQRef} className="bg-background relative z-20 w-full lg:px-8">
        {FAQs.map((faq, index) => (
          <FAQItem
            key={faq.id}
            item={faq}
            index={index}
            isOpen={openId === faq.id}
            onClick={() => handleToggle(faq.id)}
          />
        ))}
      </div>
    </div>
  )
}

const FAQItem = ({
  item,
  isOpen,
  onClick,
  index,
}: {
  item: (typeof FAQs)[0]
  isOpen: boolean
  onClick: () => void
  index: number
}) => {
  const answerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (answerRef.current) {
        if (isOpen) {
          const height = answerRef.current.scrollHeight
          gsap.to(answerRef.current, {
            height: height,
            duration: 0.01,
            ease: "power1.inOut",
          })
        } else {
          gsap.to(answerRef.current, {
            height: 0,
            duration: 0.01,
            ease: "power1.inOut",
          })
        }
      }
    },
    { scope: answerRef, dependencies: [isOpen] },
  )

  return (
    <div
      id={`faq-item-${item.id}`}
      className="font-nunito bg-background relative my-2 w-full"
    >
      <div
        className={`group flex w-full cursor-pointer items-stretch gap-1 px-3 transition-all duration-500 ease-in-out sm:px-4 lg:px-0 xl:hover:px-5 ${
          isOpen ? "xl:px-5" : ""
        }`}
        onClick={onClick}
      >
        <div className="border-foreground flex w-3 items-center justify-center border sm:w-4 lg:w-5">
          <div
            className={`h-0 w-full bg-[#EA15FF] transition-all duration-300 ease-in-out group-hover:h-full ${
              isOpen ? "h-full" : ""
            }`}
          />
        </div>

        <div className="border-foreground relative flex w-full items-center overflow-hidden border px-3 py-4 sm:px-4 sm:py-5 lg:px-4 lg:py-6">
          <div
            className={`absolute inset-0 z-0 origin-center scale-y-0 transform bg-white transition-transform duration-300 ease-in-out group-hover:scale-y-100 ${
              isOpen ? "scale-y-100" : ""
            }`}
          />
          <h1 className="relative z-10 text-xl leading-tight sm:text-2xl lg:text-4xl">
            {item.question}
          </h1>
        </div>

        <div className="border-foreground relative flex items-center justify-center border px-3 sm:px-4 lg:px-6">
          <div
            className={`bg-foreground pointer-events-none absolute inset-0 z-20 flex items-center justify-center text-white transition-all duration-500 ease-in-out ${
              isOpen ? "left-0" : "left-100"
            } `}
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-8 lg:w-8 xl:h-10 xl:w-10" />
          </div>

          <div
            className={`absolute inset-0 z-0 origin-center scale-y-0 transform bg-white transition-transform duration-300 ease-in-out group-hover:scale-y-100 ${
              isOpen ? "scale-y-100" : ""
            }`}
          />

          <h1 className="relative text-lg font-bold transition-opacity duration-500 ease-in-out sm:text-xl lg:text-5xl">
            #{String(index + 1).padStart(2, "0")}
          </h1>
        </div>
      </div>

      <div
        ref={answerRef}
        className={`overflow-hidden px-3 transition-all duration-500 sm:px-4 lg:px-0 xl:px-5 xl:hover:px-5`}
        style={{ height: 0 }}
      >
        <div className="border-foreground border border-t-0 bg-white px-4 py-4 text-base sm:px-6 sm:py-5 sm:text-lg lg:px-10 lg:py-6 lg:text-3xl">
          <h2 className="max-w-full lg:max-w-[80%]">
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
                h1: ({ children }) => (
                  <h1 className="mt-4 mb-3 text-2xl font-bold">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="mt-4 mb-3 text-xl font-bold">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="mt-3 mb-2 text-lg font-bold">{children}</h3>
                ),
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
              {item.answer}
            </Markdown>
          </h2>
        </div>
      </div>
    </div>
  )
}

export default FAQSection
