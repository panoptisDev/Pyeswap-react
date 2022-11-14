import { Currency } from '@pyeswap/swap-sdk'
import React from 'react'
import styled from 'styled-components'
import CurrencyLogo from './CurrencyLogo'
import useTheme from "../../hooks/useTheme";

const Wrapper = styled.div<{ margin: boolean }>`
  display: flex;
  flex-direction: row;
  padding: 10px 10px 10px 0;
  position: relative;
  margin-right: ${({ margin }) => margin && "44px"};
  
`

const CurrencyWrapper = styled.div<{ hasBorder?: boolean, isDark?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${({ hasBorder }) => hasBorder ? '32px' : '28px'};
  height: ${({ hasBorder }) => hasBorder ? '32px' : '28px'};
  border-radius: 32px;
  background-color: #2e313c;
  border: ${({ theme , isDark, hasBorder }) => !hasBorder ? 'none' : `2px solid ${isDark ? theme.colors.background : theme.colors.secondary}` };
`

interface DoubleCurrencyLogoProps {
  margin?: boolean
  size?: number
  currency0?: Currency
  currency1?: Currency
}

export default function DoubleCurrencyLogo({
  currency0,
  currency1,
  size = 16,
  margin = false,
}: DoubleCurrencyLogoProps) {
  const { isDark } = useTheme()
  return (
    <Wrapper margin={margin}>
      {currency0 && (
        <CurrencyWrapper style={{ position: 'absolute', top: -6, left: 0 }}>
          <CurrencyLogo currency={currency0} size={`${size.toString()}px`} />
        </CurrencyWrapper>
      )}
      {currency1 && (
        <CurrencyWrapper style={{ position: 'absolute', top: 0, left: 12 }} hasBorder isDark={isDark}>
          <CurrencyLogo currency={currency1} size={`${size.toString()}px`} />
        </CurrencyWrapper>
      )}
    </Wrapper>
  )
}
