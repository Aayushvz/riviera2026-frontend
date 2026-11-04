import React, { useEffect } from "react"
import { DialogBox } from "./dialog-box"
import { FancyButton } from "./fancy-button"
import Link from "next/link"
import { useLenis } from "@/hooks/useLenis"

const MerchDialog = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) => {
  const lenis = useLenis()

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

  if (!isOpen) return null
  return (
    <DialogBox
      isOpen={isOpen}
      onClose={onClose}
      title={`Participant Type`}
      shadowColor="#FE54F8"
    >
      <div className="flex h-fit w-full flex-col items-center justify-center gap-4 sm:flex-row">
        <Link href={"https://web.vit.ac.in/riviera"} target="_blank">
          <FancyButton>External</FancyButton>
        </Link>
        <Link href={"https://web.vit.ac.in/rivierainternal"} target="_blank">
          <FancyButton>Internal</FancyButton>
        </Link>
      </div>
    </DialogBox>
  )
}

export default MerchDialog
