import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Pair } from '@pyeswap/swap-sdk'
import { Text, Flex, CardBody, CardFooter, Button, AddIcon } from 'uikit'
import { Link } from 'react-router-dom'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import ConnectWalletButton from 'components/ConnectWalletButton'
import FullPositionCard from '../../components/PositionCard'
import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { usePairs } from '../../hooks/usePairs'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import Dots from '../../components/Loader/Dots'
import { AppHeader, AppBody } from '../../components/App'
import Page from '../Page'
import useTheme from "../../hooks/useTheme";

const Body = styled(CardBody)`
  background-color: transparent;
  padding: 0;
`

export default function Pool() {
  const { account } = useActiveWeb3React()
  const { t } = useTranslation()
  const { isDark } = useTheme()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs],
  )
  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens],
  )
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens,
  )

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0'),
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances],
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  const renderBody = () => {
    if (!account) {
      return (
        <Flex flexDirection="column" alignItems="center" justifyContent="center">
          <img src={isDark ? "/images/connection.png" : "/images/connection.svg"} width="100px" alt='wallet did not connected' />
          <Text color="textSubtle" fontSize='14px' textAlign="center" style={{ opacity: 0.4 }} mt="8px" mb='31px'>
            {t('Connect to a wallet to view your liquidity.')}
          </Text>
        </Flex>
      )
    }
    if (v2IsLoading) {
      return (
        <Text color="textSubtle" textAlign="center" my='32px'>
          <Dots>{t('Loading')}</Dots>
        </Text>
      )
    }
    if (allV2PairsWithLiquidity?.length > 0) {
      return allV2PairsWithLiquidity.map((v2Pair, index) => (
        <FullPositionCard
          key={v2Pair.liquidityToken.address}
          pair={v2Pair}
          mb={index < allV2PairsWithLiquidity.length - 1 ? '16px' : 0}
        />
      ))
    }
    return (
      <Text color="textSubtle" textAlign="center" my='32px'>
        {t('No liquidity found.')}
      </Text>
    )
  }

  return (
    <Page>
      <AppBody alt height="280px" width="490px">
        <AppHeader title={t('Your Liquidity')} subtitle={t('Remove liquidity to receive tokens back')} />
        <Body>
          {renderBody()}
        </Body>
        <CardFooter style={{ textAlign: 'center' }} p='0 0 8px'>
          {!account ? (
            <ConnectWalletButton width="100%" />
          ) : !v2IsLoading && (
            <Flex flexDirection="column" alignItems='flex-start' mt="24px">
              <Text color="textSubtle" style={{ opacity: 0.4 }} fontSize='14px' mb="8px">
                {t("Don't see a pool you joined?")}
              </Text>
              <Button id="import-pool-link" variant="primary" width='100%' as={Link} to="/find">
                {t('Find other LP tokens')}
              </Button>
            </Flex>
          )}
        </CardFooter>
      </AppBody>
    </Page>
  )
}
