import { Flex, Heading, Skeleton, Text } from 'uikit'
import Balance from 'components/Balance'
import pyeAbi from 'config/abi/pye.json'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useRefresh from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import { usePricePYEBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { formatBigNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { multicallv2 } from 'utils/multicall'

const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
  flex-direction: column;
  ${({ noMobileBorder, theme }) =>
    noMobileBorder
      ? `${theme.mediaQueries.md} {
           padding: 0 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `border-left: 1px ${theme.colors.inputSecondary} solid;
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`

const Grid = styled.div`
  display: grid;
  grid-gap: 16px 8px;
  margin-top: 24px;
  grid-template-columns: repeat(2, auto);

  ${({ theme }) => theme.mediaQueries.sm} {
    grid-gap: 16px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    grid-gap: 32px;
    grid-template-columns: repeat(4, auto);
  }
`

const emissionsPerBlock = 10

const marginLeft: any = {
  marginLeft: '15px'
}

const PYEDataRow = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadData, setLoadData] = useState(false)
  const [pyeSupply, setPyeSupply] = useState(0)
  const [burnedBalance, setBurnedBalance] = useState(0)
  const pyePriceBusd = usePricePYEBusd()
  const mcap = pyePriceBusd.times(pyeSupply)
  const mcapString = formatLocalisedCompactNumber(mcap.toNumber())
  const pyePriceFormat = formatLocalisedCompactNumber(pyePriceBusd.toNumber())
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isIntersecting) {
      setLoadData(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    const fetchTokenData = async () => {
      const totalSupplyCall = { address: tokens.pye.address, name: 'totalSupply' }
      const burnedTokenCall = {
        address: tokens.pye.address,
        name: 'balanceOf',
        params: ['0x000000000000000000000000000000000000dEaD'],
      }
      const tokenDataResultRaw = await multicallv2(pyeAbi, [totalSupplyCall, burnedTokenCall], {
        requireSuccess: false,
      })
      const [totalSupply, burned] = tokenDataResultRaw.flat()
      setPyeSupply(totalSupply && burned ? totalSupply.sub(burned).div(10**9).toString() : 0)
      setBurnedBalance(burned ? burned.div(10**9).toString() : 0)
    }

    if (loadData) {
      fetchTokenData()
    }
  }, [loadData, slowRefresh])

  return (
    <Grid>
      <Flex style={marginLeft} flexDirection="column" alignItems="center">
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">{t('Current supply')}</Text>
        {pyeSupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={pyeSupply} />
        ) : (
          <>
            <div ref={observerRef} />
            <Skeleton height={24} width={126} my="4px" />
          </>
        )}
      </Flex>
      <StyledColumn alignItems="center">
        <Text  fontSize="14px" mb="12px" color="rgb(228, 196, 140)">{t('Burned to date')}</Text>
        {burnedBalance ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalance} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder alignItems="center">
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">{t('Market cap')}</Text>
        {mcap?.gt(0) && mcapString ? (
          <Text fontSize='24px' bold lineHeight='1.1'>{t('$%marketCap%', { marketCap: mcapString })}</Text>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder alignItems="center">
        <Text  fontSize="14px" mb="12px" color="rgb(228, 196, 140)">{t('Current price')}</Text>
        {mcap?.gt(0) && pyePriceFormat ? (
          <Text fontSize='24px' bold lineHeight='1.1'>{t('$%currentPrice%', { currentPrice: pyePriceFormat })}</Text>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
    </Grid>
  )
}

export default PYEDataRow
