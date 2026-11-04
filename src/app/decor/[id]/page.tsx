import React from "react"
import { Decor } from "@/app/types/decor"
import DecorCarousel from "@/components/decor/decor-carousel"

export default async function page({ params }: { params: { id: string } }) {
  const { id } = params
  let jsonData: Decor | null = null
  try {
    const data = await fetch(`${process.env.BASE_URL}/sdg/${id}`)
    jsonData = await data.json()
    console.log(jsonData)
  } catch (error) {
    console.error("Error fetching decor:", error)
  }

  return (
    <div className="bg-background min-h-screen w-full bg-[url('/assets/team/riv-grid.svg')] bg-center bg-no-repeat px-4 pt-32">
      <div className="mb-10 flex h-[40vh] w-full justify-center overflow-hidden md:h-[50vh] lg:h-[60vh]">
        <DecorCarousel
          images={jsonData?.images ?? []}
          alt={jsonData?.title || "Default Decor"}
        />
      </div>
      <h1 className="font-bebas-rounded mb-10 px-4 text-left text-3xl font-bold md:mx-[10%] md:text-4xl lg:text-5xl">
        {jsonData?.title || "Decor Details"}
      </h1>
      <div className="font-nunito mx-auto w-full px-0 pb-10 md:w-[90%] md:px-4 lg:w-[80%]">
        <div className="overflow-hidden border-2 border-black">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
            <div className="grid grid-cols-1 border-b-2 border-black sm:grid-cols-[160px_1fr] md:border-r-2 md:border-b-0">
              <div className="flex items-center justify-start border-black px-4 py-4 sm:justify-center sm:px-2 sm:py-4">
                <h2 className="font-bebas-rounded text-2xl font-bold sm:text-3xl">
                  Time Taken
                </h2>
              </div>
              <div className="flex items-center px-4 py-4 text-base leading-relaxed sm:px-16 sm:text-lg">
                {jsonData?.time_taken || "—"}
              </div>
            </div>
            <div className="grid grid-cols-1 border-b-2 border-black sm:grid-cols-[160px_1fr] md:border-b-0">
              <div className="flex items-center justify-start border-black px-4 py-4 sm:justify-center sm:px-6 sm:py-4">
                <h2 className="font-bebas-rounded text-2xl font-bold tracking-wide sm:text-3xl">
                  Materials Used
                </h2>
              </div>
              <div className="px-4 py-4 text-base leading-relaxed sm:px-16 sm:py-6 sm:text-lg">
                {jsonData?.materials || "—"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 border-t-0 border-black sm:grid-cols-[200px_1fr] md:border-t-2">
            <div className="flex items-center justify-start border-black px-4 py-4 sm:px-6">
              <h2 className="font-bebas-rounded text-2xl font-bold tracking-wider sm:text-3xl">
                Decor Info
              </h2>
            </div>
            <div className="px-4 py-4 text-base leading-relaxed sm:px-6 sm:py-6 sm:text-lg">
              {jsonData?.decor_info || "—"}
            </div>
          </div>
          <div className="grid grid-cols-1 border-t-2 border-black sm:grid-cols-[200px_1fr]">
            <div className="flex items-center justify-start border-black px-4 py-4 sm:px-6">
              <h2 className="font-bebas-rounded text-2xl font-bold tracking-wide sm:text-3xl">
                Contribution Made
              </h2>
            </div>
            <div className="px-4 py-4 text-base leading-relaxed sm:px-6 sm:py-6 sm:text-lg">
              {jsonData?.contributions_made || "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
