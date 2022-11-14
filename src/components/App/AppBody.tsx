import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit'

export const BodyWrapper = styled(Card)`
  width: 100%;
  padding: 24px 32px;
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({
  children,
  height = '436px',
  width = '425px',
  alt = false,
}: {
  children: React.ReactNode
  height?: string
  width?: string
  alt?: boolean
}) {
  const { theme } = useTheme()
  return (
    <BodyWrapper style={{ minHeight: height, width, backgroundColor: alt ? theme.colors.cardBackAlt : theme.colors.cardBack }}>
      {children}
    </BodyWrapper>
  )
}
