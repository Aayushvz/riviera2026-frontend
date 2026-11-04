"use client"

import Image from "next/image"
import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import gsap from "gsap"
import type { Merch } from "@/app/types/merch"
import { FancyButton } from "@/components/ui/fancy-button"
import { ThreeCanvas } from "@/components/ThreeCanvas"
import { GLBModel } from "@/components/Model"
import { useRouter } from "next/navigation"

export default function MerchCard({ merch }: { merch: Merch }) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [lastImageIndex, setLastImageIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [isModelLoaded, setIsModelLoaded] = useState(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  // GSAP Hover Animation
  const handleMouseEnter = () => {
    setIsHovered(true)
    setCurrentImageIndex((prev) => (prev + 1) % merch.images.length)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setCurrentImageIndex(lastImageIndex)
  }

  const handleImageMouseEnter = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        duration: 0.4,
        ease: "power2.out",
      })
    }
  }

  const handleImageMouseLeave = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        duration: 0.3,
        ease: "power2.out",
      })
    }
  }

  // Image navigation
  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLastImageIndex(currentImageIndex)
    setCurrentImageIndex((prev) =>
      prev === 0 ? merch.images.length - 1 : prev - 1,
    )

    // Image transition animation
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
      )
    }
  }

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setLastImageIndex(currentImageIndex)

    setCurrentImageIndex((prev) =>
      prev === merch.images.length - 1 ? 0 : prev + 1,
    )

    // Image transition animation
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, x: 20 },
        { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" },
      )
    }
  }

  return (
    // <Link href={`/merch/${merch.pid}`} className="block h-full" draggable={false}>
    <div
      ref={cardRef}
      className="relative h-full w-full border border-black bg-white transition-shadow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {merch.discount?.enabled && merch.discount.limited_to && (
        <div className="font-nunito bg-chart-2 absolute top-0 right-0 z-10 flex items-center gap-1 border-b border-l border-black px-3 py-1 text-xs font-medium text-black md:text-sm">
          <span>OFFER FOR FIRST {merch.discount.limited_to} BUYERS</span>
        </div>
      )}

      {/* Product Image with Gallery - Added overflow-hidden */}
      <div
        className="relative flex aspect-square items-center justify-center overflow-hidden bg-gray-100"
        onMouseEnter={handleImageMouseEnter}
        onMouseLeave={handleImageMouseLeave}
      >
        <div ref={imageRef} className="aspect-square w-full">
          {[
            "Riviera Hoodie",
            "Riviera Oversized T-Shirt",
            "Riviera Varsity Jacket",
            "Riviera Polo T-Shirt",
          ].includes(merch.merch_name) && (
            <div className="relative h-full w-full">
              {/* Fallback image while the 3D model loads */}
              {!isModelLoaded && (
                <div className="absolute inset-0">
                  <Image
                    src={merch.images[currentImageIndex]}
                    alt={`${merch.merch_name} - Image ${currentImageIndex + 1}`}
                    width={1000}
                    height={1000}
                    className="h-full w-full scale-105 object-cover"
                    priority
                  />
                </div>
              )}

              {/* 3D model (loaded lazily); once ready it renders over the image */}
              <div className="absolute inset-0">
                <ThreeCanvas showLoader={false}>
                  {merch.merch_name === "Riviera Hoodie" && (
                    <GLBModel
                      url="/assets/models/hoodie.glb"
                      scale={3}
                      position={[0, -4, 0]}
                      onLoad={() => setIsModelLoaded(true)}
                    />
                  )}

                  {merch.merch_name === "Riviera Oversized T-Shirt" && (
                    <GLBModel
                      url="/assets/models/tshirt.glb"
                      scale={3.5}
                      position={[0, -4.5, 0]}
                      onLoad={() => setIsModelLoaded(true)}
                    />
                  )}

                  {merch.merch_name === "Riviera Varsity Jacket" && (
                    <GLBModel
                      url="/assets/models/varsity.glb"
                      scale={1.5}
                      position={[0, -1.2, 0]}
                      onLoad={() => setIsModelLoaded(true)}
                    />
                  )}

                  {merch.merch_name === "Riviera Polo T-Shirt" && (
                    <GLBModel
                      url="/assets/models/polo.glb"
                      scale={1.5}
                      position={[0, -1.2, 0]}
                      onLoad={() => setIsModelLoaded(true)}
                    />
                  )}
                </ThreeCanvas>
              </div>
            </div>
          )}

          {merch.merch_name !== "Riviera Hoodie" &&
            merch.merch_name !== "Riviera Varsity Jacket" &&
            merch.merch_name !== "Riviera Oversized T-Shirt" &&
            merch.merch_name !== "Riviera Polo T-Shirt" && (
              <Image
                src={merch.images[currentImageIndex]}
                alt={`${merch.merch_name} - Image ${currentImageIndex + 1}`}
                width={1000}
                height={1000}
                className="h-full w-full scale-105"
                priority
              />
            )}
        </div>

        {/* Navigation Arrows */}
        {merch.category !== false && merch.images.length > 1 && isHovered && (
          //   {merch.images.length > 1 && isHovered && (
          <>
            {/* Left Arrow */}
            <button
              onClick={handlePrevImage}
              className="bg-primary/70 absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full p-2 transition-all hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-black md:h-6 md:w-6" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={handleNextImage}
              className="bg-primary/70 absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full p-2 transition-all hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-black md:h-6 md:w-6" />
            </button>
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="border-t border-black py-4">
        {/* Product Name */}
        <h2 className="font-bebas-rounded px-6 pb-2 text-2xl font-medium uppercase md:text-4xl">
          {merch.merch_name}
        </h2>

        {/* Discount Label & Percentage */}
        {merch.discount?.enabled && (
          <div className="flex items-center justify-between">
            <span className="-pt-2 font-nunito md:text-md px-6 pb-2 text-sm text-gray-600 lg:text-lg">
              {merch.discount.label}
            </span>
            <span className="-pt-2 font-nunito md:text-md px-6 pb-2 text-sm text-(--merch-pink) lg:text-xl">
              ({merch.discount.percentage}% OFF)
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between border-t border-black px-6 pt-4 pb-2">
          <div className="flex items-center gap-3">
            <span className="font-bebas-rounded text-2xl font-medium md:text-3xl">
              ₹ {merch.price}
            </span>

            {merch.discount?.enabled && (
              <span className="font-bebas-rounded text-xl text-gray-400 line-through md:text-2xl">
                ₹{merch.discount.original_price}
              </span>
            )}
          </div>

          <FancyButton onClick={() => router.push(`/merch/${merch.pid}`)}>
            BUY NOW
          </FancyButton>
        </div>
      </div>
    </div>
    // </Link>
  )
}

export function MerchCardSkeleton() {
  return (
    <div className="h-full w-full border border-black bg-white">
      {/* Image Area Skeleton */}
      <div className="aspect-square w-full animate-pulse bg-gray-200" />

      {/* Product Info Skeleton */}
      <div className="border-t border-black py-4">
        {/* Title Lines */}
        <div className="space-y-2 px-6 pb-2">
          {/* Main Title */}
          <div className="h-8 w-3/4 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Discount/Label Row Skeleton */}
        <div className="mt-2 flex items-center justify-between px-6 pb-2">
          <div className="h-4 w-1/3 animate-pulse rounded-md bg-gray-200" />
          <div className="h-4 w-1/4 animate-pulse rounded-md bg-gray-200" />
        </div>

        {/* Price & Button Section Skeleton */}
        <div className="mt-2 flex items-center justify-between border-t border-black px-6 pt-4 pb-2">
          {/* Price Block */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 animate-pulse rounded-md bg-gray-200" />
          </div>

          {/* Button Placeholder */}
          <div className="h-10 w-28 animate-pulse rounded-md bg-gray-200" />
        </div>
      </div>
    </div>
  )
}
