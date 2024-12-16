import React, { useRef, useEffect } from 'react'
import { useSinglePrismicDocument } from '@prismicio/react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import './App.css'

const BackgroundScene = ({ scrollRef }: { scrollRef: React.RefObject<number> }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Use scrollRef inside the animation loop
  useFrame(() => {
    if (meshRef.current && scrollRef.current !== undefined && scrollRef.current !== null) {
      meshRef.current.rotation.y = scrollRef.current * 0.001;
      meshRef.current.position.y = scrollRef.current * 0.01;
    }
  })

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        // @ts-ignore
        color="#999999" 
        flatShading={true} 
      />
    </mesh>
  );
};

function App() {
  const container = React.useRef<HTMLDivElement>(null)
  const [ document, { state } ] = useSinglePrismicDocument('homepage')
  const data = document?.data

  // Fade in container when prismic document is loaded
  React.useEffect(() => {
    if (state === 'loaded') container.current?.classList.add('fade-in')
  }, [state])

  // Track scroll position
  const scrollValue = useRef(0)
  useEffect(() => {
    const handleScroll = () => {
      if (container.current) scrollValue.current = container.current.scrollTop
    }
    const theContainer = container.current
    if (theContainer) {
      theContainer.addEventListener("scroll", handleScroll)
      return () => theContainer?.removeEventListener("scroll", handleScroll)
    }
  }, [])
  
  return (
    <div id="wrap">
      <Canvas
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
        <directionalLight 
          position={[0, 0, 5]} // Position the light in front of the camera
          intensity={1.5} 
        />
        <directionalLight 
          position={[-5, -5, -5]} // Secondary light from the back
          intensity={0.5} 
        />
        <BackgroundScene scrollRef={scrollValue} />
      </Canvas>
      <div ref={container} id="container">
        <header>
          <h1 id="logo">
            {data?.headline[0].text}
          </h1>
          <h1 id="tagline-a">
            {data?.tagline_a[0].text}
          </h1>
          <h1 id="tagline-b">
            {data?.tagline_b[0].text}
          </h1>
        </header>
        <div className="section">
          <h2>About:</h2>
          <ul>
            <li>
              <img id="about-picture" src={data?.about_picture.url} />
            </li>
            <li id="about-text">
              <div dangerouslySetInnerHTML={{__html: data?.about_text[0].text}} />
            </li>
          </ul>
        </div>
        <div className="section">
          <h2>Services:</h2>
          <ul id="services">
            {data?.services.map((service: any, index: number) => (
              <li key={index}>
                {service.service[0].text}
              </li>
            ))}
          </ul>
          <ul id="tools">
            <li>
              <span className="strong">My Tools: </span>
              <span id="tools-list">
                {data?.tools_list[0].text}
              </span>
            </li>
          </ul>
        </div>
        <div className="section">
          <h2>Featured Work:</h2>
          <ul id="projects">
            {data?.projects.map((project: any, index: number) => (
              <li key={index}>
                <a href={project.project_link.url} target="_blank" className="work">
                  {project.project_image.url && <img src={project.project_image.url} />}
                </a>
                <a href={project.project_link.url} target="_blank" className="strong">{project.project_link_title[0].text}</a>
                : {project.project_description[0].text}
              </li>
            ))}
          </ul>
        </div>
        <div className="section">
          <h2>Clients:</h2>
          <ul>
            <li>
              <span className="strong">Past/Present:</span><br />
              <div id="ongoing-clients">
                {data?.ongoing_clients.map((client: any, index: number) => (
                  <span key={index}>
                    <a href={client.ongoing_clients_link.url} target="_blank">{client.ongoing_clients_title[0].text}</a>
                    {index < data.ongoing_clients.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </li>
          </ul>
        </div>
        <div className="section">
          <h2>Contact:</h2>
          <ul>
            <li>tom@tommetzmedia.com</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default App