import React from 'react'
import { BIG_ZERO } from 'utils/bigNumber'
import { useMatchBreakpoints } from 'uikit'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import Apr from '../Apr'
import CellLayout from "../CellLayout";

interface AprCellProps {
  pool: DeserializedPool
}

const AprCell: React.FC<AprCellProps> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const { userData } = pool
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO

  return (
      <CellLayout label={t('APR')}>
        <Apr pool={pool} stakedBalance={stakedBalance} showIcon={!isMobile} />
      </CellLayout>
  )
}

export default AprCell
