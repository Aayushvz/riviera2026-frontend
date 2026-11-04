"use client"

import { ActionButtonProps } from "@/app/types/props"
import React from "react"
import { useRive, Layout, Fit, Alignment } from "@rive-app/react-canvas"

export default function ActionButton({
  className,
  onClick,
  riveFile,
  playAction = true,
}: ActionButtonProps) {
  const { RiveComponent } = useRive({
    src: riveFile || "/assets/hero/action/button-animation.riv",
    layout: new Layout({
      fit: Fit.FitWidth,
      alignment: Alignment.Center,
    }),
    autoplay: playAction,
  })

  return (
    <div
      className={`relative h-[50px] w-[120px] cursor-pointer *:transition-transform *:hover:scale-105 *:active:scale-100 sm:h-[60px] sm:w-[160px] md:h-[70px] md:w-[180px] ${className}`}
      onClick={onClick}
    >
      <RiveComponent />
    </div>
  )
}
