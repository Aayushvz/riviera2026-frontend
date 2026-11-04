import AboutSection from "@/components/sections/about"
import PreviousProshows from "@/components/sections/about/previous-proshows"
import Hero from "../components/sections/hero/index"
import React from "react"

import ScrollHandler from "@/components/transitions/scroll-handler"
import { Suspense } from "react"
import HeroCircularCursor from "@/components/custom-cursor/hero-cursor"
import ProshowsSection from "@/components/sections/proshows"
import SponsorSection from "@/components/sections/sponsers/main"
import CategorySection from "@/components/sections/category"
import Inauguration from "@/components/sections/inaugural"

export default function page() {
  return (
    <div className="bg-hero-fg">
      <HeroCircularCursor>
        <Hero />
      </HeroCircularCursor>
      <AboutSection />
      <SponsorSection />
      <Inauguration />
      <ProshowsSection />
      <CategorySection />
      <PreviousProshows />
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
    </div>
  )
}
