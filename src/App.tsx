import React, { useRef, useEffect } from 'react'
import { useSinglePrismicDocument } from '@prismicio/react'
import {
  Header,
  Section,
  ThreeBackground
} from './components'
import './App.css'

function App() {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [ document, { state } ] = useSinglePrismicDocument('homepage')
  const data = document?.data

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
      <ThreeBackground loaded={state === 'loaded'} scrollRef={scrollRef} />
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
        </Section>
        <Section headline="Featured Work">
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
        </Section>
        <Section headline="Clients">
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
        </Section>
        <Section headline="Contact">
          <ul>
            <li>tom@tommetzmedia.com</li>
          </ul>
        </Section>
      </div>
    </div>
  )
}

export default App