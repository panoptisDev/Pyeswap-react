import { Box, Flex } from 'uikit'
import styled from 'styled-components'

export const StyledSwapContainer = styled(Flex)<{ $isChartExpanded: boolean }>`
  flex-shrink: 0;
  height: 484px;
  ${({ theme }) => theme.mediaQueries.lg} {
  }

  ${({ theme }) => theme.mediaQueries.xxl} {
    ${({ $isChartExpanded }) => ($isChartExpanded ? 'padding: 0 120px' : 'padding: 0 40px')};
  }
`

export const StyledInputCurrencyWrapper = styled(Box)`
  background-color: ${({ theme }) => theme.colors.cardBack};
  border-radius: 16px;
`
