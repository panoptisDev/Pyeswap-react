import React from 'react'
import { Flex, Text, IconButton, AddIcon, MinusIcon, useModal, Skeleton } from 'uikit'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from 'utils/formatBalance'
import { DeserializedPool } from 'state/types'
import { usePriceAppleBusd } from 'state/farms/hooks'
import { useVaultPoolByKey } from 'state/pools/hooks'
import Balance from 'components/Balance'
import NotEnoughTokensModal from '../../PoolCard/Modals/NotEnoughTokensModal'
import { convertSharesToApple } from '../../../helpers'
import VaultStakeModal from '../VaultStakeModal'

interface HasStakeActionProps {
  pool: DeserializedPool
  stakingTokenBalance: BigNumber
  performanceFee: number
}

const HasSharesActions: React.FC<HasStakeActionProps> = ({ pool, stakingTokenBalance, performanceFee }) => {
  const {
    userData: { userShares },
    pricePerFullShare,
  } = useVaultPoolByKey(pool.vaultKey)
  const { stakingToken } = pool
  const { appleAsBigNumber, appleAsNumberBalance } = convertSharesToApple(userShares, pricePerFullShare)
  const applePriceBusd = usePriceAppleBusd()
  const stakedDollarValue = applePriceBusd.gt(0)
    ? getBalanceNumber(appleAsBigNumber.multipliedBy(applePriceBusd), stakingToken.decimals)
    : 0

  const [onPresentTokenRequired] = useModal(<NotEnoughTokensModal tokenSymbol={stakingToken.symbol} />)
  const [onPresentStake] = useModal(
    <VaultStakeModal stakingMax={stakingTokenBalance} performanceFee={performanceFee} pool={pool} />,
  )
  const [onPresentUnstake] = useModal(<VaultStakeModal stakingMax={appleAsBigNumber} pool={pool} isRemovingStake />)

  return (
    <Flex justifyContent="space-between" alignItems="center" px='8px'>
      <Flex flexDirection="column">
        <Balance fontSize="26px" bold value={appleAsNumberBalance} decimals={5} />
        <Text fontSize="13px" color="textSubtle">
          {applePriceBusd.gt(0) ? (
            <Balance value={stakedDollarValue} fontSize="13px" color="textSubtle" decimals={2} prefix="~" unit=" USD" />
          ) : (
            <Skeleton mt="1px" height={16} width={64} />
          )}
        </Text>
      </Flex>
      <Flex>
        <IconButton variant="light" onClick={onPresentUnstake} mr="6px">
          <MinusIcon color="text" width="14px" />
        </IconButton>
        <IconButton variant="primary" onClick={stakingTokenBalance.gt(0) ? onPresentStake : onPresentTokenRequired}>
          <AddIcon color="white" width="14px" height="14px" />
        </IconButton>
      </Flex>
    </Flex>
  )
}

export default HasSharesActions
