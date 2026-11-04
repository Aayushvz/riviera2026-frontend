import { useMemo } from "react"
import { SlotDetail } from "@/app/types/eventDetail"

interface EventStatsProps {
  slotDetails: SlotDetail[]
  prizes: string
  numberOfParticipants: string
  category: string
}

export const EventStats: React.FC<EventStatsProps> = ({
  slotDetails,
  prizes,
  numberOfParticipants,
  category,
}) => {
  const venueText = useMemo(() => {
    const uniqueVenues = [...new Set(slotDetails.map((slot) => slot.venue))]
    return uniqueVenues.length > 1
      ? "Multiple Venues"
      : uniqueVenues[0] || "TBA"
  }, [slotDetails])

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatItem label="VENUE" value={venueText || "TBA"} />
      {prizes !== "NA" && (
        <StatItem label="PRIZE POOL" value={prizes || "TBA"} />
      )}
      <StatItem label="Team Size" value={numberOfParticipants || "TBA"} />
      <StatItem
        label="Category"
        value={category.toString().toUpperCase().replace(/_/g, " ")}
      />
    </div>
  )
}

const StatItem: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div>
    <h3 className="font-bebas-rounded mb-1 text-xl leading-tight font-medium">
      {label}
    </h3>
    <p className="font-nunito text-sm font-medium text-gray-600">{value}</p>
  </div>
)
