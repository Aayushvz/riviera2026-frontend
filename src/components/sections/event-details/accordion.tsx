"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronRight } from "lucide-react"

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  defaultOpen = false,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0,
  )
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      const contentEl = contentRef.current
      if (contentEl) {
        setHeight(contentEl.scrollHeight)
      }
    } else {
      setHeight(0)
    }
  }, [isOpen])

  return (
    <div className="border-t border-gray-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex w-full items-center justify-between py-5 text-left"
        aria-expanded={isOpen}
      >
        <h3 className="text-base font-normal text-gray-900">{title}</h3>
        <ChevronRight
          className={`h-4 w-4 text-gray-400 transition-transform duration-300 ease-in-out ${
            isOpen ? "rotate-90 transform" : ""
          }`}
        />
      </button>
      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div
          ref={contentRef}
          className="text-md pb-6 leading-relaxed text-gray-700"
        >
          {children}
        </div>
      </div>
    </div>
  )
}
