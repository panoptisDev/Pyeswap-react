import React from 'react'
import { Flex } from 'uikit'
import styled from 'styled-components'

const Wrapper = styled(Flex)`
  overflow-x: scroll;
  padding: 0;
  border-radius: 24px;
  margin: 20px 15px;
  ::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none; /* Firefox */
`

const Inner = styled(Flex)`
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.input};
  width: 100%;
`

interface TabProps {
  isActive?: boolean
  onClick?: () => void
}

export const TabToggle = styled.button<TabProps>`
  display: inline-flex;
  justify-content: center;
  cursor: pointer;
  flex: 1;
  border: 0;
  outline: 0;
  padding: 16px;
  border-radius: 20px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  background-color: ${({ theme, isActive }) => (isActive ? '#222531' : 'transparent')};
`

interface TabToggleGroupProps {
  children: React.ReactElement[]
}

export const TabToggleGroup: React.FC<TabToggleGroupProps> = ({ children }) => {
  return (
    <Wrapper p={['0 4px', '0 16px']}>
      <Inner>{children}</Inner>
    </Wrapper>
  )
}
