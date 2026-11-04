interface JudgementCriteriaProps {
  criteria: string
}

export const JudgementCriteria: React.FC<JudgementCriteriaProps> = ({
  criteria,
}) => {
  const items = criteria.split("\n").filter((item) => item.trim())

  return (
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 text-sm leading-relaxed">
          <span className="mt-1 shrink-0 text-black">•</span>
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  )
}
