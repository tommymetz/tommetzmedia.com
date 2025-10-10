import React, { useRef, useEffect } from 'react'
import { prismicClient } from './services'
import {
  Header,
  Section,
  ThreeBackground
} from './components'
import './App.css'
import pkg from '../package.json'

function App() {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [prismicDoc, setPrismicDoc] = React.useState<any | null>(null)
  const [state, setState] = React.useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const data = prismicDoc?.data

  // Load Prismic singleton document (homepage)
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        setState('loading')
        const doc = await prismicClient.getSingle('homepage')
        if (!cancelled) {
          setPrismicDoc(doc)
          setState('loaded')
        }
      } catch (error) {
        // surface the error for debugging and set error state
        console.error(error)
        if (!cancelled) setState('error')
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])

  // Fade in wrap when prismic document is loaded
  React.useEffect(() => {
    if (state === 'loaded'){
      wrapRef.current?.classList.add('fade-in')
    }
  }, [state])

  // Track scroll position
  const scrollRef = useRef(0)
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) scrollRef.current = containerRef.current.scrollTop
    }
    const theContainer = containerRef.current
    if (theContainer) {
      theContainer.addEventListener("scroll", handleScroll)
      return () => theContainer?.removeEventListener("scroll", handleScroll)
    }
  }, [])
  
  return (
    <div ref={wrapRef} id="wrap">
      <ThreeBackground scrollRef={scrollRef} />
      <div ref={containerRef} id="container">
        <Header
          headline={data?.headline[0].text}
          taglineA={data?.tagline_a[0].text}
          taglineB={data?.tagline_b[0].text}
        />
        <Section headline="About">
          <ul>
            <li>
              <img id="about-picture" src={data?.about_picture.url} />
            </li>
            <li id="about-text">
              <div dangerouslySetInnerHTML={{__html: data?.about_text[0].text}} />
            </li>
          </ul>
        </Section>
        <Section headline="Services">
          <ul id="services">
            {Array.isArray(data?.services) && data.services.map((service: any, index: number) => (
              <li key={index}>
                {service.service[0].text}
              </li>
                ))}
          </ul>
          {/* <ul id="tools">
            <li>
              <span className="strong">My Tools: </span>
              <span id="tools-list">
                {data?.tools_list[0].text}
              </span>
            </li>
          </ul> */}
        </Section>
        <Section headline="Featured Work">
          <ul id="projects">
            {Array.isArray(data?.projects) && data.projects.map((project: any, index: number) => (
              <li key={index}>
                <a href={project.project_link.url} target="_blank" rel="noopener noreferrer" className="work">
                  {project.project_image.url && <img src={project.project_image.url} alt={project.project_link_title?.[0]?.text ?? 'project image'} />}
                </a>
                <a href={project.project_link.url} target="_blank" rel="noopener noreferrer" className="strong">{project.project_link_title[0].text}</a>
                : {project.project_description[0].text}
              </li>
            ))}
          </ul>
        </Section>
        <Section headline="Clients">
          <ul>
            <li>
              <span className="strong">Past/Present:</span><br />
              <div id="ongoing-clients">
                {Array.isArray(data?.ongoing_clients) && data.ongoing_clients.map((client: any, index: number) => (
                  <span key={index}>
                    <a href={client.ongoing_clients_link.url} target="_blank" rel="noopener noreferrer">{client.ongoing_clients_title[0].text}</a>
                    {index < data.ongoing_clients.length - 1 && ', '}
                  </span>
                ))}
              </div>
            </li>
          </ul>
        </Section>
        <Section headline="Contact">
          <ul>
            <li>
              <a href="mailto:tom@tommetzmedia.com">tom@tommetzmedia.com</a><br /> 
              <a href="https://github.com/tommymetz" target="_blank" rel="noopener noreferrer">Github</a>
            </li>
          </ul>
          <div className="site-version">v{pkg.version}</div>
        </Section>
      </div>
    </div>
  )
}

export default App