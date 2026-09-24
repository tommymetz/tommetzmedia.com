import React from 'react'
import './Section.css'
import { Text } from '../text/Text'

export const Section = ({
  id,
  headline,
  children,
  columns = 2,
  wide = false,
}: {
  id?: string,
  headline?: string,
  children?: React.ReactNode,
  columns?: number | string,
  wide?: boolean,
}) => {
  return (
    <div id={id} className={`section${wide ? ' wide' : ''}`}>
      {headline && <Text level="h2">{headline}</Text>}
      <div id={id} className={`section-content ${!wide && columns ? `columns-${columns}` : ''}`}>
        {children}
      </div>
    </div>
  )
}