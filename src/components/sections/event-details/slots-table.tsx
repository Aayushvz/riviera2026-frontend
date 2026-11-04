import { SlotDetail } from "@/app/types/eventDetail"

interface SlotsTableProps {
  slots: SlotDetail[]
}

export const SlotsTable: React.FC<SlotsTableProps> = ({ slots }) => {
  if (slots.length === 0) return null

  return (
    <div className="mb-8 pt-4">
      <h2 className="font-bebas-rounded mb-6 text-2xl font-bold uppercase sm:text-3xl">
        Slots
      </h2>
      <div className="relative">
        {/* Shadow box */}
        <div
          className="absolute inset-0 rounded-2xl bg-black"
          style={{ transform: "translate(6px, 6px)" }}
        />

        {/* Main table container */}
        <div className="relative z-10 overflow-hidden rounded-2xl border-2 border-black bg-white transition-transform duration-150 hover:translate-x-[2px] hover:translate-y-[2px]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-black bg-[#AD7CFF]">
                  <th className="px-4 py-4 text-left text-xs font-bold tracking-wider uppercase sm:px-6 sm:text-sm">
                    Location
                  </th>
                  <th className="px-4 py-4 text-center text-xs font-bold tracking-wider uppercase sm:px-6 sm:text-sm">
                    Date
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-bold tracking-wider uppercase sm:px-6 sm:text-sm">
                    Timings
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {slots.map((slot, index) => (
                  <tr
                    key={index}
                    className={`transition-colors hover:bg-gray-50 ${
                      index !== slots.length - 1
                        ? "border-b-2 border-black"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-4 text-xs text-gray-800 sm:px-6 sm:text-sm">
                      {slot.venue}
                    </td>
                    <td className="px-4 py-4 text-center text-xs text-gray-800 sm:px-6 sm:text-sm">
                      {new Date(slot.start_date).getFullYear() !== 2030 ? (
                        <>
                          {(() => {
                            const start = new Date(
                              slot.start_date,
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                            const end = new Date(
                              slot.end_date,
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                            })
                            return start === end ? (
                              start
                            ) : (
                              <>
                                {start} - {end}
                              </>
                            )
                          })()}
                        </>
                      ) : (
                        "TBA"
                      )}
                    </td>
                    <td className="px-4 py-4 text-right text-xs text-gray-800 sm:px-6 sm:text-sm">
                      {new Date(slot.start_date).getFullYear() !== 2030
                        ? formatTime(slot.start_date)
                        : "TBA"}{" "}
                      -{" "}
                      {new Date(slot.end_date).getFullYear() !== 2030
                        ? formatTime(slot.end_date)
                        : "TBA"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatTime(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    })
  } catch {
    return dateTimeString
  }
}

function formatDate(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString)
    const day = date.toLocaleDateString("en-US", {
      day: "numeric",
      timeZone: "Asia/Kolkata",
    })
    const month = date.toLocaleDateString("en-US", {
      month: "short",
      timeZone: "Asia/Kolkata",
    })
    return `${day}${getOrdinalSuffix(parseInt(day))} ${month}`
  } catch {
    return dateTimeString
  }
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th"
  switch (day % 10) {
    case 1:
      return "st"
    case 2:
      return "nd"
    case 3:
      return "rd"
    default:
      return "th"
  }
}
