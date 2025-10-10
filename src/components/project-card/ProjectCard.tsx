import './ProjectCard.css'

export const ProjectCard = ({
  title,
  link,
  image,
  description
}: {
  title?: string
  link?: string
  image?: string
  description?: string
}) => {
  return (
    <div className="project-card">
      <a href={link} target="_blank" rel="noopener noreferrer" className="work">
        {image && <img src={image} alt={title ?? 'project image'} />}
      </a>
      {title && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="strong">
          {title}
        </a>
      )}
      {description && <div className="project-description">{description}</div>}
    </div>
  )
}

export default ProjectCard
