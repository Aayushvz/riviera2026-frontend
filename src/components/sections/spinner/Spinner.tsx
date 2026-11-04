"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import Image from "next/image"
import { Sector } from "@/app/types/spinner"
import { getValidAccessToken } from "@/lib/supabase"
import { Loader } from "lucide-react"

interface Prize {
  id: number
  label: string
  color: string
  textColor: string
}

interface SpinResult {
  max_spins: number
  message: string
  prize: {
    item_name: string
    sector_id: string
  }
  spin_id: string
  spins_remaining: number
  spins_used: number
  timestamp: string
  error?: string
}

interface PreviousWinning {
  registration_number: string
  prize: string
}

const PRIZES: Prize[] = [
  {
    id: 1,
    label: "0% DISCOUNT\nON MERCH",
    color: "bg-black",
    textColor: "text-white",
  },
  {
    id: 2,
    label: "50% DISCOUNT\nON MERCH",
    color: "bg-blue-400",
    textColor: "text-white",
  },
  {
    id: 3,
    label: "NO DISCOUNT\n50% MERCH",
    color: "bg-white",
    textColor: "text-black",
  },
  {
    id: 4,
    label: "50% DISCOUNT\nON MERCH",
    color: "bg-black",
    textColor: "text-white",
  },
  {
    id: 5,
    label: "50% DISCOUNT\nON MERCH",
    color: "bg-blue-400",
    textColor: "text-white",
  },
  {
    id: 6,
    label: "NO DISCOUNT\n50% MERCH",
    color: "bg-white",
    textColor: "text-black",
  },
  {
    id: 7,
    label: "50% DISCOUNT\nON MERCH",
    color: "bg-black",
    textColor: "text-white",
  },
  {
    id: 8,
    label: "50% DISCOUNT\nON MERCH",
    color: "bg-blue-400",
    textColor: "text-white",
  },
]

