import { EventDetail } from "@/app/types/eventDetail"

if (!process.env.BASE_URL) {
  throw new Error("BASE_URL is not defined in environment variables")
}

const BASE_URL = process.env.BASE_URL

export async function getEventByIdServer(id: string): Promise<EventDetail> {
  const res = await fetch(`${BASE_URL}/events/${id}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch event: ${res.status}`)
  }

  return res.json()
}
