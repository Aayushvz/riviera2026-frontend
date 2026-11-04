// events-filter.tsx
"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  Filter,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { format } from "date-fns"
import { FilterState } from "./events-view"
import type { EventType } from "@/app/types/eventDetail"
import { eventTypes } from "@/app/types/eventDetail"

interface EventsFilterProps {
  currentFilters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
}

/* ────────────────────────────────────────────────────────────── */
/* Date + Time Picker (Desktop: Popover | Mobile: Native Date UI) */
/* ────────────────────────────────────────────────────────────── */

const DateTimePicker = ({
  label,
  minDate,
  dateStr,
  onCommit,
}: {
  label: string
  minDate?: Date
  dateStr?: string
  onCommit: (formattedDate: string | undefined) => void
}) => {
  const [date, setDate] = useState<Date | undefined>()
  const [time, setTime] = useState<string>("10:00")
  const [isOpen, setIsOpen] = useState(false)
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 })
  const [mounted, setMounted] = useState(false)

  const triggerWrapRef = useRef<HTMLDivElement>(null)
  const nativeDateRef = useRef<HTMLInputElement>(null)

  const isMobile =
    typeof window !== "undefined" &&
    window.matchMedia("(max-width: 640px)").matches

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (dateStr) {
      const d = new Date(dateStr.replace(" ", "T"))
      if (!isNaN(d.getTime())) {
        setDate(d)
        setTime(
          `${String(d.getHours()).padStart(2, "0")}:${String(
            d.getMinutes(),
          ).padStart(2, "0")}`,
        )
      }
    } else {
      setDate(undefined)
      setTime("10:00")
    }
  }, [dateStr])

  const measure = useCallback(() => {
    if (!triggerWrapRef.current) return
    const r = triggerWrapRef.current.getBoundingClientRect()
    const calendarHeight = 260
    const spaceBelow = window.innerHeight - r.bottom
    const top =
      spaceBelow >= calendarHeight ? r.bottom + 4 : r.top - calendarHeight - 4
    setCalendarPos({ top, left: r.left })
  }, [])

  useEffect(() => {
    if (!isOpen) return
    let raf: number
    const loop = () => {
      measure()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [isOpen, measure])

  useEffect(() => {
    if (!isOpen) return
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Element
      if (
        !triggerWrapRef.current?.contains(t) &&
        !t.closest("[data-cal-portal]")
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [isOpen])

  const updateParent = (d: Date | undefined, t: string) => {
    if (!d) {
      onCommit(undefined)
      return
    }
    const [h, m] = t.split(":").map(Number)
    const nd = new Date(d)
    nd.setHours(h, m, 0, 0)
    onCommit(format(nd, "yyyy-MM-dd HH:mm:ss.SSS"))
  }

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-xs font-bold tracking-wider text-gray-500 uppercase">
        {label}
      </Label>

      <div className="flex gap-2">
        <div className="flex-1" ref={triggerWrapRef}>
          <button
            type="button"
            onClick={() => {
              if (isMobile) {
                nativeDateRef.current?.click()
                return
              }
              measure()
              setIsOpen((p) => !p)
            }}
            className={cn(
              "inline-flex h-9 w-full items-center gap-2 rounded-none border-2 border-black px-4 py-2 text-left text-sm font-normal transition-all hover:bg-gray-100",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
            {date ? format(date, "P") : <span>Select Date</span>}
          </button>
        </div>

        <div className="relative w-1/3">
          <Input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value)
              updateParent(date, e.target.value)
            }}
            className="w-full rounded-none border-2 border-black bg-white px-2 focus-visible:ring-0 [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <Clock className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        </div>
      </div>

      {/* Native mobile date picker (hidden) */}
      {isMobile && (
        <input
          ref={nativeDateRef}
          type="date"
          className="sr-only"
          min={minDate ? format(minDate, "yyyy-MM-dd") : undefined}
          value={date ? format(date, "yyyy-MM-dd") : ""}
          onChange={(e) => {
            const v = e.target.value
            if (!v) return
            const picked = new Date(`${v}T${time}`)
            setDate(picked)
            updateParent(picked, time)
          }}
        />
      )}

      {/* Desktop popover calendar */}
      {mounted &&
        !isMobile &&
        isOpen &&
        createPortal(
          <div
            data-cal-portal=""
            style={{
              position: "fixed",
              top: calendarPos.top,
              left: calendarPos.left,
              zIndex: 30,
            }}
            className="border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Calendar
              mode="single"
              selected={date}
              disabled={minDate ? { before: minDate } : undefined}
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate)
                  setIsOpen(false)
                  updateParent(selectedDate, time)
                }
              }}
              className="bg-white"
            />
          </div>,
          document.body,
        )}
    </div>
  )
}

/* ────────────────────────────────────────────────────────────── */
/* Everything below is UNCHANGED                                  */
/* ────────────────────────────────────────────────────────────── */

const FilterSection = ({
  title,
  isOpen,
  onToggle,
  children,
}: {
  title: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
}) => (
  <div className="border-b-2 border-black last:border-b-0">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between bg-white px-4 py-4 hover:bg-gray-50"
    >
      <span className="font-bold tracking-wide uppercase">{title}</span>
      <ChevronDown
        className={cn("h-5 w-5 transition-transform", isOpen && "rotate-180")}
      />
    </button>
    {isOpen && <div className="p-4 pt-0">{children}</div>}
  </div>
)

