interface EventDescriptionProps {
  description: string
}

export const EventDescription: React.FC<EventDescriptionProps> = ({
  description,
}) => {
  return (
    <div className="font-nunito mb-6">
      <p className="line-clamp-[8] text-justify text-sm leading-relaxed text-gray-800 lg:line-clamp-[7]">
        {description}
      </p>
    </div>
  )
}
