"use client"

import React, { useState, useEffect } from "react"
import { X, ChevronRight } from "lucide-react"
import Screen1 from "./Screen1"
import Screen2 from "./Screen2"
import Screen3 from "./Screen3"
import Screen4 from "./Screen4"
import { useLenis } from "@/hooks/useLenis"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [currentScreen, setCurrentScreen] = useState(0)
  const lenis = useLenis()

  useEffect(() => {
    if (isOpen) {
      setCurrentScreen(0)
    }
  }, [isOpen])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.documentElement.style.overflowY = "hidden"
      document.body.style.overflowY = "hidden"
      lenis.stop()
    } else {
      document.documentElement.style.overflowY = "unset"
      document.body.style.overflowY = "unset"
      lenis.start()
    }
    return () => {
      document.documentElement.style.overflowY = "unset"
      document.body.style.overflowY = "unset"
      lenis.start()
    }
  }, [isOpen, lenis])

  const screens = [
    <Screen1 key="screen-1" />,
    <Screen2 key="screen-2" />,
    <Screen3
      key="screen-3"
      isSignedIn={() => setCurrentScreen((prev) => prev + 1)}
    />,
    <Screen4 key="screen-4" />,
  ]

  const handleNext = () => {
    if (currentScreen < screens.length - 1) {
      setCurrentScreen(currentScreen + 1)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-foreground border-background relative max-h-[90vh] w-[90%] overflow-hidden rounded-lg border-2 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="hover:bg-background/10 absolute top-4 right-4 z-10 rounded-full p-2 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6 text-white" />
        </button>

        {/* Modal Content */}
        <div className="flex h-[90vh] min-h-[90vh] flex-col p-8 sm:p-12 md:p-16">
          {/* Navigation */}
          <div className="mt-8 flex h-full items-center justify-between">
            {screens[currentScreen]}

            <button
              onClick={handleNext}
              disabled={
                currentScreen === screens.length - 1 || currentScreen === 2
              }
              className={`font-bebas bg-foreground text-background border-foreground absolute top-7/8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-lg border px-4 py-2 text-xl transition-all sm:top-3/4 ${
                currentScreen === screens.length - 1
                  ? "hidden opacity-0"
                  : "hover:border-background cursor-pointer"
              }`}
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal
