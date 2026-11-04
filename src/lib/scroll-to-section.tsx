import gsap from "gsap"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollToPlugin)

export default function scrollToSection(id: string, offsetY: number = 80) {
  const el = document.getElementById(id)
  if (!el) return

  gsap.to(window, {
    scrollTo: {
      y: el,
      offsetY: offsetY,
    },
    duration: 1,
    ease: "power2.out",
  })
}
