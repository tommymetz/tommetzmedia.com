import './Image.css'

export const Image = ({
  src,
  alt
}: {
  src: string
  alt?: string
}) => {
  return <img className="image" src={src} alt={alt ?? ''} />
}

export default Image
