"use client"

import Image from "next/image"
import React from "react"

interface ActionMusicButtonProps {
  className?: string
  animate?: boolean
  type?: "primary" | "secondary"
  text?: string
  onClick?: () => void
}

const ActionMusicButton: React.FC<ActionMusicButtonProps> = ({
  className = "",
  animate = false,
  type = "primary",
  text = "EVENTS",
  onClick,
}) => {
  const isPrimary = type === "primary"
  const pillBgColor = isPrimary ? "#9270cb" : "#f4e100"
  const waveBgColor = isPrimary ? "#9270cb" : "#f4e100"
  const iconColor = isPrimary ? "#ffffff" : "#000000"

  return (
    <>
      <style jsx>{`
        .music-component {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .music-component:hover {
          transform: scale(1.05);
        }

        .wave-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          height: 100%;
        }

        .wave-group.left {
          flex-direction: row-reverse;
          margin-right: -4px;
        }

        .wave-group.right {
          margin-left: -4px;
        }

        .bar {
          background-color: ${waveBgColor};
          border-radius: 50%;
          flex-shrink: 0;
          transform-origin: center;
        }

        .bar.animate {
          animation: vibe 1.2s infinite ease-in-out;
        }

        .bar.animateFirst {
          animation: vibeFirst 1s infinite ease-in-out;
        }

        /* Mobile-first bar sizes */
        .bar:nth-child(1) {
          width: 10px;
          height: 40px;
          animation-delay: 0s;
        }

        .bar:nth-child(2) {
          width: 8px;
          height: 30px;
          animation-delay: 0.2s;
          margin: 0 -3px;
        }

        .bar:nth-child(3) {
          width: 6px;
          height: 20px;
          margin: 0 1px;
          animation-delay: 0.4s;
        }

        .music-pill {
          background-color: ${pillBgColor};
          padding: 5px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          color: #000000;
          border: none;
          cursor: pointer;
        }

        .album-cover {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-shrink: 0;
        }

        .album-cover.animate {
          animation: spin 2s linear infinite;
        }

        .play-icon {
          width: 20px;
          height: 20px;
          background-color: ${iconColor};
          border-radius: 50%;
        }

        .track-details {
          display: flex;
          flex-direction: column;
          justify-content: center;
          line-height: 1.3;
        }

        .song-title {
          font-weight: 400;
          letter-spacing: -0.3px;
          color: #000;
        }

        /* Tablet and up */
        @media (min-width: 640px) {
          .wave-group.left {
            margin-right: -5px;
          }

          .wave-group.right {
            margin-left: -5px;
          }

          .bar:nth-child(1) {
            width: 14px;
            height: 50px;
          }

          .bar:nth-child(2) {
            width: 10px;
            height: 38px;
            margin: 0 -4px;
          }

          .bar:nth-child(3) {
            width: 7px;
            height: 25px;
            margin: 0 1.5px;
          }

          .music-pill {
            padding: 5.5px;
            border-radius: 11px;
            gap: 5px;
          }

          .album-cover {
            width: 38px;
            height: 38px;
          }

          .play-icon {
            width: 24px;
            height: 24px;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .wave-group.left {
            margin-right: -6px;
          }

          .wave-group.right {
            margin-left: -6px;
          }

          .bar:nth-child(1) {
            width: 16px;
            height: 60px;
          }

          .bar:nth-child(2) {
            width: 12px;
            height: 45px;
            margin: 0 -5px;
          }

          .bar:nth-child(3) {
            width: 8px;
            height: 30px;
            margin: 0 2px;
          }

          .music-pill {
            padding: 6px;
            border-radius: 12px;
            gap: 0px;
          }

          .album-cover {
            width: 42px;
            height: 42px;
          }

          .play-icon {
            width: 30px;
            height: 30px;
          }
        }

        @keyframes vibe {
          0%,
          100% {
            transform: scaleY(1);
          }
          25% {
            transform: scaleY(1.15);
          }
          50% {
            transform: scaleY(0.9);
          }
          75% {
            transform: scaleY(1.1);
          }
        }

        @keyframes vibeFirst {
          0%,
          100% {
            transform: scaleY(1);
          }
          25% {
            transform: scaleY(1.05);
          }
          50% {
            transform: scaleY(0.97);
          }
          75% {
            transform: scaleY(1.03);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div className={`music-component ${className}`} onClick={onClick}>
        <div className="wave-group left">
          <div className={`bar ${animate ? "animateFirst" : ""}`}></div>
          <div className={`bar ${animate ? "animate" : ""}`}></div>
          <div className={`bar ${animate ? "animate" : ""}`}></div>
        </div>

        <div className="music-pill">
          <div
            className={`album-cover ${animate ? "animate" : ""} -ml-2 md:-ml-3`}
          >
            <Image
              src={"/assets/hero/action/radio-middle-btn.svg"}
              alt="Play Icon"
              className={`${type === "secondary" ? "invert-100" : ""} aspect-square w-4 md:w-6`}
              width={20}
              height={20}
            />
          </div>
          <div className="song-title font-bebas-rounded z-10 text-base md:text-lg">
            {text}
          </div>
        </div>

        <div className="wave-group right">
          <div className={`bar ${animate ? "animateFirst" : ""}`}></div>
          <div className={`bar ${animate ? "animate" : ""}`}></div>
          <div className={`bar ${animate ? "animate" : ""}`}></div>
        </div>
      </div>
    </>
  )
}

export default ActionMusicButton
