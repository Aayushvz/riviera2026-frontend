export async function GET(
  request: Request,
  { params }: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await params
  try {
    const response = await fetch(`${process.env.BASE_URL}/events/${eventId}`)

    if (!response.ok) {
      const errorData = await response.json()
      return Response.json(
        { error: "Failed to fetch event", details: errorData },
        { status: response.status },
      )
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error("Error fetching event:", error)
    return Response.json({ error: "Internal server error" }, { status: 500 })
  }
}
