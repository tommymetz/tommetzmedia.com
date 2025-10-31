import React from 'react'
import './Section.css'
import { Text } from '../text/Text'

export const Section = ({
  headline,
  children,
  columns = 2,
}: {
  headline?: string,
  children?: React.ReactNode,
  columns?: number | string,
}) => {
  return (
    <div className="section">
      {headline && <Text level="h2">{headline}</Text>}
      <div className={`section-content ${columns ? `columns-${columns}` : ''}`}>
        {children}
      </div>
    </div>
  )
}