import React from 'react'
import styled from 'styled-components'
import {Box, Flex, Text, CardProps} from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useWeb3React } from '@web3-react/core'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { convertSharesToApple } from 'views/Pools/helpers'
import { FlexGap } from 'components/Layout/Flex'
import { vaultPoolConfig } from 'config/constants/pools'
import AprRow from '../PoolCard/AprRow'
import { StyledCard } from '../PoolCard/StyledCard'
import CardFooter from '../PoolCard/CardFooter'
import VaultCardActions from './VaultCardActions'
import UnstakingFeeCountdownRow from './UnstakingFeeCountdownRow'
import RecentAppleProfitRow from './RecentAppleProfitRow'
import {DoubleCurrencyLogo} from "../../../Info/components/CurrencyLogo";
import {CompoundingPoolTag, ManualPoolTag} from "../../../../components/Tags";
import {mainnetTokens} from "../../../../config/constants/tokens";


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
  margin-bottom: 26px;
`

interface AppleVaultProps extends CardProps {
  pool: DeserializedPool
  showStakedOnly: boolean
  defaultFooterExpanded?: boolean
}

const AppleVaultCard: React.FC<AppleVaultProps> = ({ pool, showStakedOnly }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    userData: { userShares, isLoading: isVaultUserDataLoading },
    fees: { performanceFeeAsDecimal },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { vaultKey } = pool

  const { appleAsBigNumber } = convertSharesToApple(userShares, pricePerFullShare)

  const accountHasSharesStaked = userShares && userShares.gt(0)
  const isLoading = !pool.userData || isVaultUserDataLoading

  if (showStakedOnly && !accountHasSharesStaked) {
    return null
  }

  return (
    <StyledCard>
      <CardInnerContainer>
        <HeadingWrapper flexDirection='column' mb="26px">
          <Flex alignItems='center' mb='14px'>
            <TokenWrapper>
              <DoubleCurrencyLogo address0={mainnetTokens.pye.address} address1={mainnetTokens.pye.address} size={28}/>
            </TokenWrapper>
            <Flex flexDirection='column'>

              <Text bold fontSize='18px'>{t(vaultPoolConfig[pool.vaultKey].name)}</Text>
              <Text bold fontSize='13px' color='textSubtle'>{t(vaultPoolConfig[pool.vaultKey].description)}</Text>
            </Flex>
          </Flex>
          <Flex flexDirection="column" alignItems='flex-start'>
            <Flex justifyContent="center">
              {vaultKey ? <CompoundingPoolTag /> : <ManualPoolTag />}
            </Flex>
          </Flex>
        </HeadingWrapper>
        <ContentWrapper>
          <AprRow pool={pool} stakedBalance={appleAsBigNumber} performanceFee={performanceFeeAsDecimal} />
          <FlexGap gap="24px" flexDirection={accountHasSharesStaked ? 'column-reverse' : 'column'}>
            <Box>
              <Box>
                <RecentAppleProfitRow vaultKey={pool.vaultKey} />
              </Box>
              <Box mt="8px">
                <UnstakingFeeCountdownRow isCard vaultKey={pool.vaultKey} />
              </Box>
            </Box>
          </FlexGap>
        </ContentWrapper>
        <Flex flexDirection="column">
          {account ? (
            <VaultCardActions
              pool={pool}
              accountHasSharesStaked={accountHasSharesStaked}
              isLoading={isLoading}
              performanceFee={performanceFeeAsDecimal}
            />
          ) : (
            <>
              <Text mb="10px" fontSize="13px" color="textSubtle" bold ml='8px'>
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

export default AppleVaultCard
