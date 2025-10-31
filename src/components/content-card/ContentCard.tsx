import './ContentCard.css'
import { Text } from '../text/Text'
import Image from '../image/Image'

export const ContentCard = ({
  title,
  image,
  link,
  body,
}: {
  title: string
  image?: string
  link?: string
  body?: string
}) => {
  const Content = () => (
    <>
      {image && <Image src={image} alt={title ?? 'project image'} />}
      {title && <Text level="h3" ignoreLinkStyles>{title}</Text>}
      {body && (
        <Text level="body" ignoreLinkStyles>
          <div dangerouslySetInnerHTML={{__html: body}} />
        </Text>
      )}
    </>
  )

  return (
    <div className="content-card">
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="work">
          <Content />
        </a>
      ) : (
        <Content />
      )}
    </div>
  )
}

export default ContentCard
