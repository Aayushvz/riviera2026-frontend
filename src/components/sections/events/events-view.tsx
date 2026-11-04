"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import {
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
} from "lucide-react"

import EventCard from "./event-card"
import EventList from "./event-list"
import { sendGAEvent } from "@next/third-parties/google"

import EventsFilter from "./events-filter"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
  DrawerOverlay,
} from "@/components/ui/drawer"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { EventsResponse, Event } from "@/app/types/eventList"
import Navigation from "@/components/navigation"
import { EventType } from "@/app/types/eventDetail"

import SearchAutocomplete from "./autocomplete-search"
import CategoryBadge from "./category-badge"

export interface FilterState {
  club?: string
  category?: EventType[]
  min_price: number
  max_price?: number
  start_time?: string
  end_time?: string
  team_size?: number
  offset: number
  limit: number
  eventDate?: string
  view?: "list" | "card"
}

const pinnedCategories: EventType[] = ["adventure_sports", "informal"]

const dayBadges = [
  {
    label: "Day 1",
    date: new Date("2026-02-26").toLocaleDateString("en-CA"),
  },
  {
    label: "Day 2",
    date: new Date("2026-02-27").toLocaleDateString("en-CA"),
  },
  {
    label: "Day 3",
    date: new Date("2026-02-28").toLocaleDateString("en-CA"),
  },
  {
    label: "Day 4",
    date: new Date("2026-03-01").toLocaleDateString("en-CA"),
  },
]

