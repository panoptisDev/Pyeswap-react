import React from 'react'
import styled from 'styled-components'
import {Flex, useModal, CalculateIcon, Skeleton, FlexProps, IconButton} from 'uikit'
import RoiCalculatorModal from 'components/RoiCalculatorModal'
import Balance from 'components/Balance'
import { DeserializedPool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'
import { vaultPoolConfig } from 'config/constants/pools'

const AprLabelContainer = styled(Flex)`
  cursor: pointer;
  
  &:hover {
    opacity: 0.5;
  }
`

interface AprProps extends FlexProps {
  pool: DeserializedPool
  stakedBalance: BigNumber
  showIcon: boolean
  performanceFee?: number
}

const Apr: React.FC<AprProps> = ({ pool, showIcon, stakedBalance, performanceFee = 0, ...props }) => {
  const {
    stakingToken,
    earningToken,
    isFinished,
    earningTokenPrice,
    stakingTokenPrice,
    userData,
    apr,
    rawApr,
    vaultKey,
  } = pool
  const { t } = useTranslation()

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO

  const apyModalLink = stakingToken.address ? `/swap?outputCurrency=${stakingToken.address}` : '/swap'

  const [onPresentApyModal] = useModal(
    <RoiCalculatorModal
      earningTokenPrice={earningTokenPrice}
      stakingTokenPrice={stakingTokenPrice}
      stakingTokenBalance={stakedBalance.plus(stakingTokenBalance)}
      apr={vaultKey ? rawApr : apr}
      stakingTokenSymbol={stakingToken.symbol}
      linkLabel={t('Get %symbol%', { symbol: stakingToken.symbol })}
      linkHref={apyModalLink}
      earningTokenSymbol={earningToken.symbol}
      autoCompoundFrequency={vaultPoolConfig[vaultKey]?.autoCompoundFrequency ?? 0}
      performanceFee={performanceFee}
    />,
  )

  const openRoiModal = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    onPresentApyModal()
  }

  return (
    <AprLabelContainer alignItems="center" {...props}>
      {apr || isFinished ? (
        <>
          <Balance
            onClick={openRoiModal}
            fontSize="15px"
            isDisabled={isFinished}
            value={isFinished ? 0 : apr}
            decimals={2}
            unit="%"
          />
          {!isFinished && showIcon && (
            <IconButton variant="text" scale="sm" ml='4px' style={{ width: 14, height: 14 }}>
              <CalculateIcon color='textSubtle' width="14px" />
            </IconButton>
          )}
        </>
      ) : (
        <Skeleton width="80px" height="16px" />
      )}
    </AprLabelContainer>
  )
}

export default Apr
