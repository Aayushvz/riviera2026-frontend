"use client"

import { Html, useProgress } from "@react-three/drei"

export default function Loader() {
  const { progress } = useProgress()

  return (
    <Html center>
      <div className="loader-wrapper">
        <div className="circle-loader" />
        <p>{progress.toFixed(0)}%</p>
      </div>

      <style jsx>{`
        .loader-wrapper {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: gray;
          font-weight: 600;
        }

        .circle-loader {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 6px solid rgba(255, 255, 255, 0.2);
          border-top: 6px solid gray;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </Html>
  )
}