export default function SpinnerWheel() {
  const wheelRef = useRef<HTMLDivElement>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null)
  const [totalRotation, setTotalRotation] = useState(0)
  const [sectors, setSectors] = useState<Sector[]>([])
  const [spinResult, setSpinResult] = useState<SpinResult | null>(null)
  const [previousWinnings, setPreviousWinnings] =
    useState<PreviousWinning | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  const SEGMENT_ANGLE =
    sectors.length > 0 ? 360 / sectors.length : 360 / PRIZES.length

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/sectors")
        const json = await res.json()
        setSectors(json.sectors)
      } catch (error) {
        console.error("Error fetching sectors:", error)
      } finally {
        setLoading(false)
      }
    }

    const fetchPreviousWinnings = async () => {
      try {
        const headers: HeadersInit = { "Content-Type": "application/json" }
        try {
          const authToken = await getValidAccessToken()
          if (authToken) headers["Authorization"] = `Bearer ${authToken}`
        } catch {}

        const res = await fetch("/api/spin/winnings", { headers })
        if (!res.ok) return
        const json = await res.json()
        console.log(json)
        setPreviousWinnings(json)
      } catch (error) {
        console.error("Error fetching previous winnings:", error)
      }
    }

    fetchSectors()
    fetchPreviousWinnings()
  }, [])

  const spin = async () => {
    if (isSpinning) return

    setIsSpinning(true)
    setWinnerIndex(null)
    setSpinResult(null)

    try {
      let idempotencyKey = localStorage.getItem("idempotencyKey")

      if (!idempotencyKey) {
        idempotencyKey = crypto.randomUUID()
        localStorage.setItem("idempotencyKey", idempotencyKey)
      }

      // Call the backend API to determine the prize
      const authToken = await getValidAccessToken()
      const response = await fetch("/api/spin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
          "Idempotency-Key": idempotencyKey,
        },
      })

      const result: SpinResult = await response.json()

      if (!response.ok) {
        setError(result.error?.toUpperCase() || "Failed to spin the wheel")
      }

      localStorage.removeItem("idempotencyKey")
      console.log("Spin result:", result)
      setSpinResult(result)

      // Find the index of the winning sector
      const dataSource = sectors.length > 0 ? sectors : PRIZES
      const winnerIdx = dataSource.findIndex((item) => {
        if (sectors.length > 0) {
          return (item as Sector).sector_id === result.prize.sector_id
        } else {
          // Normalize labels for comparison (remove extra whitespace and case-insensitive)
          const label = ((item as Prize).label || "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase()
          const prizeName = (result.prize.item_name || "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase()
          return (
            label === prizeName ||
            label.includes(prizeName) ||
            prizeName.includes(label)
          )
        }
      })

      if (winnerIdx === -1) {
        console.error("Could not find winning sector in data")
        setIsSpinning(false)
        return
      }

      // Calculate the rotation needed to land on the winning sector
      const currentSegmentAngle =
        sectors.length > 0 ? 360 / sectors.length : SEGMENT_ANGLE

      // Segments are drawn starting at -90deg (so the first segment starts at top)
      // Compute the center angle of the winning segment in degrees where 0deg is East (pointer)
      const winningSegmentCenterAngle =
        winnerIdx * currentSegmentAngle + currentSegmentAngle / 2 - 90
      const normalizedCenter = ((winningSegmentCenterAngle % 360) + 360) % 360 // 0..359

      // Required rotation so that the segment center moves to 0deg (East where the pointer is)
      const requiredRotationToPointer = (360 - normalizedCenter) % 360

      // Determine a whole number of full spins for a nice visual effect (5-7 full spins)
      const extraSpins = Math.floor(5 + Math.random() * 3)

      // Compute how much to rotate from the current rotation to reach the required rotation (keeps continuity)
      const currentRotationNormalized = ((totalRotation % 360) + 360) % 360
      const deltaRotation =
        (requiredRotationToPointer - currentRotationNormalized + 360) % 360

      const finalRotation = totalRotation + extraSpins * 360 + deltaRotation

      // 4️⃣ ANIMATION FIX
      // We animate the ref directly instead of using a proxy object.
      // This enables hardware acceleration (GPU) for butter-smooth pixels.
      gsap.to(wheelRef.current, {
        rotation: finalRotation, // GSAP automatically interprets this as transform: rotate(Ndeg)
        duration: 8, // Increased duration to allow the friction to feel real
        ease: "power4.out", // The "Heavy Friction" ease. Starts fast, takes a long time to settle.
        onComplete: () => {
          setWinnerIndex(winnerIdx)
          setTotalRotation(finalRotation)
          setIsSpinning(false)
        },
      })

      console.log({
        winnerIdx,
        winningSegmentCenterAngle,
        normalizedCenter,
        requiredRotationToPointer,
        currentRotationNormalized,
        deltaRotation,
        extraSpins,
        finalRotation,
      })

      gsap.to(
        { rotation: totalRotation },
        {
          rotation: finalRotation,
          duration: 6,
          ease: "power2.out",
          onUpdate: function () {
            if (wheelRef.current) {
              wheelRef.current.style.transform = `rotate(${this.targets()[0].rotation}deg)`
            }
          },
          onComplete: () => {
            setWinnerIndex(winnerIdx)
            setTotalRotation(finalRotation)
            setIsSpinning(false)
          },
        },
      )
    } catch (error) {
      console.error("Error during spin:", error)
      setIsSpinning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Loader className="text-primary h-12 w-12 animate-spin" />
      </div>
    )
  }

  if (sectors.length === 0) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center p-4">
        <Loader className="text-primary h-12 w-12 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full scale-50 flex-col items-center justify-center gap-10 p-4 sm:scale-70 md:scale-80 lg:scale-60 xl:scale-80">
      {winnerIndex !== null && !isSpinning && spinResult && (
        <div className="animate absolute top-0 z-50 animate-bounce text-center">
          <div className="bg-primary rounded-lg px-6 py-4 text-white shadow-lg">
            <p className="mb-2 text-sm tracking-wide uppercase">
              {spinResult.message}
            </p>
            <p className="text-2xl font-bold whitespace-pre-line">
              {spinResult.prize.item_name}
            </p>
            {/* <p className="mt-2 text-xs opacity-75">Spin ID: {spinResult.spin_id}</p> */}
          </div>
        </div>
      )}

      {/* Spinner Container */}
      <div className="relative aspect-square w-140">
        {/* Pointer */}
        <div className="pointer-events-none absolute top-[43%] -right-12 z-20">
          <Image
            src="/pointer.png"
            alt="Pointer"
            width={100}
            height={100}
            className="h-auto w-40"
          />
        </div>

        {/* Rings */}
        <div className="border-lime-s h-full w-full rounded-full border-[0.5rem]">
          <div className="border-black-s h-full w-full rounded-full border-[1.5rem]">
            {Array.from({ length: 12 }).map((_, index) => {
              const angle = index * 30 * (Math.PI / 180)
              const radius = 257
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius

              return (
                <div
                  key={`dot-${index}`}
                  className="absolute h-4 w-4 rounded-full bg-white shadow-lg"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  }}
                />
              )
            })}

            <div className="border-purple-b-s h-full w-full rounded-full border-[0.5rem]">
              <div className="border-purple-s h-full w-full rounded-full border-[1.5rem]">
                <div className="border-purple-b-s relative h-full w-full overflow-hidden rounded-full border-[0.5rem]">
                  {/* Wheel */}
                  <div
                    ref={wheelRef}
                    className="absolute inset-0 rounded-full transition-transform"
                  >
                    {/* Segments */}
                    {(sectors.length > 0 ? sectors : PRIZES).map(
                      (item, index) => {
                        const currentSegmentAngle =
                          sectors.length > 0
                            ? 360 / sectors.length
                            : SEGMENT_ANGLE
                        const startAngle = index * currentSegmentAngle - 90
                        const endAngle = startAngle + currentSegmentAngle
                        const points = ["50% 50%"]

                        for (let a = startAngle; a <= endAngle; a += 5) {
                          const _x = 50 + 50 * Math.cos((a * Math.PI) / 180)
                          const _y = 50 + 50 * Math.sin((a * Math.PI) / 180)
                          points.push(`${_x}% ${_y}%`)
                        }

                        const itemId =
                          sectors.length > 0
                            ? (item as Sector).sector_id
                            : (item as Prize).id

                        return (
                          <div
                            key={`segment-${itemId}`}
                            className="absolute inset-0"
                            style={{
                              clipPath: `polygon(${points.join(", ")})`,
                              backgroundColor:
                                index % 2 === 0 ? "black" : "white",
                            }}
                          />
                        )
                      },
                    )}

                    {/* Labels */}
                    {(sectors.length > 0 ? sectors : PRIZES).map(
                      (item, index) => {
                        const currentSegmentAngle =
                          sectors.length > 0
                            ? 360 / sectors.length
                            : SEGMENT_ANGLE

                        const rotationAngle =
                          index * currentSegmentAngle + currentSegmentAngle / 2
                        const itemId =
                          sectors.length > 0
                            ? (item as Sector).sector_id
                            : (item as Prize).id
                        const itemLabel =
                          sectors.length > 0
                            ? (item as Sector).item_name
                            : (item as Prize).label

                        return (
                          <div
                            key={itemId}
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              transform: `rotate(${rotationAngle}deg)`,
                            }}
                          >
                            <div
                              className="pointer-events-none text-center text-sm leading-tight font-bold whitespace-pre-line uppercase"
                              style={{
                                transform: `translateY(-135px) rotate(-90deg)`,
                                transformOrigin: "center center",
                                color: index % 2 === 0 ? "white" : "black",
                              }}
                            >
                              {itemLabel}
                            </div>
                          </div>
                        )
                      },
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Logo */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-blue-400 bg-[#AD7CFF]">
              <div className="border-purple-b-s bg-purple-s flex h-16 w-16 items-center justify-center rounded-full border-2">
                <Image
                  draggable={false}
                  src="/spinner.png"
                  alt="Riviera Logo"
                  width={40}
                  height={40}
                  className="h-auto w-full p-2"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button */}
      <button
        onClick={spin}
        disabled={isSpinning || previousWinnings?.prize !== null}
        className="relative cursor-pointer rounded-full bg-gradient-to-r from-lime-400 to-lime-300 px-10 py-4 text-lg font-bold text-black shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
      >
        <h1 className="uppercase">
          {isSpinning
            ? "SPINNING..."
            : error
              ? error
              : previousWinnings?.prize !== null
                ? `${previousWinnings?.prize} WON`
                : "SPIN NOW"}
        </h1>
      </button>
    </div>
  )
}
