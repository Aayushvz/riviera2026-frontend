"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { FaSpinner } from "react-icons/fa"

export function AnimatedSearchBar({
  loading,
  placeholder = "Search events...",
  value,
  submitted: submitted,
  setSubmitted,
  changeFunc,
  focusFunc,
  onBlur,
  keyDownFunc,
}: {
  loading: boolean
  placeholder?: string
  value: string
  submitted: boolean
  setSubmitted: React.Dispatch<React.SetStateAction<boolean>>
  changeFunc: (val: string) => void
  focusFunc?: () => void
  onBlur?: () => void
  keyDownFunc?: (e: React.KeyboardEvent) => void
}) {
  const [focused, setFocused] = React.useState(false)

  const showAction = focused || value.length > 0

  const submitSearch = () => {
    if (!value.trim()) return
    keyDownFunc && keyDownFunc("Enter" as unknown as React.KeyboardEvent)
    setSubmitted(true)
  }

  const clearSearch = () => {
    changeFunc("")
    setSubmitted(false)
  }

  return (
    <div className="relative w-full max-w-md">
      <div
        className={cn(
          "relative flex h-11 items-center rounded-full border-2 border-black bg-white",
          "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        )}
      >
        {/* LEFT SEARCH ICON */}
        <Search
          className={cn(
            "pointer-events-none absolute left-4 h-4 w-4 text-gray-500",
            "transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            focused ? "-translate-x-6 opacity-0" : "translate-x-0 opacity-100",
          )}
        />

        {/* INPUT */}
        <Input
          value={value}
          placeholder={placeholder}
          onChange={(e) => {
            changeFunc(e.target.value)
            setSubmitted(false)
          }}
          onFocus={() => {
            setFocused(true)
            focusFunc && focusFunc()
          }}
          onBlur={() => {
            setFocused(false)
            onBlur && onBlur()
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              submitSearch()
              keyDownFunc && keyDownFunc(e)
            }
          }}
          className={cn(
            "h-fit w-full rounded-full border-none bg-transparent text-sm",
            "transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            focused ? "pr-14 pl-4" : "pr-10 pl-10",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
          )}
        />

        {/* RIGHT ICON BUTTON */}
        <div
          className={cn(
            "absolute right-1",
            "transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
            showAction
              ? "scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0",
          )}
        >
          <Button
            size="icon-sm"
            variant="outline"
            onClick={submitted ? clearSearch : submitSearch}
            className={cn(
              "transition-c relative flex h-8 w-8 items-center justify-center rounded-full border-black text-white duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
              "overflow-hidden",
              submitted && "bg-red-400 hover:bg-red-500",
              !submitted && "bg-primary hover:bg-primary/90",
            )}
          >
            {/* FLIP ICON */}
            <span
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                "transition-transform duration-500 [transform-style:preserve-3d]",
                submitted && "[transform:rotateX(180deg)]",
              )}
            >
              {/* SEARCH ICON */}
              {loading ? (
                <FaSpinner className="h-4 w-4 animate-spin text-white" />
              ) : (
                <Search className="absolute h-4 w-4 text-white [backface-visibility:hidden]" />
              )}

              {/* CLEAR ICON */}
              <X className="absolute h-4 w-4 [transform:rotateX(180deg)] text-white [backface-visibility:hidden]" />
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
