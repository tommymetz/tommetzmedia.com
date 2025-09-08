import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface FireworkProps {
  position: [number, number, number]
  onReset: () => void
}

const Firework: React.FC<FireworkProps> = ({ position, onReset }) => {
  const groupRef = useRef<THREE.Group>(null)
  const particleRefs = useRef<THREE.Mesh[]>([])
  const timeRef = useRef(0)
  const explosionTime = useRef(2) // Time for full explosion cycle
  
  const particleCount = 8
  const explosionRadius = 0.8
  const particleSize = 0.02
  
  // Generate random directions for particles
  const directions = useRef(
    Array(particleCount).fill(0).map(() => {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      return new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi)
      ).normalize()
    })
  )
  
  // Random colors for variety
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#a29bfe']
  const fireworkColor = colors[Math.floor(Math.random() * colors.length)]
  
  useFrame((_, delta) => {
    timeRef.current += delta
    
    particleRefs.current.forEach((particle, index) => {
      if (!particle) return
      
      const progress = Math.min(timeRef.current / explosionTime.current, 1)
      const direction = directions.current[index]
      
      // Move particles outward
      const distance = progress * explosionRadius * (0.5 + Math.random() * 0.5)
      particle.position.set(
        direction.x * distance,
        direction.y * distance,
        direction.z * distance
      )
      
      // Fade out over time
      const opacity = Math.max(0, 1 - progress)
      if (particle.material instanceof THREE.MeshStandardMaterial) {
        particle.material.opacity = opacity
      }
      
      // Scale particles
      const scale = Math.max(0.1, 1 - progress * 0.5)
      particle.scale.setScalar(scale)
    })
    
    // Reset when explosion is complete
    if (timeRef.current >= explosionTime.current) {
      timeRef.current = 0
      explosionTime.current = 1.5 + Math.random() * 1 // Vary explosion duration
      onReset()
    }
  })
  
  return (
    <group ref={groupRef} position={position}>
      {Array(particleCount).fill(0).map((_, i) => (
        <mesh
          key={i}
          ref={el => el && (particleRefs.current[i] = el)}
          position={[0, 0, 0]}
        >
          <sphereGeometry args={[particleSize, 8, 8]} />
          <meshStandardMaterial 
            color={fireworkColor}
            transparent
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  )
}

const BackgroundScene = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Config
  const count = 12 // Reduced count since fireworks are more complex
  const xPos = 2
  const yPos = -1.25
  const zPos = 0
  const xWidth = 15
  const yHeight = 12
  const zDepth = 8

  const getRandomPosition = () => {
    const x = Math.random() * xWidth - xWidth / 2
    const y = Math.random() * yHeight - yHeight / 2
    const z = Math.random() * zDepth - zDepth / 2
    return [x, y, z] as [number, number, number] 
  }

  // Store positions for each firework
  const fireworkPositions = useRef<[number, number, number][]>(
    Array(count).fill(null).map(() => getRandomPosition())
  )

  // Animation loop for scroll effect
  useFrame(() => {
    // Group scroll position
    if (groupRef.current && scrollRef.current !== undefined && scrollRef.current !== null) {
      groupRef.current.position.y = scrollRef.current * 0.0005 + yPos
    }
  })

  const handleFireworkReset = (index: number) => {
    fireworkPositions.current[index] = getRandomPosition()
  }

  return (
    <group ref={groupRef} position={[xPos, 0/* overridden above */, zPos]}>
      {[...Array(count)].map((_, i) => (
        <Firework
          key={i}
          position={fireworkPositions.current[i]}
          onReset={() => handleFireworkReset(i)}
        />
      ))}
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