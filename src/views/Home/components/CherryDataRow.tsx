import { Flex, Heading, Skeleton, Text } from 'uikit'
import Balance from 'components/Balance'
import pyeAbi from 'config/abi/pye.json'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useRefresh from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import { usePriceCherryBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { formatBigNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { multicallv2 } from 'utils/multicall'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px ;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 16px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const flexStyles: any ={
  padding: '0 0 16px 16px'
}

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);
  padding-bottom: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(2, auto);
  }
`

const emissionsPerBlock = 0.015

const CherryDataRow = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadDataCherry, setLoadDataCherry] = useState(false)
  const [cherrySupply, setCherrySupply] = useState(0)
  const [burnedBalanceCherry, setBurnedBalanceCherry] = useState(0)
  const cherryPriceBusd = usePriceCherryBusd()
  const mcapCherry = cherryPriceBusd.times(cherrySupply)
  const mcapStringCherry = formatLocalisedCompactNumber(mcapCherry.toNumber())
  const cherryPriceFormat = Number.parseFloat(cherryPriceBusd.toFixed(3))
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isIntersecting) {
      setLoadDataCherry(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    const fetchTokenData = async () => {
      const totalSupplyCallCherry = { address: tokens.cherry.address, name: 'totalSupply' }
      const burnedTokenCallCherry = {
        address: tokens.cherry.address,
        name: 'balanceOf',
        params: ['0x0000000000000000000000000000000000000000'],
      }
      const tokenDataResultRawCherry = await multicallv2(pyeAbi, [totalSupplyCallCherry, burnedTokenCallCherry], {
        requireSuccess: false,
      })
      const [totalSupplyCherry, burnedCherry] = tokenDataResultRawCherry.flat()
      setCherrySupply(totalSupplyCherry && burnedCherry ? totalSupplyCherry.sub(burnedCherry).div(10**9).div(10**9).toString() : 0)
      setBurnedBalanceCherry(burnedCherry ? burnedCherry.div(10**18).toString() : 0)
    }

    if (loadDataCherry) {
      fetchTokenData()
    }
  }, [loadDataCherry, slowRefresh])

  return (
    <Grid>
      <Flex flexDirection="column" alignItems="center" style={flexStyles}>
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">

          {t('Current supply')}</Text>
        {cherrySupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={cherrySupply} />
        ) : (
          <>
            <div ref={observerRef} />
            <Skeleton height={24} width={126} my="4px" />
          </>
        )}
      </Flex>
      <StyledColumn alignItems="center">
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">

          {t('CHERRY emissions')}</Text>

        <Text fontSize='24px' bold lineHeight='1.1'>{t('%cherryEmissions%/block', { cherryEmissions: emissionsPerBlock })}</Text>
      </StyledColumn> 
      <StyledColumn noMobileBorder alignItems="center">
        <Text  fontSize="14px" mb="12px" color="rgb(228, 196, 140)">

          {t('Market cap')}</Text>
        {mcapCherry?.gt(0) && mcapStringCherry ? (
          <Text fontSize='24px' bold lineHeight='1.1'>{t('$%marketCap%', { marketCap: `${mcapStringCherry.replace("million", "")}m` })}</Text>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder paddingRight='20px' alignItems="center">
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">
          {t('Current price')}</Text>
        {mcapCherry?.gt(0) && cherryPriceFormat ? (
          <Text fontSize='24px' bold lineHeight='1.1'>{t('$%currentPrice%', { currentPrice: cherryPriceFormat })}</Text>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
    </Grid>
  )
}

export default CherryDataRow