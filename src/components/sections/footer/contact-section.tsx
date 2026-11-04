"use client"
import React from "react"
import Image from "next/image"
import Visualizer from "@/components/sections/footer/visualizer"
import { FaInstagram, FaLinkedin, FaYoutube, FaFacebook } from "react-icons/fa"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ContactSection() {
  const socials = [
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/rivieravituniversity",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/school/riviera-vit-university/",
    },
    { icon: FaYoutube, href: "https://www.youtube.com/@RivieraVITUniversity" },
    {
      icon: FaFacebook,
      href: "https://www.facebook.com/rivieravituniversity/",
    },
  ]

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 py-2 text-center md:py-0 lg:py-2">
      <div className="relative h-auto w-full max-w-md">
        <div className="font-nunito pt-4 text-2xl font-bold text-black md:text-3xl lg:text-4xl xl:text-white">
          <p>Dr. Belwin Edward J.</p>
          <p className="text-lg opacity-90 md:text-xl lg:text-2xl">
            Convenor, Riviera
          </p>
          <a
            href="mailto:convenor.riviera@vit.ac.in"
            className="block text-lg hover:underline md:text-xl lg:text-2xl"
          >
            convenor.riviera@vit.ac.in
          </a>
          <a
            href={`/faq?question=ohmFXt`}
            className="text-base hover:underline md:text-lg lg:text-xl"
          >
            For more queries
            <ArrowRight className="inline h-4 w-4 rotate-[-45deg] md:h-5 md:w-5 lg:h-6 lg:w-6" />
          </a>
        </div>
      </div>

      <div className="relative h-auto w-full max-w-md">
        <div className="hidden h-full w-110 xl:block">
          <Visualizer className="h-full w-full" />
        </div>

        <div className="flex h-full w-full items-center justify-center xl:hidden">
          <div className="relative h-16 w-48">
            <Image
              src="/logos/riviera-2026-logo-black.svg"
              alt="Riviera Logo"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex gap-5">
        {socials.map(({ icon: Icon, href }, i) => (
          <Link
            key={i}
            href={href}
            className="rounded-sm border-b-7 border-[#B3C4DE] bg-white p-2 shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] transition-transform hover:scale-105"
          >
            <Icon className="h-9 w-10 text-black" />
          </Link>
        ))}
      </div>
    </div>
  )
}
