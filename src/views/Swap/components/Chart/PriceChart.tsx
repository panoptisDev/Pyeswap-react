import {
  Button,
  ExpandIcon,
  Flex,
  IconButton,
  ShrinkIcon,
  SyncAltIcon,
  Text,
  TradingViewIcon,
  LineGraphIcon,
  useMatchBreakpoints,
} from 'uikit'
import { CurrencyLogo, DoubleCurrencyLogo } from 'components/Logo'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import { ChartViewMode } from 'state/user/actions'
import { useExchangeChartViewManager } from 'state/user/hooks'
import styled from 'styled-components'
import BasicChart from './BasicChart'
import { StyledPriceChart } from './styles'
import TradingViewChart from './TradingViewChart'


const PriceChart = ({
  inputCurrency,
  outputCurrency,
  isDark,
  isChartExpanded,
  setIsChartExpanded,
  isMobile,
  token0Address,
  token1Address,
  currentSwapPrice,
}) => {
  const toggleExpanded = () => setIsChartExpanded((currentIsExpanded) => !currentIsExpanded)

  return (
    <StyledPriceChart
      height='70%'
      $isDark={isDark}
      $isExpanded={isChartExpanded}
    >
      <Flex justifyContent="space-between" alignItems='center' px="32px">
        <Flex alignItems="center">
          {outputCurrency ? (
            <DoubleCurrencyLogo currency0={inputCurrency} currency1={outputCurrency} />
          ) : (
            inputCurrency && <CurrencyLogo currency={inputCurrency} />
          )}
          {inputCurrency && (
            <Text style={{ marginLeft: '48px' }} color="text" fontSize='16px' fontWeight={500}>
              {outputCurrency ? `${inputCurrency.symbol}/${outputCurrency.symbol}` : inputCurrency.symbol}
            </Text>
          )}
        </Flex>
        {!isMobile && (
          <Flex>
            <IconButton variant="text" onClick={toggleExpanded}>
              {isChartExpanded ? <ShrinkIcon color="text" /> : <ExpandIcon color="text" />}
            </IconButton>
          </Flex>
        )}
      </Flex>
        <BasicChart
          token0Address={token0Address}
          token1Address={token1Address}
          isChartExpanded={isChartExpanded}
          inputCurrency={inputCurrency}
          outputCurrency={outputCurrency}
          isMobile={isMobile}
          currentSwapPrice={currentSwapPrice}
        />
    </StyledPriceChart>
  )
}

export default PriceChart
