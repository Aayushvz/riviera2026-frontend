"use client"

import React, { useEffect } from "react"
import { GripHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { ReactQRCode } from "@lglab/react-qr-code"
import { useLenis } from "@/hooks/useLenis"
import gsap from "gsap"
import { Draggable } from "gsap/all"

interface DialogBoxProps {
  isOpen: boolean
  draggable?: boolean
  isBGBlurred?: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  shadowColor?: string
  className?: string
}

export const DialogBox: React.FC<DialogBoxProps> = ({
  isOpen,
  isBGBlurred = true,
  draggable = false,
  onClose,
  title,
  children,
  shadowColor = "#FE54F8",
  className,
}) => {
  const lenis = useLenis()
  const dialogRef = React.useRef<HTMLDivElement>(null)

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

  React.useEffect(() => {
    if (!isOpen || !draggable || !dialogRef.current) return

    gsap.registerPlugin(Draggable)

    const draggableInstance = Draggable.create(dialogRef.current, {
      type: "x,y",
      trigger: dialogRef.current.querySelector(".drag-handle"),
      bounds: "body",
      edgeResistance: 0.01,
    })

    return () => {
      if (draggableInstance && draggableInstance[0]) {
        draggableInstance[0].kill()
      }
    }
  }, [isOpen, draggable])

  if (!isOpen) return null

  return (
    <div className={`relative z-100 overflow-hidden ${draggable ? "dnd" : ""}`}>
      {/* Backdrop */}
      {!draggable && (
        <div
          className={`fixed inset-0 ${isBGBlurred ? "bg-black/50 backdrop-blur-sm transition-opacity" : "backdrop-blur-none"}`}
          onClick={onClose}
        />
      )}

      {/* Dialog */}
      <div
        className={`inset-0 z-[51] flex h-screen w-full items-center justify-center p-4 *:fixed`}
      >
        <div
          ref={dialogRef}
          className="relative w-fit min-w-sm md:max-w-96"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Shadow box - pink/magenta on right and bottom */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              backgroundColor: shadowColor,
              transform: "translate(6px, 6px)",
            }}
          />

          {/* Main dialog */}
          <div
            className={cn(
              "relative z-10 w-fit min-w-sm overflow-hidden rounded-lg border-[3px] border-black bg-white md:max-w-96",
              className,
            )}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between border-r-0 border-b-2 border-black bg-white ${draggable ? "drag-handle cursor-move" : ""}`}
            >
              <div className="flex items-center gap-4 px-6">
                {draggable ? <GripHorizontal /> : null}
                <h2 className="font-bebas-rounded text-3xl leading-relaxed font-bold tracking-wider uppercase">
                  {title}
                </h2>
              </div>
              <div
                className="h-full border-l-2 border-black px-4 py-4"
                onClick={onClose}
              >
                <button
                  className="flex flex-shrink-0 items-center justify-center bg-white transition-all hover:bg-gray-100"
                  aria-label="Close dialog"
                >
                  <X className="h-6 w-6 stroke-[3]" strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex justify-center px-6 py-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DialogTriggerProps {
  children: React.ReactNode
  onClick: () => void
  className?: string
}

export const DialogTrigger: React.FC<DialogTriggerProps> = ({
  children,
  onClick,
  className,
}) => {
  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  )
}

// Example usage component for QR code share dialog
interface ShareDialogProps {
  isOpen: boolean
  className?: string
  onClose: () => void
  shareUrl: string
  type: "merch" | "event"
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  isOpen,
  className,
  onClose,
  shareUrl,
  type,
}) => {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  React.useEffect(() => {
    if (!isOpen) {
      setCopied(false)
    }
  }, [isOpen])

  return (
    <DialogBox
      draggable={false}
      isBGBlurred={true}
      //   className="!backdrop-blur-none"
      isOpen={isOpen}
      onClose={onClose}
      title={`Share The ${type === "merch" ? "Merch" : "Event"}`}
      shadowColor="#FE54F8"
    >
      <div className="pointer-events-auto z-100 flex w-fit flex-col items-center gap-8">
        {/* QR Code */}
        <div className="border-[3px] border-black bg-white p-2">
          <ReactQRCode
            finderPatternInnerSettings={{
              style: "outpoint-sm",
            }}
            finderPatternOuterSettings={{
              style: "outpoint-sm",
            }}
            size={200}
            boostLevel={true}
            dataModulesSettings={{
              style: "leaf",
            }}
            minVersion={1}
            level="Q"
            imageSettings={{
              src: "/logos/riviera-qr-logo.png",
              height: 40,
              width: 40,
              excavate: true,
            }}
            value={shareUrl}
          />
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="relative inline-block w-fit max-w-xs min-w-56"
        >
          <div
            className="absolute inset-0 border-[3px] border-black bg-black"
            style={{ transform: "translate(5px, 5px)" }}
          />
          <div className="font-bebas-rounded relative z-10 flex items-center justify-center gap-2 border-[3px] border-black bg-[#FE54F8] px-8 py-3.5 text-xl font-bold tracking-wide text-black uppercase transition-all hover:bg-[#e600e6] active:translate-x-[5px] active:translate-y-[5px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
            {copied ? "Copied!" : "Click to Copy"}
          </div>
        </button>
      </div>
    </DialogBox>
  )
}
