import React from 'react'
import { Skeleton, Text, Flex, Box, useModal } from 'uikit'
import { DeserializedPool } from 'state/types'
import BigNumber from 'bignumber.js'
import { PoolCategory } from 'config/constants/types'
import { BIG_ZERO } from 'utils/bigNumber'
import { formatNumber, getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import CollectModal from '../../PoolCard/Modals/CollectModal'
import CellLayout from "../CellLayout";

interface EarningsCellProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const EarningsCell: React.FC<EarningsCellProps> = ({ pool, account, userDataLoaded }) => {
  const { t } = useTranslation()
  const { sousId, earningToken, poolCategory, userData, earningTokenPrice } = pool
  const isManualApplePool = sousId === 0

  const earnings = userData?.pendingReward ? new BigNumber(userData.pendingReward) : BIG_ZERO
  const earningTokenBalance = getBalanceNumber(earnings, earningToken.decimals)
  const earningTokenDollarBalance = getBalanceNumber(earnings.multipliedBy(earningTokenPrice), earningToken.decimals)
  const hasEarnings = account && earnings.gt(0)
  const fullBalance = getFullDisplayBalance(earnings, earningToken.decimals)
  const formattedBalance = formatNumber(earningTokenBalance, 3, 3)
  const isBnbPool = poolCategory === PoolCategory.BINANCE

  const labelText = t('%asset% Earned', { asset: earningToken.symbol })

  const [onPresentCollect] = useModal(
    <CollectModal
      formattedBalance={formattedBalance}
      fullBalance={fullBalance}
      earningToken={earningToken}
      earningsDollarValue={earningTokenDollarBalance}
      sousId={sousId}
      isBnbPool={isBnbPool}
      isCompoundPool={isManualApplePool}
    />,
  )

  const handleEarningsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentCollect()
  }

  return (
    <CellLayout label={labelText}>
        {!userDataLoaded && account ? (
          <Skeleton width="80px" height="16px" />
        ) : (
          <>
            <Flex>
              <Box onClick={hasEarnings ? handleEarningsClick : undefined}>
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
            </Flex>
          </>
        )}
    </CellLayout>
  )
}

export default EarningsCell
