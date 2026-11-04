import React from "react"
import fs from "fs"
import path from "path"
import ArtistsAnimation from "@/components/artists-animation"

const PreviousProshows = () => {
  const artistsDir = path.join(process.cwd(), "public", "artists")
  let artists: { src: string; alt: string }[] = []

  try {
    const files = fs.readdirSync(artistsDir)
    artists = files
      .filter((file) => /\.(png|jpg|jpeg|webp|gif)$/i.test(file))
      .map((file) => ({
        src: `/artists/${file}`,
        alt: file.replace(/\.[^/.]+$/, ""),
      }))
  } catch (error) {
    console.error("Error reading artists directory:", error)
  }

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
        >
          <source src="/videos/Background.webm" type="video/webm" />
        </video>
      </div>
      <div className="font-bebas absolute top-12 left-8 z-10 flex items-center justify-center gap-1 rounded-full border-[1.5px] border-[#2BA9A8] px-4 py-1 text-center text-2xl leading-none tracking-wide text-[#2BA9A8] uppercase md:left-16 md:text-[32px]">
        previous proshows
      </div>

      <ArtistsAnimation artists={artists} />
    </div>
  )
}

export default PreviousProshows
