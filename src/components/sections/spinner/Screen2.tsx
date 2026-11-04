"use client"

import React, { useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { X } from "lucide-react"
import Markdown from "react-markdown"

const FAQs = [
  {
    question: "Who can spin the wheel?",
    answer:
      "Only internal participants are eligible to spin the wheel. External participants are not allowed to participate in this activity.",
  },
  {
    question: "What happens if I win a prize?",
    answer:
      "If you win a prize, you must go to the Sales Room and show your winning result to collect your prize. Prizes will not be distributed anywhere else.",
  },
  {
    question: "How many spins does each participant get?",
    answer:
      "Each participant gets a total of 3 spins. Once all spins are used, you will not be able to spin the wheel again.",
  },
]

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const container = useRef<HTMLDivElement | null>(null)
  const FAQRef = useRef<HTMLDivElement | null>(null)

  const handleToggle = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null)
    } else {
      setOpenIndex(index)
    }
  }

  return (
    <>
      <div ref={container} className="h-full w-full">
        <div
          ref={FAQRef}
          className="relative z-20 w-full bg-transparent lg:px-8"
        >
          <div className="flex w-full justify-end">
            <h1 className="font-bebas-rounded text-9xl text-white">RULES</h1>
          </div>
          {FAQs.map((faq, index) => (
            <FAQItem
              key={index}
              item={faq}
              index={index}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </>
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
      id={`faq-item-${index}`}
      className={`font-nunito relative my-2 w-full text-white hover:text-black`}
    >
      <div
        className={`group flex w-full cursor-pointer items-stretch gap-1 px-3 transition-all duration-500 ease-in-out sm:px-4 lg:px-0 xl:hover:px-5 ${
          isOpen ? "border-b-black xl:px-5" : ""
        }`}
        onClick={onClick}
      >
        <div className="flex w-3 items-center justify-center border border-white sm:w-4 lg:w-5">
          <div
            className={`h-0 w-full bg-[#EA15FF] transition-all duration-300 ease-in-out group-hover:h-full ${
              isOpen ? "h-full" : ""
            }`}
          />
        </div>

        <div className="relative flex w-full items-center overflow-hidden border border-white px-3 py-4 sm:px-4 sm:py-5 lg:px-4 lg:py-6">
          <div
            className={`absolute inset-0 z-0 origin-center scale-y-0 transform bg-white transition-transform duration-300 ease-in-out group-hover:scale-y-100 ${
              isOpen ? "scale-y-100" : ""
            }`}
          />
          <h1
            className={`relative z-10 text-xl leading-tight sm:text-2xl lg:text-2xl ${
              isOpen ? "border-b-black text-black" : ""
            }`}
          >
            {item.question}
          </h1>
        </div>

        <div className="relative flex items-center justify-center border border-white px-3 sm:px-4 lg:px-6">
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
          <h1
            className={`relative text-lg font-bold sm:text-xl lg:text-5xl ${
              isOpen ? "" : ""
            } transition-opacity duration-500 ease-in-out`}
          >
            #{String(index + 1).padStart(2, "0")}
          </h1>
        </div>
      </div>

      <div
        ref={answerRef}
        className={`overflow-hidden px-3 transition-all duration-500 sm:px-4 lg:px-0 xl:px-5 xl:hover:px-5`}
        style={{ height: 0 }}
      >
        <div className="border border-t-0 border-white bg-white px-4 py-4 text-black sm:px-6 sm:py-5 sm:text-lg lg:px-10 lg:py-6 lg:text-3xl">
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
