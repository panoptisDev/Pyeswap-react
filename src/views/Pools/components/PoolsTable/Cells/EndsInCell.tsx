import React from 'react'
import { Flex, Link, Skeleton, Text, TimerIcon } from 'uikit'
import { getBscScanLink } from 'utils'
import { DeserializedPool } from 'state/types'
import { useBlock } from 'state/block/hooks'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import CellLayout from "../CellLayout";

interface FinishCellProps {
  pool: DeserializedPool
}


const EndsInCell: React.FC<FinishCellProps> = ({ pool }) => {
  const { sousId, totalStaked, startBlock, endBlock, isFinished } = pool
  const { currentBlock } = useBlock()
  const { t } = useTranslation()

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const isApplePool = sousId === 0

  const renderBlocks = shouldShowBlockCountdown ? (
    <Flex alignItems="center">
      <Flex flex="1.3">
        <Balance fontSize="15px" value={blocksToDisplay} decimals={0} />
        <Text ml="4px" textTransform="lowercase" fontSize="15px" color='textSubtle'>
          {t('Blocks')}
        </Text>
      </Flex>
      <Flex flex="1">
        <Link
          external
          href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}
          onClick={(e) => e.stopPropagation()}
        >
          <TimerIcon ml="4px" width='14px' color='textSubtle' />
        </Link>
      </Flex>
    </Flex>
  ) : (
    <Text>-</Text>
  )

  // A bit hacky way to determine if public data is loading relying on totalStaked
  // Opted to go for this since we don't really need a separate publicDataLoaded flag
  // anywhere else
  const isLoadingBlockData = !currentBlock || (!blocksRemaining && !blocksUntilStart)
  const isLoadingPublicData = hasPoolStarted ? !totalStaked.gt(0) || isLoadingBlockData : isLoadingBlockData
  const showLoading = isLoadingPublicData && !isApplePool && !isFinished
  return (
      <CellLayout label={hasPoolStarted || !shouldShowBlockCountdown ? t('Ends in') : t('Starts in')}>
        {showLoading ? <Skeleton width="80px" height="16px" /> : renderBlocks}
      </CellLayout>
  )
}

export default EndsInCell
