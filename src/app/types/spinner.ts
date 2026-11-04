export interface Inventory {
  inventory_id: string
  remaining_count: number
  initial_count: number
}

export interface Sector {
  sector_id: string
  item_name: string
  base_weight: number
  is_active: boolean
  inventory: Inventory
  created_at: string
  updated_at: string
}

export type SectorsResponse = Sector[]
