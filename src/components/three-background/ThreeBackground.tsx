import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BackgroundScene = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRefs = useRef<THREE.Mesh[]>([]);

  // Config
  const count = 20
  const xPos = 2
  const yPos = -1.25
  const zPos = 0
  const xWidth = 15
  const yHeight = 12
  const zDepth = 8
  const sphereRadiusRange = 0.06
  const sphereRadiusMin = 0.03
  const scaleAmt = 0.0025

  const getRandomPosition = () => {
    const x = Math.random() * xWidth - xWidth / 2
    const y = Math.random() * yHeight - yHeight / 2
    const z = Math.random() * zDepth - zDepth / 2
    return [x, y, z] as [number, number, number] 
  }

  // Animation loop
  useFrame(() => {
    // Group scroll position
    if (groupRef.current && scrollRef.current !== undefined && scrollRef.current !== null) {
      groupRef.current.position.y = scrollRef.current * 0.0005 + yPos
    }

    // Shrink spheres over time
    sphereRefs.current.forEach((sphere) => {
      const radius = sphere.geometry.boundingSphere?.radius || sphereRadiusMin
      const scale = (radius - sphereRadiusMin / sphereRadiusRange) * scaleAmt + scaleAmt
      if (sphere.scale.x > sphereRadiusMin) {
        sphere.scale.x -= scale;
        sphere.scale.y -= scale;
        sphere.scale.z -= scale;
      } else {
        sphere.scale.x = 1
        sphere.scale.y = 1
        sphere.scale.z = 1
        const position = getRandomPosition()
        sphere.position.x = position[0]
        sphere.position.y = position[1]
        sphere.position.z = position[2]
      }
    });
  })

  return (
    <group ref={groupRef} position={[xPos, 0/* overridden above */, zPos]}>
      {[...Array(count)].map((_, i) => {
        const position = getRandomPosition()
        const sphereRadius = Math.random() * (sphereRadiusRange - sphereRadiusMin) + sphereRadiusMin
        return (
          <group position={position} key={i}>
            <mesh ref={el => el && (sphereRefs.current[i] = el)}>
              <circleGeometry args={[sphereRadius, 20]} />
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