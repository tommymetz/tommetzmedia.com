import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SphereData {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  mass: number;
  shrinkRate: number;
}

const BackgroundScene = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const groupRef = useRef<THREE.Group>(null);
  const sphereRefs = useRef<THREE.Mesh[]>([]);
  const sphereData = useRef<SphereData[]>([]);

  // Config
  const count = 20
  const xPos = 2
  const yPos = -1.25
  const zPos = 0
  const xWidth = 15
  const yHeight = 12
  const zDepth = 8
  const sphereRadiusRange = 0.25
  const sphereRadiusMin = 0.03
  
  // Color palette and weights (tune here)
  // "Most" stay gray, use primary blue a lot, pea green and soft blue just a little
  const colorWeights = {
    gray: 0.6,          // majority
    primaryBlue: 0.3,   // a lot
    peaGreen: 0.05,     // a little
    softBlue: 0.05      // a little
  }
  const COLORS = {
    gray: 'lightgray',       // existing gray
    primaryBlue: '#1f94b5',  // Primary blue
    peaGreen: '#9a9e4f',     // Pea green
    softBlue: '#bdd1c9'      // Soft blue
  }
  const pickWeightedColor = () => {
    const r = Math.random()
    if (r < colorWeights.gray) return COLORS.gray
    if (r < colorWeights.gray + colorWeights.primaryBlue) return COLORS.primaryBlue
    if (r < colorWeights.gray + colorWeights.primaryBlue + colorWeights.peaGreen) return COLORS.peaGreen
    return COLORS.softBlue
  }
  
  // Gravity physics config
  const gravitationalConstant = 0.0025
  const damping = 0.98

  const getRandomPosition = () => {
    const x = Math.random() * xWidth - xWidth / 2
    const y = Math.random() * yHeight - yHeight / 2
    const z = Math.random() * zDepth - zDepth / 2
    return [x, y, z] as [number, number, number] 
  }

  // Calculate gravitational force between two spheres
  const calculateGravitationalForce = (sphere1: SphereData, sphere2: SphereData) => {
    const pos1 = sphere1.mesh.position
    const pos2 = sphere2.mesh.position
    
    // Calculate distance vector
    const distance = new THREE.Vector3().subVectors(pos2, pos1)
    const distanceMagnitude = distance.length()
    
    // Prevent division by zero and extreme forces
    if (distanceMagnitude < 0.3) return new THREE.Vector3(0, 0, 0)
    
    // Calculate gravitational force magnitude: F = G * (m1 * m2) / r^2
    const forceMagnitude = gravitationalConstant * (sphere1.mass * sphere2.mass) / (distanceMagnitude * distanceMagnitude)
    
    // Direction vector (normalized)
    const forceDirection = distance.normalize()
    
    // Apply force
    return forceDirection.multiplyScalar(forceMagnitude)
  }

  // Animation loop
  useFrame(() => {
    // Group scroll position
    if (groupRef.current && scrollRef.current !== undefined && scrollRef.current !== null) {
      groupRef.current.position.y = scrollRef.current * 0.0005 + yPos
    }

    // Physics simulation
    sphereData.current.forEach((sphereA, indexA) => {
      // Reset force accumulator
      const totalForce = new THREE.Vector3(0, 0, 0)
      
      // Calculate gravitational forces from all other spheres
      sphereData.current.forEach((sphereB, indexB) => {
        if (indexA !== indexB) {
          const force = calculateGravitationalForce(sphereA, sphereB)
          totalForce.add(force)
        }
      })
      
      // Update velocity (F = ma, so a = F/m)
      const acceleration = totalForce.divideScalar(sphereA.mass)
      sphereA.velocity.add(acceleration)
      
      // Apply damping to prevent runaway velocities
      sphereA.velocity.multiplyScalar(damping)
      
      // Update position
      sphereA.mesh.position.add(sphereA.velocity)
      
      // Boundary checks - wrap around or bounce
      if (sphereA.mesh.position.x > xWidth / 2) sphereA.mesh.position.x = -xWidth / 2
      if (sphereA.mesh.position.x < -xWidth / 2) sphereA.mesh.position.x = xWidth / 2
      if (sphereA.mesh.position.y > yHeight / 2) sphereA.mesh.position.y = -yHeight / 2
      if (sphereA.mesh.position.y < -yHeight / 2) sphereA.mesh.position.y = yHeight / 2
      if (sphereA.mesh.position.z > zDepth / 2) sphereA.mesh.position.z = -zDepth / 2
      if (sphereA.mesh.position.z < -zDepth / 2) sphereA.mesh.position.z = zDepth / 2
      
      // Shrink spheres over time (per-sphere rate) and update mass
      const currentScale = sphereA.mesh.scale.x
      if (currentScale > sphereRadiusMin) {
        const newScale = currentScale - sphereA.shrinkRate
        sphereA.mesh.scale.setScalar(newScale)
        // Update mass based on volume (mass ∝ radius³) with a multiplier for more dramatic effect
        sphereA.mass = Math.max(0.1, (newScale * newScale * newScale) * 5)
      } else {
        // Reset sphere
        const resetScale = Math.random() * 0.6 + 0.4 // 0.4 - 1.0
        sphereA.mesh.scale.setScalar(resetScale)
        const position = getRandomPosition()
        sphereA.mesh.position.set(position[0], position[1], position[2])
        // Reset velocity with small random component
        sphereA.velocity.set(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        )
        // Give each reset a fresh shrink rate and mass based on scale
        sphereA.shrinkRate = Math.random() * 0.003 + 0.001  // 0.001 - 0.004
        sphereA.mass = Math.max(0.1, (resetScale * resetScale * resetScale) * 5)
      }
    });
  })

  return (
    <group ref={groupRef} position={[xPos, 0/* overridden above */, zPos]}>
      {[...Array(count)].map((_, i) => {
        const position = getRandomPosition()
        const sphereRadius = Math.random() * (sphereRadiusRange - sphereRadiusMin) + sphereRadiusMin
        const sphereColor = pickWeightedColor()
        return (
          <group position={position} key={i}>
            <mesh ref={el => {
              if (el) {
                sphereRefs.current[i] = el
                // Initialize sphere data with small random velocity
                const randomVelocity = new THREE.Vector3(
                  (Math.random() - 0.5) * 0.01,
                  (Math.random() - 0.5) * 0.01,
                  (Math.random() - 0.5) * 0.01
                )
                // Randomize initial scale so spheres start out-of-phase
                const initialScale = Math.random() * 0.6 + 0.4 // 0.4 - 1.0
                el.scale.setScalar(initialScale)
                sphereData.current[i] = {
                  mesh: el,
                  velocity: randomVelocity,
                  // Mass based on scale^3 (scaled for effect)
                  mass: Math.max(0.1, (initialScale * initialScale * initialScale) * 5),
                  // Each sphere gets its own shrink rate so lifecycles are desynchronized
                  shrinkRate: Math.random() * 0.003 + 0.001 // 0.001 - 0.004
                }
              }
            }}>
              <sphereGeometry args={[sphereRadius, 16, 16]} />
              <meshStandardMaterial color={sphereColor} flatShading={true} />
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
      <ambientLight intensity={1.8} />
      <hemisphereLight color="#ffffff" groundColor="#666666" intensity={0.6} />
      {/* <directionalLight position={[0, 0, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} /> */}
      <BackgroundScene scrollRef={scrollRef} />
    </Canvas>
  )
}