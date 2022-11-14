import React from 'react'
import { Text, Flex, TooltipText, useTooltip, Skeleton } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { getAppleVaultEarnings } from 'views/Pools/helpers'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'

import { ActionContainer, ActionTitles, ActionContent } from './styles'
import UnstakingFeeCountdownRow from '../../AppleVaultCard/UnstakingFeeCountdownRow'

interface AutoHarvestActionProps extends DeserializedPool {
  userDataLoaded: boolean
}

const AutoHarvestAction: React.FunctionComponent<AutoHarvestActionProps> = ({
  userDataLoaded,
  earningTokenPrice,
  vaultKey,
}) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const {
    userData: { appleAtLastUserAction, userShares },
    pricePerFullShare,
    fees: { performanceFee },
  } = useVaultPoolByKey(vaultKey)
  const { hasAutoEarnings, autoAppleToDisplay, autoUsdToDisplay } = getAppleVaultEarnings(
    account,
    appleAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  const earningTokenBalance = autoAppleToDisplay
  const earningTokenDollarBalance = autoUsdToDisplay
  const hasEarnings = hasAutoEarnings

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const actionTitle = (
    <Text color="textSubtle" fontSize="13px" mb='9px'>
      {t('Recent APPLE profit')}
    </Text>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Text fontSize="26px" color="textSubtle" fontWeight='700'>0</Text>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!userDataLoaded) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Skeleton width={180} height="32px" marginTop={14} />
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" pt="6px" flexDirection="column" alignSelf="flex-start">
          <>
            {hasEarnings ? (
              <>
                <Balance lineHeight="1" bold fontSize="26px" decimals={5} value={earningTokenBalance} />
                {earningTokenPrice > 0 && (
                  <Balance
                    display="inline"
                    fontSize="13px"
                    color="textSubtle"
                    decimals={2}
                    prefix="~"
                    value={earningTokenDollarBalance}
                    unit=" USD"
                  />
                )}
              </>
            ) : (
              <>
                <Text fontSize="26px" color="textSubtle" fontWeight='700'>0</Text>
                <Text fontSize="13px" color="textSubtle">
                  0 USD
                </Text>
              </>
            )}
          </>
        </Flex>
        <Flex flex="1.3" flexDirection="column" alignSelf="flex-end" alignItems="flex-end">
          <UnstakingFeeCountdownRow vaultKey={vaultKey} />
          <Flex mb="2px" justifyContent="space-between" alignItems="center">
            {tooltipVisible && tooltip}
            <TooltipText ref={targetRef} fontSize='13px' color='textSubtle'>
              {t('Performance Fee')}
            </TooltipText>
            <Flex alignItems="center">
              <Text ml="4px" fontSize='13px' color='textSubtle'>
                {performanceFee / 100}%
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default AutoHarvestAction
