import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const BackgroundScene = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Use scrollRef inside the animation loop
  useFrame(() => {
    if (meshRef.current && scrollRef.current !== undefined && scrollRef.current !== null) {
      meshRef.current.rotation.y = scrollRef.current * 0.001;
      meshRef.current.position.y = scrollRef.current * 0.001;
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        // @ts-expect-error not sure why this is throwing an error
        color="#999999" 
        flatShading={true} 
      />
    </mesh>
  );
};

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
      camera={{ position: [0, 0, 5] }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[0, 0, 5]} intensity={1.5} />
      <directionalLight position={[-5, -5, -5]} intensity={0.5} />
      <BackgroundScene scrollRef={scrollRef} />
    </Canvas>
  )
}