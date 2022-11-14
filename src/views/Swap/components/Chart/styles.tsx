import { Box } from 'uikit'
import styled from 'styled-components'

export const StyledPriceChart = styled(Box)<{ $isDark: boolean; $isExpanded: boolean }>`
  border: none;
  border-radius: 32px;
  width: 100%;
  padding-top: 36px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding-top: 24px;
    background: ${({ theme, $isDark }) => ($isDark ? '#171A26' : theme.colors.gold)};
    border-radius: ${({ $isExpanded }) => ($isExpanded ? '0' : '12px')};
    width: ${({ $isExpanded }) => ($isExpanded ? '100%' : '50%')};
    height: ${({ $isExpanded }) => ($isExpanded ? 'calc(100vh - 100px)' : '484px')};
  }
`

StyledPriceChart.defaultProps = {
  height: '70%',
}
