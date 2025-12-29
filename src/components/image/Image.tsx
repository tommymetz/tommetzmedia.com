import { useState, useEffect } from 'react'
import { Loader } from '../loader/Loader'
import './Image.css'

export const Image = ({
  src,
  alt
}: {
  src: string
  alt?: string
}) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const img = new window.Image()
    const minLoadingTime = 1000 // 1 second
    const startTime = Date.now()
    let timeoutId: ReturnType<typeof setTimeout>

    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime
      const remainingTime = minLoadingTime - elapsedTime
      timeoutId = setTimeout(() => setIsLoading(false), remainingTime > 0 ? remainingTime : 0)
    }

    img.onload = finishLoading
    img.onerror = finishLoading
    img.src = src

    return () => {
      clearTimeout(timeoutId)
      img.onload = null
      img.onerror = null
    }
  }, [src])

  return (
    <div className="image">
      {isLoading ? (
        <div className="image__loader">
          <Loader />
        </div>
      ) : (
        <img className="image__img" src={src} alt={alt ?? ''} />
      )}
    </div>
  )
}

export default Image
