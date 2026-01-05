import { useState, useEffect, useRef } from 'react'
import { Loader } from '../loader/Loader'
import { useWhenVisible } from '../../hooks'
import './Image.css'

const MIN_LOADING_TIME = 500 // 0.5 seconds
const MIN_LOADING_TIME_RANDOMIZED_RANGE = 500 // 0.5 seconds

export const Image = ({
  src,
  alt
}: {
  src: string
  alt?: string
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const isVisible = useWhenVisible(containerRef)

  // Load the image only when visible
  useEffect(() => {
    if (!isVisible) return

    const img = new window.Image()
    const randomizedLoadingTime = MIN_LOADING_TIME + Math.random() * MIN_LOADING_TIME_RANDOMIZED_RANGE
    const startTime = Date.now()
    let timeoutId: ReturnType<typeof setTimeout>

    const finishLoading = () => {
      const elapsedTime = Date.now() - startTime
      const remainingTime = randomizedLoadingTime - elapsedTime
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
  }, [isVisible, src])

  return (
    <div className="image" ref={containerRef}>
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
