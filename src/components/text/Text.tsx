import React from 'react'
import './Text.css'

type Level = 'h1' | 'h2' | 'h3' | 'body'

type Props = {
  level?: Level
  headline?: boolean
  children?: React.ReactNode
  className?: string
} & React.HTMLAttributes<HTMLElement>

export const Text = ({
  level = 'body',
  headline = false,
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

  return (
    <Tag className={classes} {...(rest as any)}>
      {children}
    </Tag>
  )
}

export default Text
