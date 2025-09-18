import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface SphereData {
  mesh: THREE.Mesh;
  velocity: THREE.Vector3;
  mass: number;
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
  const scaleAmt = 0.0025
  
  // Gravity physics config
  const gravitationalConstant = 0.001
  const damping = 0.99

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
    if (distanceMagnitude < 0.1) return new THREE.Vector3(0, 0, 0)
    
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
      
      // Shrink spheres over time and update mass
      const currentScale = sphereA.mesh.scale.x
      if (currentScale > sphereRadiusMin) {
        const newScale = currentScale - scaleAmt
        sphereA.mesh.scale.setScalar(newScale)
        // Update mass based on volume (mass ∝ radius³)
        sphereA.mass = newScale * newScale * newScale
      } else {
        // Reset sphere
        sphereA.mesh.scale.setScalar(1)
        const position = getRandomPosition()
        sphereA.mesh.position.set(position[0], position[1], position[2])
        sphereA.velocity.set(0, 0, 0)
        sphereA.mass = 1 // Reset mass
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
            <mesh ref={el => {
              if (el) {
                sphereRefs.current[i] = el
                // Initialize sphere data
                sphereData.current[i] = {
                  mesh: el,
                  velocity: new THREE.Vector3(0, 0, 0),
                  mass: 1 // Initial mass, will be updated based on scale
                }
              }
            }}>
              <sphereGeometry args={[sphereRadius, 16, 16]} />
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