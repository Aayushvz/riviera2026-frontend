import { Mail, Phone } from "lucide-react"

interface ContactInfoProps {
  coordinator1Email: string
  coordinator1Phone: string
  coordinator2Email: string
  coordinator2Phone: string
}

export const ContactInfo: React.FC<ContactInfoProps> = ({
  coordinator1Email,
  coordinator1Phone,
  coordinator2Email,
  coordinator2Phone,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 *:rounded-lg *:bg-black/5 *:p-4 md:grid-cols-2">
      {coordinator1Email && coordinator1Phone && (
        <div className="space-y-2">
          <h4 className="mb-3 text-sm font-semibold">Coordinator 1</h4>
          <a
            href={`mailto:${coordinator1Email}`}
            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-[#FE54F8]"
          >
            <Mail className="h-4 w-4" />
            <span>{coordinator1Email}</span>
          </a>
          <a
            href={`tel:${coordinator1Phone}`}
            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-[#FE54F8]"
          >
            <Phone className="h-4 w-4" />
            <span>{coordinator1Phone}</span>
          </a>
        </div>
      )}
      {coordinator2Email && coordinator2Phone && (
        <div className="space-y-2">
          <h4 className="mb-3 text-sm font-semibold">Coordinator 2</h4>
          <a
            href={`mailto:${coordinator2Email}`}
            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-pink-600"
          >
            <Mail className="h-4 w-4" />
            <span>{coordinator2Email}</span>
          </a>
          <a
            href={`tel:${coordinator2Phone}`}
            className="flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-pink-600"
          >
            <Phone className="h-4 w-4" />
            <span>{coordinator2Phone}</span>
          </a>
        </div>
      )}
    </div>
  )
}
