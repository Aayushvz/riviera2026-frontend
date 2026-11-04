import { NextRequest, NextResponse } from "next/server"

const BASE_URL = process.env.BASE_URL

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BASE_URL}/merchs/`)

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: "Failed to fetch events", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json({ merchs: data }, { status: 200 })
  } catch (error) {
    console.error("Error fetching events:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
