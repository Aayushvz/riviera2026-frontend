"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense } from "react"
import Loader from "./Loader"

export function ThreeCanvas({
  children,
  showLoader = true,
}: {
  children: React.ReactNode
  showLoader?: boolean
}) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="city" />

      <Suspense fallback={showLoader ? <Loader /> : null}>{children}</Suspense>

      <OrbitControls
        enablePan
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enableZoom={false}
        autoRotate
        rotateSpeed={1}
      />
    </Canvas>
  )
}
