import React from 'react'
import { useMatchBreakpoints } from 'uikit'
import { DeserializedPool } from 'state/types'
import { useVaultPoolByKey } from 'state/pools/hooks'
import { useTranslation } from 'contexts/Localization'
import Apr from '../Apr'
import { convertSharesToApple } from '../../../helpers'
import CellLayout from "../CellLayout";

interface AprCellProps {
  pool: DeserializedPool
}


const AutoAprCell: React.FC<AprCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()

  const {
    userData: { userShares },
    fees: { performanceFeeAsDecimal },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)

  const { appleAsBigNumber } = convertSharesToApple(userShares, pricePerFullShare)

  return (
      <CellLayout label={t('APY')}>
        <Apr
          pool={pool}
          stakedBalance={appleAsBigNumber}
          performanceFee={performanceFeeAsDecimal}
          showIcon={!isMobile}
        />
      </CellLayout>
  )
}

export default AutoAprCell
