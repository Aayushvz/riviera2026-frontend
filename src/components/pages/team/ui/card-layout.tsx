import React from "react"
import Image from "next/image"
import { CardLayoutProps } from "@/app/team/team"
import Link from "next/link"

const CardLayout = ({
  image,
  name,
  designation,
  designationBg = "var(--color-chart-6)",
  size,
  className,
  id,
  isOrg = false,
}: CardLayoutProps) => {
  const sizeClasses = {
    sm: {
      image: "w-40",
      text: "text-md",
      position: "text-sm",
    },
    md: {
      image: isOrg ? "w-full sm:w-60" : "w-60",
      text: "text-lg",
      position: "text-base",
    },
    lg: {
      image: "w-70",
      text: "text-xl",
      position: "text-lg",
    },
  }

  return (
    <Link
      href={`/team?member=${id}`}
      scroll={false}
      id={id}
      className={`font-nunito flex h-full flex-col overflow-hidden border border-black shadow-[4.68px_5.46px_0px_0px_#000000] ${sizeClasses[size].image}`}
    >
      {/* Image Section */}
      <div className="relative aspect-square w-full overflow-hidden border-b border-black bg-white">
        <Image
          src={image}
          alt={name}
          width={1000}
          height={1000}
          className={`w-full ${designation === "Co-Convenor" || designation == "Convenor" ? "h-full object-cover" : "object-contain"} ${className}`}
          draggable={false}
        />
      </div>

      {/* Name Section */}
      <div
        className={`flex h-14 w-full items-center justify-center border-b-[0.78px] border-black ${designation === "Convenor" ? "bg-[#1F1818] text-white" : "bg-white text-black"} py-2`}
      >
        <h2
          className={`font-nunito text-center font-bold tracking-normal capitalize ${sizeClasses[size].text}`}
        >
          {name}
        </h2>
      </div>

      {/* Designation Section */}
      <div
        className={`flex w-full items-center justify-center py-1.5`}
        style={{ backgroundColor: designationBg }}
      >
        <h3
          className={`line-clamp-1 text-center leading-none font-semibold tracking-normal text-white ${sizeClasses[size].position}`}
        >
          {designation}
        </h3>
      </div>
    </Link>
  )
}

export default CardLayout
