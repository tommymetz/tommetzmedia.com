import React, { useRef } from 'react'
import './Text.css'
import { useWhenVisible } from '../../hooks/useWhenVisible'

type Level = 'h1' | 'h2' | 'h3' | 'body'

type Props = {
  level?: Level
  headline?: boolean
  animate?: boolean
  animateWhenVisible?: boolean
  animationDelaySeconds?: number
  children?: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLElement>

export const Text = ({
  level = 'body',
  headline = false,
  animate = false,
  animateWhenVisible = false,
  animationDelaySeconds = 0,
  children,
  className = '',
  ...rest
}: Props) => {
  const containerRef = useRef<HTMLElement>(null)
  const isVisible = useWhenVisible(containerRef)
  
  const Tag: any = level === 'body' ? 'p' : level
  const classes = [
    'text',
    `text--${level}`,
    headline ? 'text--headline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const shouldAnimate = animate && (!animateWhenVisible || isVisible)
  
  const animatedChildren =
    shouldAnimate && typeof children === 'string'
      ? children.split('').map((char, index) => (
        <span
          key={index}
          className="animated-letter"
          style={{ animationDelay: `${animationDelaySeconds + index * 0.05}s` }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))
      : children

  return (
    <Tag ref={containerRef} className={classes} {...(rest as any)} data-testid="text-component">
      {animatedChildren}
    </Tag>
  )
}

export default Text
