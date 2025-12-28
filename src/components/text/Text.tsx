import React from 'react'
import './Text.css'

type Level = 'h1' | 'h2' | 'h3' | 'body'

type Props = {
  level?: Level
  headline?: boolean
  animate?: boolean
  children?: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLElement>

export const Text = ({
  level = 'body',
  headline = false,
  animate = false,
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
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {char}
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
