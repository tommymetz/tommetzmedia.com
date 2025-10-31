import './ContentCard.css'
import { Text } from '../text/Text'
import Image from '../image/Image'

export const ContentCard = ({
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
    <div className="content-card">
      <a href={link} target="_blank" rel="noopener noreferrer" className="work">
        {image && <Image src={image} alt={title ?? 'project image'} />}
      </a>
      {title && (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Text level="h3">{title}</Text>
        </a>
      )}
      {description && (
        <Text level="body">
          {description}
        </Text>
      )}
    </div>
  )
}

export default ContentCard
