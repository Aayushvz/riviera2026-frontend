"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Slot } from "@radix-ui/react-slot"
import { ChevronRight, MoreHorizontal } from "lucide-react"

import { cn } from "@/lib/utils"

function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  asChild,
  className,
  useBack = false,
  fallbackHref = "/",
  onClick,
  ...props
}: React.ComponentProps<"a"> & {
  asChild?: boolean
  useBack?: boolean
  fallbackHref?: string
}) {
  const router = useRouter()
  const Comp = asChild ? Slot : "a"

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (useBack) {
      e.preventDefault()
      // Check if there's a valid history to go back to
      if (window.history.length > 1) {
        router.back()
      } else {
        // Fallback to href if no history available
        router.push(fallbackHref)
      }
    }

    // Call custom onClick handler if provided
    if (onClick) {
      onClick(e)
    }
  }

  // If useBack is true, don't use href (rely on onClick)
  const linkProps = useBack
    ? { ...props, onClick: handleClick, role: "button" }
    : { ...props, href: props.href, onClick: handleClick }

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "hover:text-foreground cursor-pointer transition-colors",
        className,
      )}
      {...linkProps}
    />
  )
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal capitalize", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
