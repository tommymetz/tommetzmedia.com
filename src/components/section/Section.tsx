import React from 'react'
import './Section.css'
import { Text } from '../text/Text'

export const Section = ({
  headline,
  children,
  columns = 2,
  wide = false,
}: {
  headline?: string,
  children?: React.ReactNode,
  columns?: number | string,
  wide?: boolean,
}) => {
  return (
    <div className={`section${wide ? ' wide' : ''}`}>
      {headline && <Text level="h2">{headline}</Text>}
      <div className={`section-content ${!wide && columns ? `columns-${columns}` : ''}`}>
        {children}
      </div>
    </div>
  )
}