import { Flex, Heading, Skeleton, Text } from 'uikit'
import Balance from 'components/Balance'
import pyeAbi from 'config/abi/pye.json'
import tokens from 'config/constants/tokens'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import useRefresh from 'hooks/useRefresh'
import React, { useEffect, useState } from 'react'
import { usePriceAppleBusd } from 'state/farms/hooks'
import styled from 'styled-components'
import { formatBigNumber, formatLocalisedCompactNumber } from 'utils/formatBalance'
import { multicallv2 } from 'utils/multicall'
import {Grid as GridMui, Paper, Box} from '@mui/material'
import {Container, Row, Col} from 'react-grid-system'


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
         padding: 0 8px;
         ${theme.mediaQueries.sm} {
           padding: 0 16px;
         }
       `}
`
// const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
//   flex-direction: column;
//   ${({ noMobileBorder, theme }) =>
//     noMobileBorder
//       ? `${theme.mediaQueries.md} {
//            padding: 0 16px ;
//            border-left: 1px ${theme.colors.inputSecondary} solid;
//            margin-right: 20px
//          }
//        `
//       : `border-left: 1px ${theme.colors.inputSecondary} solid;
//          padding: 0 16px;
//          ${theme.mediaQueries.sm} {
//            padding: 0 16x;
//            margin-right: 20px
//          }
//        `}
// `
// Old one - using one above
// const StyledColumn = styled(Flex)<{ noMobileBorder?: boolean }>`
//   flex-direction: column;
//   ${({ noMobileBorder, theme }) =>
//     noMobileBorder
//       ? `${theme.mediaQueries.md} {
//            padding: 0 16px ;
//            border-left: 1px ${theme.colors.inputSecondary} solid;
//          }
//        `
//       : `border-left: 1px ${theme.colors.inputSecondary} solid;
//          padding: 0 8px;
//          ${theme.mediaQueries.sm} {
//            padding: 0 16px;
//          }
//        `}
// `

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

// Old
// const Grid = styled.div`
//   display: grid;
//   grid-gap: 16px 8px;
//   margin-top: 24px;
//   grid-template-columns: repeat(2, auto);

//   ${({ theme }) => theme.mediaQueries.sm} {
//     grid-gap: 16px;
//   }

//   ${({ theme }) => theme.mediaQueries.md} {
//     grid-gap: 32px;
//     grid-template-columns: repeat(4, auto);
//   }
// `

const emissionsPerBlock = 10

const flexStyles: any ={
  padding: '0 0 16px 16px'
}


const AppleDataRow = () => {
  const { t } = useTranslation()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [loadDataApple, setLoadDataApple] = useState(false)
  const [appleSupply, setAppleSupply] = useState(0)
  const [burnedBalanceApple, setBurnedBalanceApple] = useState(0)
  const applePriceBusd = usePriceAppleBusd()
  const mcapApple = applePriceBusd.times(appleSupply)
  const mcapStringApple = formatLocalisedCompactNumber(mcapApple.toNumber())
  const applePriceFormat = Number.parseFloat(applePriceBusd.toFixed(3))
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    if (isIntersecting) {
      setLoadDataApple(true)
    }
  }, [isIntersecting])

  useEffect(() => {
    const fetchTokenData = async () => {
      const totalSupplyCallApple = { address: tokens.apple.address, name: 'totalSupply' }
      const burnedTokenCallApple = {
        address: tokens.apple.address,
        name: 'balanceOf',
        params: ['0x0000000000000000000000000000000000000000'],
      }
      const tokenDataResultRawApple = await multicallv2(pyeAbi, [totalSupplyCallApple, burnedTokenCallApple], {
        requireSuccess: false,
      })
      const [totalSupplyApple, burnedApple] = tokenDataResultRawApple.flat()
      setAppleSupply(totalSupplyApple && burnedApple ? totalSupplyApple.sub(burnedApple).div(10**9).div(10**9).toString() : 0)
      setBurnedBalanceApple(burnedApple ? burnedApple.div(10**18).toString() : 0)
    }

    if (loadDataApple) {
      fetchTokenData()
    }
  }, [loadDataApple, slowRefresh])

  return (
    <Grid>
      <Flex flexDirection="column" alignItems="center" style={flexStyles}>
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">
        {/* <Text style={{ opacity: 0.6 }} fontSize="14px" mb="12px" color="rgb(228, 196, 140)"> */}
          {t('Current supply')}</Text>
        {appleSupply ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={appleSupply} />
        ) : (
          <>
            <div ref={observerRef} />
            <Skeleton height={24} width={126} my="4px" />
          </>
        )}
      </Flex>
     {/* <StyledColumn alignItems="center">
        <Text style={{ opacity: 0.6 }} fontSize="14px" mb="12px" color="textSubtle">{t('Burned to date')}</Text>
        {burnedBalanceApple ? (
          <Balance decimals={0} lineHeight="1.1" fontSize="24px" bold value={burnedBalanceApple} />
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn> */}
      <StyledColumn alignItems="center">
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">{t('APPLEPYE emissions')}</Text>
        {/* <Text style={{ opacity: 0.6 }} fontSize="14px" mb="12px" color="rgb(228, 196, 140)">{t('APPLE emissions')}</Text> */}

        <Text fontSize='24px' bold lineHeight='1.1'>{t('%appleEmissions%/block', { appleEmissions: emissionsPerBlock })}</Text>
      </StyledColumn> 
      <StyledColumn noMobileBorder alignItems="center">
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">
        {/* <Text style={{ opacity: 0.6 }} fontSize="14px" mb="12px" color="rgb(228, 196, 140)"> */}
          {t('Market cap')}</Text>
        {mcapApple?.gt(0) && mcapStringApple ? (
          <Text fontSize='24px' bold lineHeight='1.1'>
            {t('$%marketCap%', { marketCap: `${mcapStringApple.replace("million", "")}m`})}
            </Text>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      <StyledColumn noMobileBorder alignItems="center" paddingRight='20px'>
        <Text fontSize="14px" mb="12px" color="rgb(228, 196, 140)">
        {/* <Text style={{ opacity: 0.6 }} fontSize="14px" mb="12px" color="rgb(228, 196, 140)"> */}
          {t('Current price')}</Text>
        {mcapApple?.gt(0) && applePriceFormat ? (
          <Text fontSize='24px' bold lineHeight='1.1'>{t('$%currentPrice%', { currentPrice: applePriceFormat })}</Text>
        ) : (
          <Skeleton height={24} width={126} my="4px" />
        )}
      </StyledColumn>
      {/* <StyledColumn noMobileBorder alignItems="center">
        <Text  style={{ opacity: 0.6 }} fontSize="14px" mb="12px" color="textSubtle">{mcapStringApple.replace("million", "")}</Text>
      
        
      </StyledColumn>
      <StyledColumn noMobileBorder alignItems="center">
      <Text  style={{ opacity: 0.6 }} fontSize="14px" mb="12px" color="textSubtle">{appleSupply}</Text>
      </StyledColumn> */}
    </Grid>
  )
}

export default AppleDataRow