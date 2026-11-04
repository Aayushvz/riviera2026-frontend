import React from "react"
import Link from "next/link"

interface ConvenerCardProps {
  name: string
  designation: string
  nameBg: string
  nameColor?: string
  size?: "xs" | "sm" | "lg"
  id: string
}

const ConvenerCard = ({
  name,
  designation,
  nameBg,
  nameColor = "white",
  size = "lg",
  id,
}: ConvenerCardProps) => {
  const cardWidth = {
    xs: "w-full md:w-75 lg:w-60",
    sm: "w-75 lg:w-75",
    lg: "w-75 lg:w-100",
  }

  const nameClasses = {
    xs: "text-sm",
    sm: "text-lg",
    lg: "",
  }

  const descClasses = {
    xs: "text-xs",
    sm: "text-md",
    lg: "",
  }

  return (
    <Link
      href={`/team?member=${id}`}
      scroll={false}
      id={id}
      className={`font-nunito flex min-h-full flex-col border border-black shadow-[4.68px_5.46px_0px_0px_#000000] ${cardWidth[size]}`}
    >
      <div
        className="flex h-full w-full items-center justify-center border-b-[0.5px] border-black py-3"
        style={{ backgroundColor: nameBg }}
      >
        <h2
          className={`font-nunito text-center leading-none font-bold tracking-normal capitalize ${nameClasses[size]}`}
          style={{ color: nameColor }}
        >
          {name}
        </h2>
      </div>

      {/* Designation Section - Fixed Background */}
      <div className="flex w-full items-center justify-center bg-[#AD7CFF] py-1.5">
        <h3
          className={`text-center leading-none font-semibold tracking-normal text-white ${descClasses[size]}`}
        >
          {designation}
        </h3>
      </div>
    </Link>
  )
}

export default ConvenerCard
