import { useState, useEffect, useRef } from 'react'
import { Loader } from '../loader/Loader'
import './Image.css'

export const Image = ({
  src,
  alt
}: {
  src: string
  alt?: string
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  // Observe when the component becomes visible
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0 }
    )

    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  // Load the image only when visible
  useEffect(() => {
    if (!isVisible) return

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
