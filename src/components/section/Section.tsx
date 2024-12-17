import React from 'react'
import './Section.css'

export const Section = ({
  headline,
  children
}:{
  headline?: string,
  children?: React.ReactNode
}) => {
  return (
    <div className="section">
      {headline && <h2>{headline}</h2>}
      {children}
    </div>
  )
}