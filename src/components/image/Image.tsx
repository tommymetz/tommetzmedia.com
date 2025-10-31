import './Image.css'

export const Image = ({
  src,
  alt
}: {
  src: string
  alt?: string
}) => {
  return (
    <div className="image">
      <img className="image__img" src={src} alt={alt ?? ''} />
    </div>
  )
}

export default Image
