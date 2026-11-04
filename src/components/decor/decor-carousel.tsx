"use client"

import Image from "next/image"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type DecorCarouselProps = {
  images: string[]
  alt: string
}

export default function DecorCarousel({ images, alt }: DecorCarouselProps) {
  if (!images.length) return null

  return (
    <Carousel className="h-[60%] w-[80%]">
      <CarouselContent className="ml-0">
        {images.map((src, index) => (
          <CarouselItem key={`${src}-${index}`} className="pl-0">
            <div className="relative h-[60vh] w-full">
              <Image
                src={src}
                fill
                alt={alt}
                className="object-contain object-top"
                priority={index === 0}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-purple-s top-[75%] -left-4" />
      <CarouselNext className="bg-purple-s top-[75%] -right-4" />
    </Carousel>
  )
}
