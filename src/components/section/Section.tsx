import React from 'react'
import './Section.css'
import { Text } from '../text/Text'

export const Section = ({
  headline,
  children
}: {
  headline?: string,
  children?: React.ReactNode
}) => {
  return (
    <div className="section">
      {headline && <Text level="h2">{headline}</Text>}
      {children}
    </div>
  )
}