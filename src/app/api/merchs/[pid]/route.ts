import { NextRequest, NextResponse } from "next/server"
import { ApiMerchResponse } from "@/app/types/merch"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pid: string }> },
) {
  const { pid } = await params
  try {
    const response = await fetch(`${process.env.BASE_URL}/merchs/`)

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: "Failed to fetch event", details: errorData },
        { status: response.status },
      )
    }

    const data: ApiMerchResponse = await response.json()

    const merch = data.merchs.find((m) => m.pid === pid)
    // const merch = mockMerchs.find((m) => m.pid === pid)

    if (!merch) {
      return NextResponse.json({ error: "Merch not found" }, { status: 404 })
    }

    return NextResponse.json({ merch })
  } catch (error) {
    console.error("Error fetching merch:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
