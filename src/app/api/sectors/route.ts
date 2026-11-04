import { SectorsResponse } from "@/app/types/spinner"

export async function GET() {
  try {
    const response = await fetch("https://riviera.vit.ac.in/api/v1/sectors")

    if (!response.ok) {
      throw new Error("Failed to fetch sectors")
    }

    const data: SectorsResponse = await response.json()

    return Response.json(data)
  } catch (error) {
    console.error("Error fetching sectors:", error)
    return Response.json({ error: "Failed to fetch sectors" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
