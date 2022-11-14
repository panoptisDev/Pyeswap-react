import React, { useMemo } from 'react'
import { Flex, Skeleton } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { DeserializedPool } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import CellLayout from "../CellLayout";

interface TotalStakedCellProps {
  pool: DeserializedPool
}


const TotalStakedCell: React.FC<TotalStakedCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { stakingToken, totalStaked, vaultKey } = pool
  const { totalAppleInVault } = useVaultPoolByKey(vaultKey)

  const totalStakedBalance = useMemo(() => {
    if (vaultKey) {
      return getBalanceNumber(totalAppleInVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }, [vaultKey, totalAppleInVault, totalStaked, stakingToken.decimals])

  return (
      <CellLayout label={t('Total staked')}>
        {totalStaked && totalStaked.gte(0) ? (
          <Flex alignItems="center">
            <Balance fontSize="15px" value={totalStakedBalance} decimals={0} unit={` ${stakingToken.symbol}`} />
          </Flex>
        ) : (
          <Skeleton width="80px" height="16px" />
        )}
      </CellLayout>
  )
}

export default TotalStakedCell
