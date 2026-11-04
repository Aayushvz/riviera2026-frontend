"use client"

import { useEffect, useState } from "react"
import { Search, Loader2 } from "lucide-react"
import type { Event, EventsResponse } from "@/app/types/eventList"
import { AnimatedSearchBar } from "@/components/ui/AnimatedSearchBar"

interface SearchAutocompleteProps {
  value: string
  onChange: (val: string) => void
  type: string
}

const SearchAutocomplete = ({
  value,
  onChange,
  type,
}: SearchAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<Event[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(value !== "" ? true : false)

  const [searchTerm, setSearchTerm] = useState(value)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    setLoading(true)

    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/events?type=${type}&club=${encodeURIComponent(
            searchTerm,
          )}&limit=10`,
          { signal: controller.signal },
        )

        if (res.ok) {
          const json: EventsResponse = await res.json()
          setSuggestions(json.events || [])
        }
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message)
        }
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => {
      clearTimeout(t)
      controller.abort()
    }
  }, [searchTerm, type])

  return (
    <div className="relative w-full sm:max-w-sm">
      <AnimatedSearchBar
        loading={loading}
        value={searchTerm}
        changeFunc={(val) => {
          setSearchTerm(val)
          setShowSuggestions(true)
          if (val === "") {
            onChange("")
            setSuggestions([])
            setLoading(false)
          }
        }}
        focusFunc={() => setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
        keyDownFunc={() => {
          onChange(searchTerm)
          setShowSuggestions(false)
        }}
        submitted={submitted}
        setSubmitted={setSubmitted}
      />

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute right-0 left-0 z-50 mt-1 h-fit overflow-y-auto rounded-lg border-2 border-black bg-white shadow-lg">
          {suggestions.map((event) => (
            <div
              key={event.pid}
              className="cursor-pointer px-4 py-2 text-sm capitalize hover:bg-gray-100"
              onMouseDown={() => {
                onChange(event.name)
                setSearchTerm(event.name)
                setShowSuggestions(false)
                setSubmitted(true)
              }}
            >
              {event.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchAutocomplete
