export interface SlotDetail {
  start_date: string
  end_date: string
  venue: string
}

export interface EventDetail {
  pid: string
  name: string
  category: EventType
  description: string
  short_description: string
  club: string
  featured: boolean
  price_per_ticket: number
  image: string
  event_type: "internal" | "external"
  coordinator1_email: string
  coordinator1_phone: string
  coordinator2_email: string
  coordinator2_phone: string
  slot_details: SlotDetail[]
  judgement_criteria: string
  points: string
  prizes: string
  number_of_participants: string
  rules: string
  is_a_team_event: boolean
  is_registrable: boolean
  price_per_team: boolean
}

export const eventTypes = [
  "adventure_sports",
  "art_drama",
  "cyber_engage",
  "dance",
  "informal",
  "music",
  "pre_riviera",
  "premium",
  "quiz_words_worth",
  "sports",
  "workshop",
] as const

export type EventType = (typeof eventTypes)[number]
