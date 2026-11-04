"use client"

import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { useEffect, useLayoutEffect, useRef } from "react"

export function GLBModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  onLoad,
}: {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  onLoad?: () => void
}) {
  const { scene } = useGLTF(url)
  const ref = useRef<THREE.Group>(null)

  useEffect(() => {
    if (onLoad) {
      onLoad()
    }
  }, [onLoad])

  useLayoutEffect(() => {
    if (!ref.current) return

    // const box = new THREE.Box3().setFromObject(ref.current)
    // const center = box.getCenter(new THREE.Vector3())

    // pivot correction only
    // ref.current.position.sub(center)
  }, [])

  return (
    <primitive
      ref={ref}
      object={scene.clone()}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  )
}

useGLTF.preload("/assets/models/hoodie.glb")
