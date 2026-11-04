import React from "react"
import { X } from "lucide-react"

const CategoryBadge = ({
  category,
  onClick,
  active,
}: {
  category: string
  onClick: () => void
  active?: boolean
}) => {
  return (
    <div
      onClick={onClick}
      className={`${active ? "bg-foreground border-foreground border-2 px-3 py-1 text-white" : "border-2 border-black bg-white px-3 py-1 text-black"} border-background flex items-center gap-1 rounded-full text-sm capitalize`}
    >
      {category.replace(/_/g, " ")} {active ? <X className="h-4 w-4" /> : null}
    </div>
  )
}

export default CategoryBadge
