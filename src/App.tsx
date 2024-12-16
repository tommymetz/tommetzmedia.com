import React from 'react'
import { useSinglePrismicDocument } from "@prismicio/react";
import './App.css'

function App() {
  const [ document, { state } ] = useSinglePrismicDocument('homepage')
  const data = document?.data

  // Fade in container when prismic document is loaded
  const container = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (state === 'loaded')  container.current?.classList.add('fade-in')
  }, [state])
  
  return (
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
  )
}

export default App