const EventsView = ({ type }: { type: "external" | "internal" }) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")

  const [filtersState, setFiltersState] = useState<FilterState>(() => {
    const params = new URLSearchParams(searchParams.toString())

    const typeParam = params.get("category")
    const types = typeParam
      ? (typeParam.split(",").filter(Boolean) as FilterState["category"])
      : []

    const view = (params.get("view") as FilterState["view"]) || "card"

    return {
      club: params.get("club") || "",
      offset: Number(params.get("offset")) || 0,
      limit:
        view === "list"
          ? Number(params.get("limit")) || 20
          : Number(params.get("limit")) || 10,
      min_price: Number(params.get("min_price")) || 0,
      max_price: params.get("max_price")
        ? Number(params.get("max_price"))
        : undefined,
      team_size: params.get("team_size")
        ? Number(params.get("team_size"))
        : undefined,
      start_time: params.get("start_time") || undefined,
      end_time: params.get("end_time") || undefined,
      category: types,
      eventDate: params.get("eventDate") || undefined,
      view: (params.get("view") as FilterState["view"]) || "card",
    }
  })

  useEffect(() => {
    if (filtersState.club) {
      setSearchTerm(filtersState.club)
    }
  }, [filtersState.club])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setFiltersState((prev) => {
        if (prev.club === searchTerm) return prev
        return { ...prev, club: searchTerm, offset: 0 }
      })

      const params = new URLSearchParams(searchParams.toString())

      if (searchTerm) {
        params.set("club", searchTerm)
      } else {
        params.delete("club")
      }

      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }, 500)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  useEffect(() => {
    const params = new URLSearchParams()

    if (filtersState.club) params.set("club", filtersState.club)
    if (filtersState.offset > 0)
      params.set("offset", filtersState.offset.toString())
    if (filtersState.limit !== 10) {
      params.set("limit", filtersState.limit.toString())
    } else if (filtersState.view === "list") {
      params.set("limit", "20")
    }
    if (filtersState.min_price > 0)
      params.set("min_price", filtersState.min_price.toString())
    if (filtersState.max_price)
      params.set("max_price", filtersState.max_price.toString())
    if (filtersState.team_size)
      params.set("team_size", filtersState.team_size.toString())
    if (filtersState.start_time)
      params.set("start_time", filtersState.start_time)
    if (filtersState.end_time) params.set("end_time", filtersState.end_time)

    if (filtersState.category && filtersState.category.length > 0) {
      params.set("category", filtersState.category.join(","))
    }

    if (filtersState.eventDate) {
      params.set("eventDate", filtersState.eventDate)
    }

    if (filtersState.view && filtersState.view !== "card") {
      params.set("view", filtersState.view)
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [filtersState, pathname, router])

  useEffect(() => {
    setFiltersState((prev) => {
      if (prev.view === "list" && prev.limit < 20) {
        return { ...prev, limit: 20, offset: 0 }
      }
      return prev
    })
  }, [filtersState.view])

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()

        Object.entries(filtersState).forEach(([key, value]) => {
          if (value === undefined || value === null || value === "") return
          if (Array.isArray(value)) {
            if (value.length > 0) params.append(key, value.join(","))
          } else {
            params.append(key, String(value))
          }
        })
        const res = await fetch(`/api/events?type=${type}&${params.toString()}`)

        if (res.ok) {
          const json: EventsResponse = await res.json()
          setEvents(json.events || [])
        } else {
          console.error("Failed to fetch events:", res.statusText)
        }
      } catch (err) {
        console.error("Error fetching events:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [filtersState])

  const handlePrev = () => {
    setFiltersState((prev) => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleNext = () => {
    setFiltersState((prev) => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="font-nunito bg-background w-full bg-[url('/assets/events/patterns.svg')] p-4 pt-28 md:p-10 md:pt-30">
      <div className="mb-4 lg:hidden">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              size={"lg"}
              variant="outline"
              className="flex items-center gap-2 rounded-full border-2 border-black bg-white text-black hover:bg-gray-100"
            >
              <FilterIcon className="h-4 w-4" />
              <span>Show Filters</span>
            </Button>
          </DrawerTrigger>
          <DrawerOverlay className="fixed inset-0 z-50 bg-black/60" />
          <DrawerContent>
            <div className="mx-auto max-h-[85vh] w-full max-w-sm overflow-y-auto p-4 pb-8">
              <div className="hidden">
                <DrawerTitle>Event Filters</DrawerTitle>
                <DrawerDescription>
                  Adjust settings to find events
                </DrawerDescription>
              </div>
              <EventsFilter
                currentFilters={filtersState}
                setFilters={setFiltersState}
              />
              <Button
                className="mt-4 w-full bg-black text-white hover:bg-gray-800"
                onClick={() => setIsDrawerOpen(false)}
              >
                Show Results
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      <div className="grid min-h-screen w-full grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="hidden lg:col-span-1 lg:block">
          <div className="min-h-fit overflow-y-auto">
            <EventsFilter
              currentFilters={filtersState}
              setFilters={setFiltersState}
            />
          </div>
        </aside>

        <main className="col-span-1 flex flex-col justify-between lg:col-span-3">
          <div>
            <div className="font-nunito mb-6 text-lg">
              <Navigation state="events" />
            </div>
            <div className="mb-4 flex gap-4 sm:items-center sm:justify-between">
              <SearchAutocomplete
                type={type}
                value={filtersState.club || ""}
                onChange={(val) => setSearchTerm(val)}
              />

              <div className="flex gap-2">
                <div className="flex items-center gap-2">
                  <span className="hidden text-sm font-bold whitespace-nowrap text-gray-700 sm:block">
                    Show:
                  </span>
                  <Select
                    value={filtersState.limit.toString()}
                    onValueChange={(val) =>
                      setFiltersState((prev) => ({
                        ...prev,
                        limit:
                          prev.view === "list"
                            ? Math.max(20, Number(val))
                            : Number(val),
                        offset: 0,
                      }))
                    }
                  >
                    <SelectTrigger className="w-20 rounded-full border-2 border-black bg-white focus:ring-0">
                      <SelectValue placeholder="10" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      align="end"
                      className="rounded-sm border-2 border-black"
                    >
                      {filtersState.view === "card" ? (
                        <SelectItem value="10">10</SelectItem>
                      ) : null}
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-1 rounded-full border-2 border-black bg-white px-2">
                  <div
                    className={`rounded-full px-1 py-1 text-black transition-colors duration-300 hover:bg-black/70 hover:text-white ${filtersState.view === "card" ? "bg-black text-white" : ""}`}
                  >
                    <LayoutGrid
                      className={`h-4 w-4`}
                      onClick={() => {
                        sendGAEvent("event", "button_click", {
                          location: "events_page",
                          button_name: "switch_to_card",
                        })
                        setFiltersState((prev) => ({
                          ...prev,
                          view: "card",
                          offset: 0,
                          limit: prev.view === "list" ? 10 : 20,
                        }))
                      }}
                    />
                  </div>
                  <div
                    className={`rounded-full px-1 py-1 text-black transition-colors duration-300 hover:bg-black/70 hover:text-white ${filtersState.view === "list" ? "bg-black text-white" : ""}`}
                  >
                    <List
                      className={`h-4 w-4`}
                      onClick={() => {
                        sendGAEvent("event", "button_click", {
                          location: "events_page",
                          button_name: "switch_to_list",
                        })

                        setFiltersState((prev) => ({
                          ...prev,
                          view: "list",
                          offset: 0,
                          limit: prev.view === "list" ? 10 : 20,
                        }))
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="mb-4 flex items-center justify-start gap-2 overflow-x-auto whitespace-nowrap"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {/* <CategoryBadge
                category="Today's Events"
                active={
                  filtersState.eventDate ===
                  new Date().toLocaleDateString("en-CA")
                }
                onClick={() => {
                  const today = new Date().toLocaleDateString("en-CA")
                  setFiltersState((prev) => ({
                    ...prev,
                    eventDate: prev.eventDate === today ? undefined : today,
                    offset: 0,
                    view: "list",
                  }))
                }}
              />

              <CategoryBadge
                category="Tomorrow's Events"
                active={
                  filtersState.eventDate ===
                  new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString(
                    "en-CA",
                  )
                }
                onClick={() => {
                  const tomorrow = new Date(
                    Date.now() + 24 * 60 * 60 * 1000,
                  ).toLocaleDateString("en-CA")

                  setFiltersState((prev) => ({
                    ...prev,
                    eventDate:
                      prev.eventDate === tomorrow ? undefined : tomorrow,
                    offset: 0,
                    view: "list",
                  }))
                }}
              /> */}
              {dayBadges.map((day) => (
                <CategoryBadge
                  key={day.date}
                  category={day.label}
                  active={filtersState.eventDate === day.date}
                  onClick={() => {
                    setFiltersState((prev) => ({
                      ...prev,
                      eventDate:
                        prev.eventDate === day.date ? undefined : day.date,
                      offset: 0,
                      view: "list",
                    }))
                  }}
                />
              ))}

              {[...pinnedCategories]
                .sort(
                  (a, b) =>
                    (filtersState.category?.includes(b) ? 1 : 0) -
                    (filtersState.category?.includes(a) ? 1 : 0),
                )
                .map((category) => (
                  <CategoryBadge
                    key={category}
                    category={category}
                    active={filtersState.category?.includes(category)}
                    onClick={() => {
                      setFiltersState((prev) => ({
                        ...prev,
                        category: prev.category?.includes(category)
                          ? prev.category.filter((c) => c !== category)
                          : [...(prev.category || []), category],
                        offset: 0,
                      }))
                    }}
                  />
                ))}

              {filtersState.category
                ?.filter((c) => !pinnedCategories.includes(c))
                .sort(
                  (a, b) =>
                    (filtersState.category?.includes(b) ? 1 : 0) -
                    (filtersState.category?.includes(a) ? 1 : 0),
                )
                .map((category) => (
                  <CategoryBadge
                    key={category}
                    category={category}
                    active
                    onClick={() => {
                      setFiltersState((prev) => ({
                        ...prev,
                        category: prev.category
                          ? prev.category.filter((c) => c !== category)
                          : [],
                        offset: 0,
                      }))
                    }}
                  />
                ))}
            </div>

            {loading && events.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-xl font-bold text-gray-900">
                  Loading Events...
                </p>
                <p className="text-gray-500">
                  Please wait while we fetch the latest events for you.
                </p>
              </div>
            )}

            {filtersState.view === "card" && events.length > 0 && (
              <div
                className={`grid grid-cols-1 gap-6 transition-opacity duration-200 sm:grid-cols-2 lg:grid-cols-1 ${loading ? "pointer-events-none opacity-50" : "opacity-100"}`}
              >
                {events.map((event) => (
                  <EventCard key={event.pid} event={event} type={type} />
                ))}
              </div>
            )}

            {filtersState.view === "list" && events.length > 0 && (
              <EventList events={events} />
            )}

            {!loading && events.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                {filtersState.eventDate ? (
                  <p className="text-xl font-bold text-gray-900">
                    No events happening this day.
                  </p>
                ) : (
                  <p className="text-xl font-bold text-gray-900">
                    No events found.
                  </p>
                )}
                {filtersState.eventDate ? (
                  <p className="text-gray-500">
                    There are no events scheduled for this day.
                  </p>
                ) : (
                  <p className="text-gray-500">
                    Try adjusting your filters or search terms.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="mt-10 flex items-center justify-between border-t-2 border-black pt-6">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={filtersState.offset === 0 || loading}
              className="hover:bg-chart-6 flex items-center gap-2 rounded-full border-2 border-black px-6 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm font-bold">
              Showing {filtersState.offset + 1}-
              {filtersState.offset + events.length}
            </span>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={events.length < filtersState.limit || loading}
              className="hover:bg-chart-6 flex items-center gap-2 rounded-full border-2 border-black px-6 disabled:opacity-50"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EventsView
