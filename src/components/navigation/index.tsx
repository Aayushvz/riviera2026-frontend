"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function Navigation({
  state,
  type = "internal",
  name = null,
}: {
  state: "events" | "event"
  type?: "internal" | "external"
  name?: null | string
}) {
  const eventLink = type === "internal" ? "/events" : "/external-events"

  return (
    <Breadcrumb className="mb-3">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            href={state === "events" ? eventLink : "#"}
            useBack={state === "event"}
            fallbackHref={eventLink}
          >
            {type === "internal" ? "Events Page" : "External Events Page"}
          </BreadcrumbLink>
        </BreadcrumbItem>
        {state === "event" && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {(name &&
                  name[0].toUpperCase() + name.slice(1).toLowerCase()) ||
                  "Event Details"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
