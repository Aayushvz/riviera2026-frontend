import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"

import Navbar from "@/components/sections/navbar"
import Preloader from "@/components/preloader"
import { GoogleAnalytics } from "@next/third-parties/google"
import CustomCursor from "@/components/custom-cursor"
import Footer from "@/components/sections/footer"
import FooterExtraSpace from "@/components/sections/footer/footer-extra-space"
import MarqueeCustom from "@/components/marquee"
import { LenisProvider } from "@/context/LenisContext"

const bebasNeue = localFont({
  src: "./fonts/Bebas.ttf",
  variable: "--font-bebas",
})

const bebasNeueRounded = localFont({
  src: "./fonts/BebasNeueRounded.ttf",
  variable: "--font-bebas-rounded",
})

const nunito = localFont({
  src: "./fonts/Nunito.ttf",
  variable: "--font-nunito",
})

const digital = localFont({
  src: "./fonts/DS_DIGI/DS_DIGI.ttf",
  variable: "--font-digital",
})

const digitalBold = localFont({
  src: "./fonts/DS_DIGI/DS_DIGI.ttf",
  variable: "--font-digital-bold",
})

const neoPixel = localFont({
  src: "./fonts/neopixel.otf",
  variable: "--font-neopixel",
})

const bebasRounded = localFont({
  src: "./fonts/BebasNeueRounded.ttf",
  variable: "--font-bebas-rounded",
})

const NEOPIXEL = localFont({
  src: "./fonts/NEOPIXEL.ttf",
  variable: "--font-neopixel",
})

const Koloss = localFont({
  src: "./fonts/Koloss.ttf",
  variable: "--font-koloss",
})

const ogImage = "https://i.postimg.cc/mkwh9Vbk/og-image-(1).png"

export const metadata: Metadata = {
  metadataBase: new URL("https://riviera.vit.ac.in"),
  title: {
    default: "Riviera 2026 | VIT Vellore",
    template: "%s | Riviera 2026",
  },
  description:
    "Experience Riviera 2026, VIT Vellore's premier Annual International Sports and Cultural Festival. Join thousands of participants from colleges worldwide for four days of exhilarating events, competitions, and performances. Register now for an unforgettable celebration of talent and diversity!",
  keywords: [
    "Riviera 2026",
    "VIT Vellore",
    "cultural festival",
    "sports festival",
    "college fest",
    "international festival",
    "student events",
    "competitions",
    "performances",
    "talent showcase",
    "cultural diversity",
    "sports competitions",
    "art exhibitions",
    "music concerts",
    "dance performances",
    "literary events",
    "technical competitions",
    "workshops",
    "seminars",
    "guest lectures",
    "college life",
    "student activities",
    "youth festival",
    "inter-college events",
    "academic conferences",
  ],
  authors: [{ name: "VIT Vellore" }],
  creator: "VIT Vellore",
  publisher: "VIT Vellore",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title:
      "Riviera 2026 | VIT Vellore's Annual International Sports and Cultural Festival",
    description:
      "Join the excitement at Riviera 2026, VIT Vellore's flagship event featuring international sports competitions, cultural performances, and innovative showcases. Register now for four days of non-stop action and creativity!",
    url: ogImage,
    siteName: "Riviera 2026",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Riviera 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Riviera 2026 | VIT Vellore's Annual Festival",
    description:
      "Experience the thrill of Riviera 2026, VIT's international sports and cultural extravaganza. Join us for four days of competitions, performances, and unforgettable memories!",
    images: [ogImage],
    creator: "@VIT_univ",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://riviera.vit.ac.in",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${bebasNeue.variable} ${bebasNeueRounded.variable} ${nunito.variable} ${bebasRounded.variable} ${NEOPIXEL.variable} ${Koloss.variable} ${digital.variable} ${digitalBold.variable} ${neoPixel.variable} max-h-full antialiased`}
      >
        <LenisProvider>
          <Navbar />
          <Preloader />
          <div className="relative z-20">
            {children}
            <MarqueeCustom words={["RISE", "RUSH", "REVEL"]} />
          </div>
        </LenisProvider>
        <FooterExtraSpace />
        <footer className="fixed bottom-0 left-0 z-0 w-full">
          <Footer />
        </footer>
        <CustomCursor />
      </body>
      <GoogleAnalytics gaId="G-0PP10KNP71" />
    </html>
  )
}
