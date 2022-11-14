import BigNumber from 'bignumber.js'
import React from 'react'
import styled from 'styled-components'
import { Flex, Text } from 'uikit'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'contexts/Localization'
import { BIG_ZERO } from 'utils/bigNumber'
import { DeserializedPool } from 'state/types'
import AprRow from './AprRow'
import { StyledCard } from './StyledCard'
import CardFooter from './CardFooter'
import CardActions from './CardActions'
import {DoubleCurrencyLogo} from "../../../Info/components/CurrencyLogo";
import {CompoundingPoolTag, ManualPoolTag} from "../../../../components/Tags";

const CardInnerContainer = styled(Flex)`
  flex-direction: column;
  justify-content: space-around;
  padding: 14px;
`

const HeadingWrapper = styled(Flex)`
  padding: 16px 8px 0;
  svg {
    margin-right: 8px;
  }
`

const TokenWrapper = styled.div`
  padding-right: 10px;
  height: 28px;
  width: 58px;

`

const ContentWrapper = styled(Flex)`
  flex-direction: column;
  padding: 0 8px;
  gap: 14px;
  margin-bottom: 14px;
`

const PoolCard: React.FC<{ pool: DeserializedPool; account: string }> = ({ pool, account }) => {
  const { stakingToken, earningToken, userData, vaultKey } = pool
  const { t } = useTranslation()
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  const isApplePool = earningToken.symbol === 'APPLE' && stakingToken.symbol === 'APPLE'

  return (
    <StyledCard>
      <CardInnerContainer>
        <HeadingWrapper flexDirection='column' mb="26px">
          <Flex alignItems='center' mb='14px'>
            <TokenWrapper>
              <DoubleCurrencyLogo address0={earningToken.address} address1={stakingToken.address} size={28}/>
            </TokenWrapper>
            <Flex flexDirection='column'>
              <Text bold fontSize='18px'>{isApplePool ? t('Manual') : t('Earn %asset%', { asset: earningToken.symbol })}</Text>
              <Text bold fontSize='13px' color='textSubtle'>{isApplePool ? t('Earn APPLE, stake APPLE') : t('Stake %symbol%', { symbol: stakingToken.symbol })}</Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" alignItems='flex-start'>
            <Flex justifyContent="center">
              {vaultKey ? <CompoundingPoolTag /> : <ManualPoolTag />}
            </Flex>
          </Flex>
        </HeadingWrapper>
        <ContentWrapper>
          <AprRow pool={pool} stakedBalance={stakedBalance} />
        </ContentWrapper>
        <Flex flexDirection="column">
          {account ? (
            <CardActions pool={pool} stakedBalance={stakedBalance} />
          ) : (
            <>
              <Text mb="10px" fontSize="13px" color="textSubtle" bold px='8px'>
                {t('Start earning')}
              </Text>
              <ConnectWalletButton variant='primary' />
            </>
          )}
        </Flex>
      </CardInnerContainer>
      <CardFooter pool={pool} account={account} />
    </StyledCard>
  )
}

export default PoolCard
