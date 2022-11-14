/* eslint-disable no-nested-ternary */
import React, { useEffect, useMemo } from 'react'
import { RouteComponentProps, Link } from 'react-router-dom'
import { Duration } from 'date-fns'
import styled from 'styled-components'
import {
  Text,
  Box,
  Heading,
  Button,
  Card,
  Flex,
  Breadcrumbs,
  Link as UIKitLink,
  LinkExternal,
  Spinner,
  Image,
  useMatchBreakpoints,
} from 'uikit'
import Page from 'components/Layout/Page'
import { getBscScanLink } from 'utils'
import truncateHash from 'utils/truncateHash'
import useCMCLink from 'views/Info/hooks/useCMCLink'
import { CurrencyLogo } from 'views/Info/components/CurrencyLogo'
import { formatAmount } from 'views/Info/utils/formatInfoNumbers'
import Percent from 'views/Info/components/Percent'
import SaveIcon from 'views/Info/components/SaveIcon'
import {
  usePoolDatas,
  useTokenData,
  usePoolsForToken,
  useTokenChartData,
  useTokenPriceData,
  useTokenTransactions,
} from 'state/info/hooks'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import TransactionTable from 'views/Info/components/InfoTables/TransactionsTable'
import { useWatchlistTokens } from 'state/user/hooks'
import { ONE_HOUR_SECONDS } from 'config/constants/info'
import { useTranslation } from 'contexts/Localization'
import ChartCard from 'views/Info/components/InfoCharts/ChartCard'
import useTheme from "../../../hooks/useTheme";

const ContentLayout = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: 260px 1fr;
  grid-gap: 1em;
  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
