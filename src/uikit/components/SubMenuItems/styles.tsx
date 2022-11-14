import styled from 'styled-components'
import { Flex } from '../Box'

const StyledSubMenuItems = styled(Flex)<{ $isMobileOnly: boolean }>`
  ${({ theme }) => theme.mediaQueries.sm} {
    ${({ $isMobileOnly }) => ($isMobileOnly ? 'display:none' : '')};
  }
  min-height: 64px;
  flex-grow: 1;
  background: ${({ theme }) => `${theme.colors.gradients.subMenu}`};
  overflow-x: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

export default StyledSubMenuItems
