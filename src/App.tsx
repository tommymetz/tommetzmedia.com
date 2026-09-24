import React, { useRef, useEffect } from 'react'
import { prismicClient } from './services'
import {
  Header,
  Section,
  ThreeBackground,
  ContentCard,
  backgroundOpacity,
  FlyButton,
} from './components'
import './App.css'
import pkg from '../package.json'
import { FlySplatter } from 'flysplatter'

function App() {
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [prismicDoc, setPrismicDoc] = React.useState<any | null>(null)
  const [state, setState] = React.useState<'idle' | 'loading' | 'loaded' | 'error'>('idle')
  const data = prismicDoc?.data
  const [swarm, setSwarm] = React.useState(false)

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

  // Track scroll position and fade the background out behind the busy card grids
  const scrollRef = useRef(0)
  useEffect(() => {
    const theContainer = containerRef.current
    if (!theContainer) return
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = theContainer
      scrollRef.current = scrollTop
      const featured = document.getElementById('featured-work')
      if (!featured) return
      const opacity = backgroundOpacity({
        scrollTop,
        scrollHeight,
        viewportHeight: clientHeight,
        fadeOutEnd: featured.offsetTop,
      })
      wrapRef.current?.style.setProperty('--bg-opacity', String(opacity))
    }
    theContainer.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleScroll)
    return () => {
      theContainer.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])
  
  return (
    <div ref={wrapRef} id="wrap" data-testid="wrap">
      <FlySplatter
        anchor="page"
        muted
        count={swarm ? 10 : 1}
        initialDelay={swarm ? 100 : 5000}
        spawnDelay={swarm ? 100 : 5000}
      />
      <FlyButton active={swarm} onClick={() => setSwarm((s) => !s)} />
      <ThreeBackground scrollRef={scrollRef} />
      <div ref={containerRef} id="container">
        <Header
          headline={data?.headline[0].text}
          taglineA={data?.tagline_a[0].text}
          taglineB={data?.tagline_b[0].text}
        />
        <Section headline="About" columns={1}>
          <ContentCard image={data?.about_picture.url}>
            {data?.about_text[0].text}
          </ContentCard>
        </Section>
        <Section headline="Services" columns={1}>
          {Array.isArray(data?.services) && data.services.map((service: any, index: number) => (
            <ContentCard key={index}>{service.service[0].text}</ContentCard>
          ))}
        </Section>
        <Section id="featured-work" headline="Featured Work" wide>
          {Array.isArray(data?.projects) && data.projects.map((project: any, index: number) => (
            <ContentCard
              key={index}
              title={project.project_link_title?.[0]?.text}
              link={project.project_link?.url}
              image={project.project_image?.url}
            >
              {project.project_description?.[0]?.text}
            </ContentCard>
          ))}
        </Section>
        <Section headline="Music Production" wide>
          {Array.isArray(data?.music_production) && data.music_production.map((m: any, index: number) => (
            <ContentCard
              key={index}
              title={m.title?.[0]?.text}
              link={m.link?.url}
              image={m.image_link?.url}
            >
              {m.description?.[0]?.text}
            </ContentCard>
          ))}
        </Section>
        <Section headline="Music Mastering" wide>
          {Array.isArray(data?.mastering) && data.mastering.map((m: any, index: number) => (
            <ContentCard
              key={index}
              title={m.title?.[0]?.text}
              link={m.link?.url ?? m.link?.url}
              image={m.image_link?.url ?? m.image_link?.url}
            >
              {m.description?.[0]?.text}
            </ContentCard>
          ))}
        </Section>
        <Section headline="Clients" columns={1}>
          <ContentCard
            title="Past/Present"
          >
            {Array.isArray(data?.ongoing_clients) && data.ongoing_clients.map((client: any, index: number) => (
              <span key={index}>
                <a href={client.ongoing_clients_link.url} target="_blank" rel="noopener noreferrer">{client.ongoing_clients_title[0].text}</a>
                {index < data.ongoing_clients.length - 1 && ', '}
              </span>
            ))}
          </ContentCard>
        </Section>
        <Section headline="Contact">
          <ContentCard>
            <a href="mailto:tom@tommetzmedia.com">tom@tommetzmedia.com</a><br /> 
          </ContentCard>
          <ContentCard>
            <a href="https://github.com/tommymetz" target="_blank" rel="noopener noreferrer">Github</a>
          </ContentCard>
          <div className="site-version">v{pkg.version}</div>
        </Section>
      </div>
    </div>
  )
}

export default App