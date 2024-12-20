import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BackgroundScene = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Config
  const count = 20
  const xPos = 2
  const yPos = -1
  const zPos = 0
  const xWidth = 15
  const yHeight = 10
  const zDepth = 4
  const sphereRadiusRange = 0.1
  const sphereRadiusMin = 0.05

  // Animation loop
  useFrame(() => {
    // Group scroll position
    if (groupRef.current && scrollRef.current !== undefined && scrollRef.current !== null) {
      groupRef.current.position.y = scrollRef.current * 0.0005 + yPos
    }
  })

  return (
    <group ref={groupRef} position={[xPos, 0/* overridden above */, zPos]}>
      {[...Array(count)].map((_, i) => {
        const x = Math.random() * xWidth - xWidth / 2
        const y = Math.random() * yHeight - yHeight / 2
        const z = Math.random() * zDepth - zDepth / 2
        const sphereRadius = Math.random() * (sphereRadiusRange - sphereRadiusMin) + sphereRadiusMin
        return (
          <group position={[x, y, z]} key={i}>
            <mesh>
              <circleGeometry args={[sphereRadius, 15]} />
              <meshStandardMaterial color="lightgray" flatShading={true} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export const ThreeBackground = ({ scrollRef }: { scrollRef: React.RefObject<number>}) => {
  return (
    <Canvas
      className="three-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      camera={{
        position: [0, 0, 8],
        fov: 70,
      }}
    >
      <ambientLight intensity={1.5} />
      {/* <directionalLight position={[0, 0, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} /> */}
      <BackgroundScene scrollRef={scrollRef} />
    </Canvas>
  )
}