const EventsFilter = ({ currentFilters, setFilters }: EventsFilterProps) => {
  const startDate = currentFilters.start_time
    ? new Date(currentFilters.start_time.replace(" ", "T"))
    : undefined
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    eventType: false,
    price: false,
    date: false,
    teamSize: false,
  })

  const [priceRange, setPriceRange] = useState([0, 1000])
  const [teamSize, setTeamSize] = useState([1])

  useEffect(() => {
    setPriceRange([
      currentFilters.min_price || 0,
      currentFilters.max_price || 1000,
    ])
    setTeamSize([currentFilters.team_size || 4])
  }, [currentFilters])

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }))
  }

  const handleTypeChange = (type: EventType) => {
    setFilters((prev) => {
      const currentTypes = prev.category || []
      const isSelected = currentTypes.includes(type as EventType)
      let newTypes
      if (isSelected) {
        newTypes = currentTypes.filter((t) => t !== type)
      } else {
        newTypes = [...currentTypes, type as EventType]
      }
      return { ...prev, category: newTypes, offset: 0 }
    })
  }

  const handlePriceCommit = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      min_price: value[0],
      max_price: value[1],
      offset: 0,
    }))
  }

  const handleTeamCommit = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      team_size: value[0],
      offset: 0,
    }))
  }

  const handleStartDateCommit = (formattedDate: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      start_time: formattedDate,
      offset: 0,
    }))
  }

  const handleEndDateCommit = (formattedDate: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      end_time: formattedDate,
      offset: 0,
    }))
  }

  const clearAll = () => {
    setFilters({
      offset: 0,
      limit: 10,
      min_price: 0,
      category: [],
      start_time: undefined,
      end_time: undefined,
      view: "card",
    })
    setOpenSections({
      eventType: false,
      price: false,
      date: false,
      teamSize: false,
    })
  }

  return (
    <div className="font-nunito w-full max-w-sm">
      <div className="border-2 border-black bg-white shadow-[4.68px_5.46px_0px_0px_#000000]">
        <div className="flex items-center justify-between border-b-2 border-black p-4">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span className="text-lg font-bold tracking-wider">FILTERS</span>
          </div>
          <button
            onClick={clearAll}
            className="text-sm font-medium text-purple-900 decoration-purple-900 underline-offset-4 hover:underline"
          >
            Clear All
          </button>
        </div>

        <div className="flex flex-col">
          <FilterSection
            title="Category"
            isOpen={openSections.eventType}
            onToggle={() => toggleSection("eventType")}
          >
            <div className="space-y-3 pt-2">
              {eventTypes.map((type) => (
                <label
                  key={type}
                  className="group flex cursor-pointer items-center gap-3"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 appearance-none border-2 border-gray-400 transition-all checked:border-black checked:bg-black"
                      checked={
                        currentFilters.category?.includes(type as EventType) ||
                        false
                      }
                      onChange={() => handleTypeChange(type)}
                    />
                    <svg
                      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700 capitalize group-hover:text-black">
                    {type.replace(/_/g, " ")}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection
            title="Price Range"
            isOpen={openSections.price}
            onToggle={() => toggleSection("price")}
          >
            <div className="px-2 pt-4">
              <Slider
                min={0}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={setPriceRange}
                onValueCommit={handlePriceCommit}
                className="py-4"
              />
              <div className="mt-2 flex items-center justify-between">
                <div className="w-20 border border-black px-2 py-1 text-center text-xs font-bold">
                  ₹{priceRange[0]}
                </div>
                <span className="text-gray-400">-</span>
                <div className="w-20 border border-black px-2 py-1 text-center text-xs font-bold">
                  ₹{priceRange[1]}
                </div>
              </div>
            </div>
          </FilterSection>

          <FilterSection
            title="Date & Time"
            isOpen={openSections.date}
            onToggle={() => toggleSection("date")}
          >
            <div className="space-y-6 pt-2 pb-2">
              <DateTimePicker
                label="Start From"
                dateStr={currentFilters.start_time}
                onCommit={handleStartDateCommit}
              />
              <DateTimePicker
                label="End At"
                dateStr={currentFilters.end_time}
                minDate={startDate}
                onCommit={handleEndDateCommit}
              />
            </div>
          </FilterSection>

          <FilterSection
            title="Team Size"
            isOpen={openSections.teamSize}
            onToggle={() => toggleSection("teamSize")}
          >
            <div className="px-2 pt-4">
              <Slider
                min={1}
                max={25}
                step={1}
                value={teamSize}
                onValueChange={setTeamSize}
                onValueCommit={handleTeamCommit}
                className="py-4"
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">1</span>
                <div className="border border-black bg-black px-3 py-1 text-sm font-bold text-white">
                  {teamSize[0]}
                </div>
                <span className="text-xs font-bold text-gray-500">25</span>
              </div>
            </div>
          </FilterSection>
        </div>
      </div>
    </div>
  )
}

export default EventsFilter
