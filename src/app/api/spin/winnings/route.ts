export async function GET(req: Request) {
  const authHeader = req.headers.get("Authorization")
  const token = authHeader?.split(" ")[1]

  if (!token) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    })
  }

  try {
    const response = await fetch(
      "https://riviera.vit.ac.in/api/v1/spin/winnings",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      return new Response(
        JSON.stringify({
          error: errorData.message || "Failed to spin the wheel",
        }),
        { status: response.status },
      )
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.error("Error processing spin request:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    })
  }
}

export const dynamic = "force-dynamic"
