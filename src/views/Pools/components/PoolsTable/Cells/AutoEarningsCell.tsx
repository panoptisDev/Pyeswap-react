import React from 'react'
import styled from 'styled-components'
import { Skeleton, Text, useTooltip, HelpIcon, Flex, Box, useMatchBreakpoints } from 'uikit'
import { DeserializedPool } from 'state/types'
import Balance from 'components/Balance'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import { getAppleVaultEarnings } from 'views/Pools/helpers'
import CellLayout from "../CellLayout";

interface AutoEarningsCellProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const HelpIconWrapper = styled.div`
  align-self: center;
`

const AutoEarningsCell: React.FC<AutoEarningsCellProps> = ({ pool, account, userDataLoaded }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { earningTokenPrice } = pool

  const {
    userData: { appleAtLastUserAction, userShares, lastUserActionTime },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { hasAutoEarnings, autoAppleToDisplay, autoUsdToDisplay } = getAppleVaultEarnings(
    account,
    appleAtLastUserAction,
    userShares,
    pricePerFullShare,
    earningTokenPrice,
  )

  const labelText = t('Recent APPLE profit')
  const earningTokenBalance = autoAppleToDisplay
  const hasEarnings = hasAutoEarnings
  const earningTokenDollarBalance = autoUsdToDisplay

  const lastActionInMs = lastUserActionTime && parseInt(lastUserActionTime) * 1000
  const dateTimeLastAction = new Date(lastActionInMs)
  const dateStringToDisplay = dateTimeLastAction.toLocaleString()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={autoAppleToDisplay} decimals={3} bold unit=" APPLE" />
      <Balance fontSize="16px" value={autoUsdToDisplay} decimals={2} bold prefix="~$" />
      {t('Earned since your last action')}
      <Text>{dateStringToDisplay}</Text>
    </>,
    { placement: 'bottom' },
  )

  return (
    <CellLayout label={labelText}>
        {!userDataLoaded && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            {tooltipVisible && tooltip}
            <Flex>
              <Box>
                <Balance
                  mt="4px"
                  fontSize='15px'
                  color={hasEarnings ? 'primary' : 'text'}
                  decimals={hasEarnings ? 5 : 1}
                  value={hasEarnings ? earningTokenBalance : 0}
                />
                {hasEarnings ? (
                  <>
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
                  <Text fontSize="13px" color="textDisabled">
                    0 USD
                  </Text>
                )}
              </Box>
              {hasEarnings && !isMobile && (
                <HelpIconWrapper ref={targetRef}>
                  <HelpIcon color="textSubtle" />
                </HelpIconWrapper>
              )}
            </Flex>
          </>
        )}
    </CellLayout>
  )
}

export default AutoEarningsCell
