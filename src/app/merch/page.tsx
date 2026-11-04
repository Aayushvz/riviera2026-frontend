import type { Metadata } from "next"
import MerchCard, {
  MerchCardSkeleton,
} from "@/components/pages/merch/merch-card"
import type { Merch } from "@/app/types/merch"

export const metadata: Metadata = {
  title: "Merchandise - Riviera 2026 | VIT Vellore",
  description:
    "Get exclusive Riviera 2026 merchandise. Shop for t-shirts, polos, hoodies, and combo packs.",
}

async function getMerchs(): Promise<Merch[]> {
  try {
    const res = await fetch(`${process.env.BASE_URL}/merchs/`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`)
      return []
    }

    const data = await res.json()

    if (!data || !Array.isArray(data.merchs)) {
      console.error("Invalid API response structure:", data)
      return []
    }

    return data.merchs
  } catch (error) {
    console.error("Failed to fetch merchs:", error)
    return []
  }
}

export default async function MerchPage() {
  const merchs = await getMerchs()

  const solos = merchs.filter((m) => m.category !== true)
  const combos = merchs.filter((m) => m.category === true)

  return (
    <div className="bg-background min-h-screen w-full bg-[url('/assets/team/riv-grid.svg')] bg-contain p-4 pt-28 md:p-10 md:pt-30">
      {/* SOLOS Section */}
      <section className="w-full">
        <h2 className="font-bebas-rounded text-foreground mb-5 text-start text-6xl md:text-8xl lg:mb-10">
          SOLOS
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {solos.length > 0
            ? solos.map((merch) => <MerchCard key={merch.pid} merch={merch} />)
            : Array.from({ length: 3 }).map((_, index) => (
                <MerchCardSkeleton key={index} />
              ))}
        </div>
      </section>

      {/* COMBOS Section */}
      <section className="mt-20 w-full">
        <h2 className="font-bebas-rounded text-foreground mb-5 text-start text-6xl md:text-8xl lg:mb-10">
          COMBOS
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {combos.length > 0
            ? combos.map((merch) => <MerchCard key={merch.pid} merch={merch} />)
            : Array.from({ length: 3 }).map((_, index) => (
                <MerchCardSkeleton key={index} />
              ))}
        </div>
      </section>
    </div>
  )
}
