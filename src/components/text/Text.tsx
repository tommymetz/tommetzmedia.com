import React from 'react'
import './Text.css'

type Level = 'h1' | 'h2' | 'h3' | 'body'

type Props = {
  level?: Level
  headline?: boolean
  animate?: boolean
  animationDelaySeconds?: number
  children?: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLElement>

export const Text = ({
  level = 'body',
  headline = false,
  animate = false,
  animationDelaySeconds = 0,
  children,
  className = '',
  ...rest
}: Props) => {
  const Tag: any = level === 'body' ? 'p' : level
  const classes = [
    'text',
    `text--${level}`,
    headline ? 'text--headline' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const animatedChildren =
    animate && typeof children === 'string'
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
    <Tag className={classes} {...(rest as any)}>
      {animatedChildren}
    </Tag>
  )
}

export default Text
