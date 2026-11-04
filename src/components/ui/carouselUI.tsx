import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Markdown from "react-markdown"

interface Media {
  type: "image" | "video" | "pdf"
  url: string
  thumbnailUrl?: string
}

// Carousel Component
interface CarouselProps {
  media: Media[]
  content: string
}

export const Carousel = ({ media, content }: CarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length)
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  const currentMedia = media[currentIndex]

  return (
    <div className="flex max-h-[90vh] flex-col">
      {/* Media Display Area */}
      <div className="relative w-full overflow-hidden bg-black">
        <div className="relative flex h-full w-full items-center justify-center">
          {currentMedia.type === "image" && (
            <div className="relative w-full">
              <Image
                src={currentMedia.url}
                alt={content}
                width={50}
                height={100}
                className="aspect-[1350/1080] h-fit w-full object-contain"
              />
            </div>
          )}
          {currentMedia.type === "video" && (
            <video
              src={currentMedia.url}
              controls
              className="h-full w-full object-contain"
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          )}
          {currentMedia.type === "pdf" && (
            // <PdfViewer fileName={currentMedia.url} />
            <Link
              href={currentMedia.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex h-full w-full items-center justify-center"
            >
              <div className="absolute inset-0 top-0 left-0 flex items-center justify-center bg-black/30">
                <div className="flex h-16 w-16 items-center justify-center rounded-full">
                  <svg
                    width="142"
                    height="142"
                    viewBox="0 0 142 142"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M62.125 84.3125C61.2476 84.3121 60.3901 84.0516 59.6607 83.564C58.9314 83.0764 58.3629 82.3835 58.0272 81.5729C57.6915 80.7623 57.6037 79.8704 57.7747 79.0099C57.9458 78.1493 58.3681 77.3588 58.9882 76.7383L102.792 32.9346C100.525 31.7037 97.9858 31.0601 95.4062 31.0625H28.8438C24.726 31.0669 20.7781 32.7046 17.8664 35.6164C14.9546 38.5281 13.3169 42.476 13.3125 46.5938V113.156C13.3169 117.274 14.9546 121.222 17.8664 124.134C20.7781 127.045 24.726 128.683 28.8438 128.688H95.4062C99.524 128.683 103.472 127.045 106.384 124.134C109.295 121.222 110.933 117.274 110.938 113.156V46.5938C110.94 44.0142 110.296 41.4751 109.065 39.2081L65.2618 83.0118C64.8506 83.4249 64.3618 83.7525 63.8234 83.9757C63.2851 84.199 62.7078 84.3135 62.125 84.3125Z"
                      fill="white"
                    />
                    <path
                      d="M124.25 13.3125H93.1875C92.0106 13.3125 90.8819 13.78 90.0497 14.6122C89.2175 15.4444 88.75 16.5731 88.75 17.75C88.75 18.9269 89.2175 20.0556 90.0497 20.8878C90.8819 21.72 92.0106 22.1875 93.1875 22.1875H113.536L102.792 32.9346C105.445 34.3758 107.624 36.5548 109.065 39.2081L119.812 28.4638V48.8125C119.812 49.9894 120.28 51.1181 121.112 51.9503C121.944 52.7825 123.073 53.25 124.25 53.25C125.427 53.25 126.556 52.7825 127.388 51.9503C128.22 51.1181 128.688 49.9894 128.688 48.8125V17.75C128.688 16.5731 128.22 15.4444 127.388 14.6122C126.556 13.78 125.427 13.3125 124.25 13.3125Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </div>
              <Image
                src={currentMedia.thumbnailUrl || "/placeholder.svg"}
                alt="PDF Preview"
                width={1350}
                height={1080}
                className="aspect-[1350/1080] h-auto w-full object-contain"
              />
            </Link>
          )}
        </div>

        {/* Navigation Arrows - Only show if multiple media */}
        {media.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-4 z-10 -translate-y-1/2 rounded-full border-2 border-black bg-white p-3 shadow-[3px_3px_0_0_#000] transition-all hover:scale-105 hover:shadow-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-4 z-10 -translate-y-1/2 rounded-full border-2 border-black bg-white p-3 shadow-[3px_3px_0_0_#000] transition-all hover:scale-105 hover:shadow-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Content and Indicators */}
      <div className="h-auto border-t-2 border-black bg-white p-3 md:p-6">
        <div className="mb-3 text-sm md:mb-6 md:min-h-48 md:text-base">
          <Markdown
            components={{
              p: ({ children }) => <p className="mb-4">{children}</p>,
              ol: ({ children }) => (
                <ol className="mb-4 ml-6 list-decimal space-y-2">{children}</ol>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 ml-6 list-disc space-y-2">{children}</ul>
              ),
              li: ({ children }) => <li className="mb-1">{children}</li>,
              h1: ({ children }) => (
                <h1 className="mt-4 mb-3 text-2xl font-bold">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-4 mb-3 text-xl font-bold">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-3 mb-2 text-lg font-bold">{children}</h3>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-primary underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </Markdown>
        </div>

        {/* Dot Indicators */}
        {media.length > 1 && (
          <div className="flex items-center justify-center gap-2">
            {media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-3 w-3 rounded-full border-2 border-black transition-all ${
                  index === currentIndex ? "bg-black" : "bg-white"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
