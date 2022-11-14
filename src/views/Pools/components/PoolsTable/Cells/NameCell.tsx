import React from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Text, useMatchBreakpoints } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { vaultPoolConfig } from 'config/constants/pools'
import {mainnetTokens} from "config/constants/tokens";
import CellLayout from "../CellLayout";
import {DoubleCurrencyLogo} from "../../../../Info/components/CurrencyLogo";

interface NameCellProps {
  pool: DeserializedPool
}

const Container = styled.div`
  display: flex;
  align-items: center;
`

const TokenWrapper = styled.div`
  padding-right: 72px;
  height: 28px;
  width: 58px;

`


const NameCell: React.FC<NameCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { sousId, stakingToken, earningToken, userData, vaultKey } = pool
  const {
    userData: { userShares },
  } = useVaultPoolByKey(pool.vaultKey)
  const hasVaultShares = userShares && userShares.gt(0)

  const stakingTokenSymbol = stakingToken.symbol
  const earningTokenSymbol = earningToken.symbol

  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const isStaked = stakedBalance.gt(0)
  const isManualApplePool = sousId === 0

  const showStakedTag = vaultKey ? hasVaultShares : isStaked

  let title = `${t('Earn')} ${earningTokenSymbol}`
  let subtitle = `${t('Stake')} ${stakingTokenSymbol}`
  const showSubtitle = sousId !== 0 || (sousId === 0 && !isMobile)


  if (isManualApplePool) {
    title = t('Manual APPLE')
    subtitle = `${t('Earn')} APPLE ${t('Stake').toLocaleLowerCase()} APPLE`
  }

  return (
    <CellLayout label={showStakedTag && t('Staked')}>
      <Container>
        <TokenWrapper>
          {vaultKey ? (
            <DoubleCurrencyLogo address0={mainnetTokens.pye.address} address1={mainnetTokens.pye.address} size={28}/>
          ) : (
            <DoubleCurrencyLogo address0={earningToken?.address} address1={stakingToken?.address} size={28}/>
          )}
        </TokenWrapper>
        <Text bold fontSize='15px' mr='8px'>
          {title}
        </Text>
        {showSubtitle && (
          <Text color="textSubtle" fontSize="13px">
            {subtitle}
          </Text>
        )}
      </Container>
    </CellLayout>
  )
}

export default NameCell