`

const DEFAULT_TIME_WINDOW: Duration = { weeks: 1 }

const TokenPage: React.FC<RouteComponentProps<{ address: string }>> = ({
  match: {
    params: { address: routeAddress },
  },
}) => {
  const { isXs, isSm } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()

  // Needed to scroll up if user comes to this page by clicking on entry in the table
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // In case somebody pastes checksummed address into url (since GraphQL expects lowercase address)
  const address = routeAddress.toLowerCase()


  const tokenData = useTokenData(address)
  const poolsForToken = usePoolsForToken(address)
  const poolDatas = usePoolDatas(poolsForToken ?? [])
  const transactions = useTokenTransactions(address)
  const chartData = useTokenChartData(address)

  // pricing data
  const priceData = useTokenPriceData(address, ONE_HOUR_SECONDS, DEFAULT_TIME_WINDOW)
  const adjustedPriceData = useMemo(() => {
    // Include latest available price
    if (priceData && tokenData && priceData.length > 0) {
      return [
        ...priceData,
        {
          time: new Date().getTime() / 1000,
          open: priceData[priceData.length - 1].close,
          close: tokenData?.priceUSD,
          high: tokenData?.priceUSD,
          low: priceData[priceData.length - 1].close,
        },
      ]
    }
    return undefined
  }, [priceData, tokenData])


  return (
    <Page symbol={tokenData?.symbol}>
      {tokenData ? (
        !tokenData.exists ? (
          <Card>
            <Box p="16px">
              <Text color="textSubtle">
                {t('No pool has been created with this token yet. Create one')}
                <Link style={{ display: 'inline', marginLeft: '6px' }} to={`/add/${address}`}>
                  {t('here.')}
                </Link>
              </Text>
            </Box>
          </Card>
        ) : (
          <>
            {/* Stuff on top */}
            <Flex justifyContent="space-between" mb="24px" flexDirection={['column', 'column', 'row']}>
              <Breadcrumbs mb="32px">
                <Link to="/info">
                  <Text color="success">{t('Info')}</Text>
                </Link>
                <Link to="/info/tokens">
                  <Text color="success">{t('Tokens')}</Text>
                </Link>
                <Flex>
                  <Text color="textSubtle" mr="8px">
                    {tokenData.symbol}
                  </Text>
                  <Text color="muted">{`(${truncateHash(address)})`}</Text>
                </Flex>
              </Breadcrumbs>
            </Flex>
            <Flex justifyContent="space-between" flexDirection={['column', 'column', 'column', 'row']}>
              <Flex flexDirection="column" mb={['8px', null]}>
                <Flex alignItems="center">
                  <CurrencyLogo size="32px" address={address} />
                  <Text
                    color="textSubtle"
                    ml="12px"
                    bold
                    lineHeight="0.7"
                    fontSize={isXs || isSm ? '24px' : '40px'}
                    id="info-token-name-title"
                  >
                    {tokenData.name}
                  </Text>
                  <Text ml="12px" lineHeight="1" color="textSubtle" fontSize={isXs || isSm ? '14px' : '20px'}>
                    ({tokenData.symbol})
                  </Text>
                </Flex>
                <Flex mt="8px" ml="46px" alignItems="center">
                  <Text mr="16px" bold fontSize="24px" color="success">
                    ${formatAmount(tokenData.priceUSD, { notation: 'standard' })}
                  </Text>
                  <Percent value={tokenData.priceUSDChange} fontWeight={600} />
                </Flex>
              </Flex>
              <Flex>
                <Link to={`/add/${address}`}>
                  <Button mr="8px" variant="success">
                    {t('Add Liquidity')}
                  </Button>
                </Link>
                <Link to={`/swap?inputCurrency=${address}`}>
                  <Button>{t('Trade')}</Button>
                </Link>
              </Flex>
            </Flex>

            {/* data on the right side of chart */}
            <ContentLayout>
              <Card style={{ background: isDark ? '#171A26' : theme.colors.background }}>
                <Box>
                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex flexDirection="column">
                      <Text bold small color="gold2" fontSize="12px" textTransform="uppercase">
                        {t('Liquidity')}
                      </Text>
                      <Text color="#FFFFFF" bold fontSize="24px">
                        ${formatAmount(tokenData.liquidityUSD)}
                      </Text>
                    </Flex>
                    <Flex>
                      <Percent value={tokenData.liquidityUSDChange} />
                    </Flex>
                  </Flex>

                  <Flex justifyContent="space-between" alignItems="center">
                    <Flex flexDirection="column">
                      <Text mt="24px" bold color="gold2" fontSize="12px" textTransform="uppercase">
                        {t('Volume 24H')}
                      </Text>
                      <Text color="#FFFFFF" bold fontSize="24px" textTransform="uppercase">
                        ${formatAmount(tokenData.volumeUSD)}
                      </Text>
                    </Flex>
                    <Flex>
                      <Percent value={tokenData.volumeUSDChange} />
                    </Flex>
                  </Flex>

                  <Text mt="24px" bold color="gold2" fontSize="12px" textTransform="uppercase">
                    {t('Volume 7D')}
                  </Text>
                  <Text color="#FFFFFF" bold fontSize="24px">
                    ${formatAmount(tokenData.volumeUSDWeek)}
                  </Text>

                  <Text mt="24px" bold color="gold2" fontSize="12px" textTransform="uppercase">
                    {t('Transactions 24H')}
                  </Text>
                  <Text color="#FFFFFF" bold fontSize="24px">
                    {formatAmount(tokenData.txCount, { isInteger: true })}
                  </Text>
                </Box>
              </Card>
              {/* charts card */}
              <ChartCard
                variant="token"
                chartData={chartData}
                tokenData={tokenData}
                tokenPriceData={adjustedPriceData}
              />
            </ContentLayout>

            {/* pools and transaction tables */}
            <Heading scale="lg" mb="16px" mt="40px">
              {t('Pools')}
            </Heading>

            <PoolTable poolDatas={poolDatas} />

            <Heading scale="lg" mb="16px" mt="40px">
              {t('Transactions')}
            </Heading>

            <TransactionTable transactions={transactions} />
          </>
        )
      ) : (
        <Flex mt="80px" justifyContent="center">
          <Spinner />
        </Flex>
      )}
    </Page>
  )
}

export default TokenPage
