"use client"
import { Merch, MerchDetailResponse } from "@/app/types/merch"
import { ShareDialog } from "@/components/ui/dialog-box"
import { FancyButton } from "@/components/ui/fancy-button"
import MerchDialog from "@/components/ui/merch-dialog"
import { ShareIcon } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"

const GroupButtonWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-4">{children}</div>
)

const GroupButton = ({
  text,
  active = false,
  onClick,
}: {
  text: string
  active?: boolean
  onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`font-bebas-rounded border-2 border-black px-6 py-3 text-lg transition-colors md:text-xl ${active ? "border-hero-accent" : "bg-white"}`}
  >
    {text}
  </button>
)

export default function MerchView({ pid }: { pid: string }) {
  const [merch, setMerch] = useState<Merch | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeLeft, setTimeLeft] = useState<string>("")
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const checkoutButtonRef = useRef<HTMLButtonElement>(null)
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false)
  const [isMerchDialogOpen, setIsMerchDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchMerch() {
      try {
        const response = await fetch(`/api/merchs/${pid}`)

        if (!response.ok) {
          setLoading(false)
          return
        }

        const data: MerchDetailResponse = await response.json()

        setMerch(data.merch)
      } catch (error) {
        console.error("Failed to fetch merch:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMerch()
  }, [pid])

  const handleCheckoutHover = () => {
    if (checkoutButtonRef.current) {
      gsap.to(checkoutButtonRef.current, {
        x: -2,
        y: 2,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  const handleCheckoutLeave = () => {
    if (checkoutButtonRef.current) {
      gsap.to(checkoutButtonRef.current, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  if (loading) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center">
        <h1 className="font-bebas-rounded text-4xl">Loading...</h1>
      </div>
    )
  }

  // Not found state
  if (!merch) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="font-bebas-rounded text-4xl">Product Not Found</h1>
      </div>
    )
  }

  // Parse sizes
  let sizes: string[] | string[][] = []
  if (merch.category === true && merch.size.includes("|")) {
    const arrys = merch.size.split("|").map((s) => s.trim())
    arrys.forEach((arr) => {
      const innerSizes = arr
        .split(":")
        .map((s) => s.split(",").map((ss) => ss.trim()))
        .flat()
      ;(sizes as string[][]).push(innerSizes)
    })
  } else {
    sizes = merch.size.split(",").map((s) => s.trim())
  }

  // Share Url
  const merchUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${process.env.NEXT_PUBLIC_APP_URL}/merch/${pid}`

  return (
    <div className="bg-background relative min-h-screen w-full bg-[url('/assets/events/patterns.svg')] bg-contain">
      <div className="absolute top-0 left-0 h-screen w-screen">
        <MerchDialog
          isOpen={isMerchDialogOpen}
          onClose={() => setIsMerchDialogOpen(false)}
        />
        <ShareDialog
          isOpen={isShareDialogOpen}
          onClose={() => setIsShareDialogOpen(false)}
          shareUrl={merchUrl}
          type="merch"
        />
      </div>
      {/* Main Container */}
      <div className="container mx-auto flex flex-col gap-8 px-4 pt-30 pb-12 md:px-8 md:pt-35 lg:flex-row lg:items-start lg:gap-12 lg:px-4 lg:pb-16">
        {/* Left: Product Image */}
        <div className="relative flex flex-col lg:w-5/12 lg:flex-shrink-0">
          {/* Timer Badge */}
          {merch.discount?.enabled && merch.discount.limited_to && (
            <div className="font-nunito bg-chart-2 absolute top-0 left-0 z-10 flex items-center gap-2 border-2 border-black px-4 py-2 text-sm font-medium text-black md:text-base">
              <span>OFFER FOR FIRST {merch.discount.limited_to} BUYERS</span>
            </div>
          )}

          {/* Image Container */}
          <div className="relative aspect-square w-full border-2 border-black bg-white">
            <Image
              src={merch.images[currentImageIndex]}
              alt={merch.merch_name}
              width={1000}
              height={1000}
              className="h-full w-auto"
              priority
            />
          </div>

          {/* Thumbnail Gallery */}
          {merch.images.length > 1 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {merch.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`relative h-15 w-15 flex-shrink-0 border-2 sm:h-18 sm:w-18 md:h-20 md:w-20 ${
                    currentImageIndex === idx
                      ? "border-[var(--merch-pink)]"
                      : "border-black"
                  } hover:border-pink bg-white transition-colors`}
                >
                  <Image
                    src={img}
                    alt={`${merch.merch_name} thumbnail ${idx + 1}`}
                    fill
                    className="object-contain p-2"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="flex flex-col lg:w-7/12">
          <div className="flex items-start justify-between gap-4">
            {/* Product Name */}
            <h1 className="font-bebas-rounded mb-2 text-5xl font-medium uppercase md:text-6xl lg:text-7xl">
              {merch.merch_name}
            </h1>
            <div className="gap-4">
              <FancyButton
                variant="pink"
                size="default"
                onClick={() => setIsShareDialogOpen(true)}
              >
                <ShareIcon className="size-5" />
              </FancyButton>
            </div>
          </div>

          {/* Subtitle */}
          <p className="font-bebas-rounded mb-6 text-2xl text-[var(--merch-pink)] md:text-3xl">
            {merch.category ? "Combo Pack" : "Solo Item"}
          </p>

          {/* Price */}
          <div className="mb-2">
            <div className="flex items-baseline gap-3">
              <span className="font-bebas-rounded text-4xl font-medium md:text-5xl">
                ₹ {Number(merch.price).toLocaleString("en-IN")}
              </span>
              {merch.discount?.enabled && (
                <span className="font-bebas-rounded text-2xl text-gray-400 line-through md:text-3xl">
                  ₹{merch.discount.original_price}
                </span>
              )}
            </div>
            <p className="font-nunito mt-1 text-sm text-gray-600 md:text-base">
              exclusive of GST
            </p>
          </div>

          {/* Discount Label */}
          {merch.discount?.enabled && (
            <div className="mb-6">
              <span className="font-nunito text-pink text-base md:text-lg">
                {merch.discount.label} ({merch.discount.percentage}% OFF)
              </span>
            </div>
          )}

          {/* Short Description */}
          <p className="font-nunito mb-6 text-base leading-relaxed text-gray-700 md:text-lg">
            {merch.merch_description}
          </p>

          {/* Detailed Description (Optional) */}
          {merch.detailed_description && (
            <div className="mb-6">
              <p className="font-nunito text-base leading-relaxed text-gray-700 md:text-lg">
                {merch.detailed_description}
              </p>
            </div>
          )}

          {/* Size Selection & Checkout - Flex row on large, stack on small */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
            {/* Size Selection */}
            <div className="flex-1">
              <div className="mb-4 flex justify-between">
                <h3 className="font-bebas-rounded block text-xl font-medium md:text-2xl">
                  AVAILABLE SIZE
                </h3>
                <FancyButton
                  className="h-fit"
                  onClick={() => setIsMerchDialogOpen(true)}
                >
                  Checkout
                </FancyButton>
              </div>
              <div className="flex flex-wrap gap-3">
                {merch.size.includes("|") &&
                  sizes.map((sizeGroup, idx) => (
                    <div
                      key={idx}
                      className="mb-4 flex flex-col items-start gap-2"
                    >
                      <h4 className="font-nunito mb-2 text-lg font-semibold md:text-xl">
                        {sizeGroup[0]}
                      </h4>
                      <GroupButtonWrapper>
                        {(sizeGroup.slice(1) as string[]).map((size, sidx) => (
                          <GroupButton
                            key={sidx}
                            text={size}
                            onClick={() => {}}
                          />
                        ))}
                      </GroupButtonWrapper>
                    </div>
                  ))}

                {!merch.size.includes("|") &&
                  sizes.map((size, idx) => (
                    <GroupButton
                      key={idx}
                      text={size as string}
                      onClick={() => {}}
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
