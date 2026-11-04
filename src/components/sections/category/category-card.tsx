import React from "react"

type CategoryCardProps = {
  title: string
  description: string
  size?: "sm" | "md" | "lg"
}

const CategoryCard = ({
  title,
  description,
  size = "md",
}: CategoryCardProps) => {
  const sizeClasses = {
    sm: { width: "w-40", title: "text-sm", body: "text-xs" },
    md: { width: "w-48", title: "text-3xl", body: "text-sm" },
    lg: { width: "w-52", title: "text-3xl", body: "text-base" },
  }

  return (
    <div
      className={`font-nunito flex h-72 flex-col overflow-hidden border border-black bg-white shadow-[4.68px_5.46px_0px_0px_var(--lime-s)] ${sizeClasses[size].width}`}
    >
      {/* Heading */}
      <div className="flex flex-[4] items-start justify-start border-b border-black bg-[var(--category-main)] px-4 pt-4">
        <h2
          className={`font-bebas-rounded text-left tracking-wide text-black uppercase ${sizeClasses[size].title}`}
        >
          {title.replaceAll("_", " ")}
        </h2>
      </div>

      {/* Body */}
      <div className="flex flex-[6] items-start justify-center px-4 pt-6">
        <p
          className={`line-clamp-4 text-left font-medium text-black ${sizeClasses[size].body}`}
        >
          {description}
        </p>
      </div>
    </div>
  )
}

export default CategoryCard
