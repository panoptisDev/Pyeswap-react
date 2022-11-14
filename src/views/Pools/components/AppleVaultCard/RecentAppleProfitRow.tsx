import React from 'react'
import { Flex, Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import { usePriceAppleBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { VaultKey } from 'state/types'
import { getAppleVaultEarnings } from 'views/Pools/helpers'
import RecentAppleProfitBalance from './RecentAppleProfitBalance'

const RecentAppleProfitCountdownRow = ({ vaultKey }: { vaultKey: VaultKey }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    pricePerFullShare,
    userData: { appleAtLastUserAction, userShares, lastUserActionTime },
  } = useVaultPoolByKey(vaultKey)
  const applePriceBusd = usePriceAppleBusd()
  const { hasAutoEarnings, autoAppleToDisplay, autoUsdToDisplay } = getAppleVaultEarnings(
    account,
    appleAtLastUserAction,
    userShares,
    pricePerFullShare,
    applePriceBusd.toNumber(),
  )

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  return (
    <Flex alignItems="center" justifyContent="space-between">
      <Text fontSize="14px">{`${t('Recent APPLE profit')}:`}</Text>
      {hasAutoEarnings && (
        <RecentAppleProfitBalance
          appleToDisplay={autoAppleToDisplay}
          dollarValueToDisplay={autoUsdToDisplay}
          dateStringToDisplay={dateStringToDisplay}
        />
      )}
    </Flex>
  )
}

export default RecentAppleProfitCountdownRow
