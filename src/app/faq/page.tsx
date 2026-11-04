import React from "react"
import FAQSection from "@/components/pages/faq"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "FAQ - Riviera 2026 | VIT Vellore",
  description:
    "Find answers to frequently asked questions about Riviera 2026, VIT Vellore's annual techno-cultural fest. Learn about accommodation, transportation, registration, and more.",
}

const FAQPage = () => {
  return (
    <Suspense fallback={null}>
      <FAQSection />
    </Suspense>
  )
}

export default FAQPage
