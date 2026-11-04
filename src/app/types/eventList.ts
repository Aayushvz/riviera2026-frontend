export interface Event {
  category: string
  club: string
  description: string
  end_date: Date
  featured: boolean
  image: string
  name: string
  on_hold: boolean
  pid: string
  price_per_ticket: number
  start_date: Date
  team_size: string
  total_prize?: string
  venues: string[]
  price_per_team: boolean
}

export interface EventsResponse {
  message: string
  total_pages: number
  events: Event[]
}
