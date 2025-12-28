import './ContentCard.css'
import { Text } from '../text/Text'
import Image from '../image/Image'
import type { ReactNode } from 'react'

const Content = ({
  title,
  image,
  children,
}: {
  title?: string
  image?: string
  children?: ReactNode
}) => (
  <>
    {image && <Image src={image} alt={title ?? 'project image'} />}
    {title && <Text level="h3">{title}</Text>}
    {children && (
      <Text level="body">
        {typeof children === 'string' || typeof children === 'number' ? (
          <div dangerouslySetInnerHTML={{ __html: String(children) }} />
        ) : (
          <>{children}</>
        )}
      </Text>
    )}
  </>
);

export const ContentCard = ({
  title,
  image,
  link,
  children,
}: {
  title?: string
  image?: string
  link?: string
  children?: ReactNode
}) => {
  return (
    <div className="content-card">
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="work">
          <Content title={title} image={image}>
            {children}
          </Content>
        </a>
      ) : (
        <Content title={title} image={image}>
          {children}
        </Content>
      )}
    </div>
  )
}

export default ContentCard
