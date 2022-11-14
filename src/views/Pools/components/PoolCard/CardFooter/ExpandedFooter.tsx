import React from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { useTranslation } from 'contexts/Localization'
import {
  Flex,
  MetamaskIcon,
  Text,
  TooltipText,
  LinkExternal,
  TimerIcon,
  Skeleton,
  useTooltip,
  Button,
  Link,
  HelpIcon,
} from 'uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { useBlock } from 'state/block/hooks'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import { DeserializedPool } from 'state/types'
// eslint-disable-next-line import/named
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { registerToken } from 'utils/wallet'
import { getBscScanLink } from 'utils'
import Balance from 'components/Balance'
import { getPoolBlockInfo } from 'views/Pools/helpers'
import { BIG_ZERO } from 'utils/bigNumber'

interface ExpandedFooterProps {
  pool: DeserializedPool
  account: string
}

const ExpandedWrapper = styled(Flex)`
  border-radius: 14px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  padding: 24px;
`

const ExpandedFooter: React.FC<ExpandedFooterProps> = ({ pool, account }) => {
  const { t } = useTranslation()
  const { currentBlock } = useBlock()

  const {
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    contractAddress,
    sousId,
    vaultKey,
  } = pool

  const {
    totalAppleInVault,
    fees: { performanceFee },
  } = useVaultPoolByKey(vaultKey)

  const vaultPools = useVaultPools()
  const appleInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalAppleInVault)
  }, BIG_ZERO)

  const tokenAddress = earningToken.address || ''
  const poolContractAddress = getAddress(contractAddress)
  const appleVaultContractAddress = getVaultPoolAddress(vaultKey)
  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const isManualApplePool = sousId === 0

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t('Subtracted automatically from each yield harvest and burned.'),
    { placement: 'bottom-start' },
  )

  const getTotalStakedBalance = () => {
    if (vaultKey) {
      return getBalanceNumber(totalAppleInVault, stakingToken.decimals)
    }
    if (isManualApplePool) {
      const manualAppleTotalMinusAutoVault = new BigNumber(totalStaked).minus(appleInVaults)
      return getBalanceNumber(manualAppleTotalMinusAutoVault, stakingToken.decimals)
    }
    return getBalanceNumber(totalStaked, stakingToken.decimals)
  }

  const {
    targetRef: totalStakedTargetRef,
    tooltip: totalStakedTooltip,
    tooltipVisible: totalStakedTooltipVisible,
  } = useTooltip(t('Total amount of %symbol% staked in this pool', { symbol: stakingToken.symbol }), {
    placement: 'bottom',
  })

  return (
    <ExpandedWrapper flexDirection="column">
      <Flex mb="6px" justifyContent="space-between" alignItems="center">
        <Text fontSize='13px' color='textSubtle'>{t('Total staked')}:</Text>
        <Flex alignItems="center">
          {totalStaked && totalStaked.gte(0) ? (
            <>
              <Balance fontSize='13px' value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
              <span ref={totalStakedTargetRef}>
                <HelpIcon color="textSubtle" width="14px" ml="6px" />
              </span>
            </>
          ) : (
            <Skeleton width="90px" height="21px" />
          )}
          {totalStakedTooltipVisible && totalStakedTooltip}
        </Flex>
      </Flex>
      {stakingLimit && stakingLimit.gt(0) && (
        <Flex mb="6px" justifyContent="space-between">
          <Text fontSize='13px' color='textSubtle'>{t('Max. stake per user')}:</Text>
          <Text fontSize='15px'>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${stakingToken.symbol}`}</Text>
        </Flex>
      )}
      {shouldShowBlockCountdown && (
        <Flex mb="6px" justifyContent="space-between" alignItems="center">
          <Text fontSize='13px' color='textSubtle'>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
          {blocksRemaining || blocksUntilStart ? (
            <Flex alignItems="center">
              <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
                <Balance fontSize='13px' value={blocksToDisplay} decimals={0} color="primary" />
                <Text fontSize='13px' ml="4px" color="textSubtle" textTransform="lowercase">
                  {t('Blocks')}
                </Text>
                <TimerIcon ml="4px" color="textSubtle" width='14px'/>
              </Link>
            </Flex>
          ) : (
            <Skeleton width="54px" height="21px" />
          )}
        </Flex>
      )}
      {vaultKey && (
        <Flex mb="6px" justifyContent="space-between" alignItems="center">
          {tooltipVisible && tooltip}
          <TooltipText ref={targetRef} fontSize='13px' color='textSubtle'>
            {t('Performance Fee')}
          </TooltipText>
          <Flex alignItems="center">
            {performanceFee ? (
              <Text ml="4px" fontSize='13px'>
                {performanceFee / 100}%
              </Text>
            ) : (
              <Skeleton width="90px" height="21px" />
            )}
          </Flex>
        </Flex>
      )}
      <Flex mb="6px" mt='18px'>
        <LinkExternal href={`/info/token/${earningToken.address}`} bold={false} fontSize='13px'>
          {t('See Token Info')}
        </LinkExternal>
      </Flex>
      <Flex mb="6px">
        <LinkExternal href={earningToken.projectLink} bold={false} fontSize='13px'>
          {t('View Project Site')}
        </LinkExternal>
      </Flex>
      {poolContractAddress && (
        <Flex mb="6px">
          <LinkExternal
            href={`${BASE_BSC_SCAN_URL}/address/${vaultKey ? appleVaultContractAddress : poolContractAddress}`}
            bold={false}
            fontSize='13px'
          >
            {t('View Contract')}
          </LinkExternal>
        </Flex>
      )}
      {account && isMetaMaskInScope && tokenAddress && (
        <Flex>
          <Button
            variant="text"
            p="0"
            height="auto"
            onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals)}
          >
            <Text color="primary" fontSize="13px">
              {t('Add to Metamask')}
            </Text>
            <MetamaskIcon ml="6px" width='14px' />
          </Button>
        </Flex>
      )}
    </ExpandedWrapper>
  )
}

export default React.memo(ExpandedFooter)
