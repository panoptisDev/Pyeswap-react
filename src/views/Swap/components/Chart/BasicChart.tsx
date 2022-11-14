import { Box, ButtonMenu, ButtonMenuItem, Flex, Text } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import React, { useState } from 'react'
import { useFetchPairPrices } from 'state/swap/hooks'
import { PairDataTimeWindowEnum } from 'state/swap/types'
import NoChartAvailable from './NoChartAvailable'
import SwapLineChart from './SwapLineChart'
import TokenDisplay from './TokenDisplay'
import { getTimeWindowChange } from './utils'

const BasicChart = ({
  token0Address,
  token1Address,
  isChartExpanded,
  inputCurrency,
  outputCurrency,
  isMobile,
  currentSwapPrice,
}) => {
  const [timeWindow, setTimeWindow] = useState<PairDataTimeWindowEnum>(0)

  const { pairPrices = [], pairId } = useFetchPairPrices({
    token0Address,
    token1Address,
    timeWindow,
    currentSwapPrice,
  })
  const [hoverValue, setHoverValue] = useState<number | undefined>()
  const [hoverDate, setHoverDate] = useState<string | undefined>()
  const valueToDisplay = hoverValue || pairPrices[pairPrices.length - 1]?.value
  const { changePercentage, changeValue } = getTimeWindowChange(pairPrices)
  const isChangePositive = changeValue >= 0
  const chartHeight = isChartExpanded ? 'calc(100% - 120px)' : '280px'
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const currentDate = new Date().toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })

  // Sometimes we might receive array full of zeros for obscure tokens while trying to derive data
  // In that case chart is not useful to users
  const isBadData =
    pairPrices &&
    pairPrices.length > 0 &&
    pairPrices.every(
      (price) => !price.value || price.value === 0 || price.value === Infinity || Number.isNaN(price.value),
    )

  if (isBadData) {
    return (
      <NoChartAvailable
        token0Address={token0Address}
        token1Address={token1Address}
        pairAddress={pairId}
        isMobile={isMobile}
      />
    )
  }

  return (
    <>
      <Flex
        flexDirection={['column', null, null, null, null, null, 'row']}
        alignItems={['flex-start', null, null, null, null, null, 'center']}
        justifyContent="space-between"
        px="32px"
      >
        <Flex flexDirection="column" pt="12px">
          <TokenDisplay
            value={pairPrices?.length > 0 && valueToDisplay}
            inputSymbol={inputCurrency?.symbol}
            outputSymbol={outputCurrency?.symbol}
          />
          <Flex flexDirection="row" mt="10px" alignItems="center" justifyContent="center">
            <Text color={isChangePositive ? 'success' : 'failure'} fontSize="20px" bold>
              {`${isChangePositive ? '+' : ''}${changeValue.toFixed(3)} (${changePercentage}%)`}
            </Text>
            <Text small color="rgba(95, 100, 120, 1)" ml="10px">
              {hoverDate || currentDate}
            </Text>
          </Flex>
        </Flex>
        <Box>
          <ButtonMenu activeIndex={timeWindow} onItemClick={setTimeWindow} scale="sm" variant='dark' hasBorder fullDark>
            <ButtonMenuItem>{t('24H')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1W')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1M')}</ButtonMenuItem>
            <ButtonMenuItem>{t('1Y')}</ButtonMenuItem>
          </ButtonMenu>
        </Box>
      </Flex>
      <Box height={isMobile ? '100%' : chartHeight} width="100%">
        <SwapLineChart
          data={pairPrices}
          setHoverValue={setHoverValue}
          setHoverDate={setHoverDate}
          isChangePositive={isChangePositive}
          timeWindow={timeWindow}
        />
      </Box>
    </>
  )
}

export default BasicChart
