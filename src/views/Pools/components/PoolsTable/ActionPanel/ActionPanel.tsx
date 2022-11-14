import React from 'react'
import styled, { keyframes, css } from 'styled-components'
import {
  Box,
  Button,
  Flex,
  HelpIcon,
  Link,
  LinkExternal,
  MetamaskIcon,
  Skeleton,
  Text,
  TimerIcon,
  useTooltip,
} from 'uikit'
import { BASE_BSC_SCAN_URL } from 'config'
import { getBscScanLink } from 'utils'
import { useBlock } from 'state/block/hooks'
import { useVaultPoolByKey, useVaultPools } from 'state/pools/hooks'
import BigNumber from 'bignumber.js'
import { DeserializedPool } from 'state/types'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'
import { CompoundingPoolTag, ManualPoolTag } from 'components/Tags'
// eslint-disable-next-line import/named
import { getAddress, getVaultPoolAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'
import { registerToken } from 'utils/wallet'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import { convertSharesToApple, getPoolBlockInfo } from 'views/Pools/helpers'
import Harvest from './Harvest'
import Stake from './Stake'
import Apr from '../Apr'
import AutoHarvest from './AutoHarvest'

const expandAnimation = keyframes`
  from {
    max-height: 0px;
  }
  to {
    max-height: 700px;
  }
`

const collapseAnimation = keyframes`
  from {
    max-height: 700px;
  }
  to {
    max-height: 0px;
  }
`

const StyledActionPanel = styled.div<{ expanded: boolean }>`
  animation: ${({ expanded }) =>
    expanded
      ? css`
        ${expandAnimation} 300ms linear forwards
      `
      : css`
        ${collapseAnimation} 300ms linear forwards
      `};
  overflow: hidden;
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 0 30px 30px;

  ${({ theme }) => theme.mediaQueries.lg} {
    flex-direction: row;
    padding: 0 30px 30px;
  }
`

const ActionContainer = styled.div`
  display: flex;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    align-items: center;
    flex-grow: 1;
    flex-basis: 0;
  }
`

const LinksWrapper = styled(Flex)`
  flex-wrap: wrap;
  flex-direction: column;
  column-gap: 30px;
  row-gap: 2px;


  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0;
    border: none;
    border-radius: 0;
    flex-grow: initial;
    display: block;
    column-gap: initial;
    row-gap: initial;
  }
  
`


const TagsContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-top: 26px;
  }

  > div {
    margin-right: 4px;
  }
`

type MediaBreakpoints = {
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  isXxl: boolean
}

interface ActionPanelProps {
  account: string
  pool: DeserializedPool
  userDataLoaded: boolean
  expanded: boolean
  breakpoints?: MediaBreakpoints
}

const InfoSection = styled(Box)`
  min-width: 185px;
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 0;
    border: none;
    border-radius: 0;
    flex-grow: initial;
    display: block;

  }
  ${({ theme }) => theme.mediaQueries.md} {
    min-width: 240px;
  }
`

const ActionPanel: React.FC<ActionPanelProps> = ({ account, pool, userDataLoaded, expanded }) => {
  const {
    sousId,
    stakingToken,
    earningToken,
    totalStaked,
    startBlock,
    endBlock,
    stakingLimit,
    contractAddress,
    userData,
    vaultKey,
  } = pool
  const { t } = useTranslation()
  const poolContractAddress = getAddress(contractAddress)
  const vaultContractAddress = getVaultPoolAddress(vaultKey)
  const { currentBlock } = useBlock()

  const { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay } =
    getPoolBlockInfo(pool, currentBlock)

  const isMetaMaskInScope = !!window.ethereum?.isMetaMask
  const tokenAddress = earningToken.address || ''

  const {
    totalAppleInVault,
    userData: { userShares },
    fees: { performanceFeeAsDecimal },
    pricePerFullShare,
  } = useVaultPoolByKey(vaultKey)

  const vaultPools = useVaultPools()
  const appleInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalAppleInVault)
  }, BIG_ZERO)

  const stakingTokenBalance = userData?.stakingTokenBalance ? new BigNumber(userData.stakingTokenBalance) : BIG_ZERO
  const stakedBalance = userData?.stakedBalance ? new BigNumber(userData.stakedBalance) : BIG_ZERO
  const { appleAsBigNumber } = convertSharesToApple(userShares, pricePerFullShare)
  const poolStakingTokenBalance = vaultKey
    ? appleAsBigNumber.plus(stakingTokenBalance)
    : stakedBalance.plus(stakingTokenBalance)

  const isManualApplePool = sousId === 0

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

  const manualTooltipText = t('You must harvest and compound your earnings from this pool manually.')
  const autoTooltipText = t(
    'Any funds you stake in this pool will be automagically harvested and restaked (compounded) for you.',
  )

  const {
    targetRef: tagTargetRef,
    tooltip: tagTooltip,
    tooltipVisible: tagTooltipVisible,
  } = useTooltip(vaultKey ? autoTooltipText : manualTooltipText, {
    placement: 'bottom-start',
  })

  const maxStakeRow = stakingLimit.gt(0) ? (
    <Flex justifyContent="space-between" alignItems='center' mb="6px">
      <Text fontSize='13px' color='textSubtle'>{t('Max. stake per user')}:</Text>
      <Text fontSize='15px' color='text'>{`${getFullDisplayBalance(stakingLimit, stakingToken.decimals, 0)} ${stakingToken.symbol}`}</Text>
    </Flex>
  ) : null

  const blocksRow =
    blocksRemaining || blocksUntilStart ? (
      <Flex justifyContent="space-between" alignItems='center' mb="6px">
        <Text fontSize='13px' color='textSubtle'>{hasPoolStarted ? t('Ends in') : t('Starts in')}:</Text>
        <Flex alignItems='center'>
          <Link external href={getBscScanLink(hasPoolStarted ? endBlock : startBlock, 'countdown')}>
            <Balance fontSize="15px" value={blocksToDisplay} decimals={0} color="text" />
            <Text ml="4px" fontSize="15px" color="textSubtle" textTransform="lowercase">
              {t('Blocks')}
            </Text>
            <TimerIcon ml="4px" color="textSubtle" width='14px' />
          </Link>
        </Flex>
      </Flex>
    ) : (
      <Skeleton width="56px" height="16px" />
    )

  const aprRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="6px">
      <Text fontSize='13px' color='textSubtle'>{vaultKey ? t('APY') : t('APR')}:</Text>
      <Apr
        pool={pool}
        showIcon
        stakedBalance={poolStakingTokenBalance}
        performanceFee={vaultKey ? performanceFeeAsDecimal : 0}
      />
    </Flex>
  )

  const totalStakedRow = (
    <Flex justifyContent="space-between" alignItems="center" mb="6px">
      <Text fontSize='13px' color='textSubtle' maxWidth='100%'>{t('Total staked')}:</Text>
      <Flex alignItems="center">
        {totalStaked && totalStaked.gte(0) ? (
          <>
            <Balance fontSize="15px" value={getTotalStakedBalance()} decimals={0} unit={` ${stakingToken.symbol}`} />
            <span ref={totalStakedTargetRef}>
              <HelpIcon color="textSubtle" width="14px" ml="4px" />
            </span>
          </>
        ) : (
          <Skeleton width="56px" height="16px" />
        )}
        {totalStakedTooltipVisible && totalStakedTooltip}
      </Flex>
    </Flex>
  )

  return (
    <StyledActionPanel expanded={expanded}>
      <InfoSection>
        <LinksWrapper>
          {maxStakeRow}
          {aprRow}
          {totalStakedRow}
          {shouldShowBlockCountdown && blocksRow}
          <Flex mb="6px" mt='18px'>
            <LinkExternal fontSize='13px' color='primary' href={`/info/token/${earningToken.address}`} bold={false}>
              {t('See Token Info')}
            </LinkExternal>
          </Flex>
          <Flex mb="6px">
            <LinkExternal fontSize='13px' color='primary' href={earningToken.projectLink} bold={false}>
              {t('View Project Site')}
            </LinkExternal>
          </Flex>
          {poolContractAddress && (
            <Flex mb="6px">
              <LinkExternal
                fontSize='13px'
                color='primary'
                bold={false}
                href={`${BASE_BSC_SCAN_URL}/address/${vaultKey ? vaultContractAddress : poolContractAddress}`}
              >
                {t('View Contract')}
              </LinkExternal>
            </Flex>
          )}
          {account && isMetaMaskInScope && tokenAddress && (
            <Flex mb="6px">
              <Button
                variant="text"
                p="0"
                height="auto"
                scale='sm'
                onClick={() => registerToken(tokenAddress, earningToken.symbol, earningToken.decimals)}
              >
                <Text fontSize='13px' color="primary">{t('Add to Metamask')}</Text>
                <MetamaskIcon ml="8px" width='14px' />
              </Button>
            </Flex>
          )}
        </LinksWrapper>
        <TagsContainer>
          {vaultKey ? <CompoundingPoolTag /> : <ManualPoolTag />}
          {tagTooltipVisible && tagTooltip}
          <span ref={tagTargetRef}>
            <HelpIcon ml="4px" width="14px" height="14px" color="textSubtle" />
          </span>
        </TagsContainer>
      </InfoSection>
      <ActionContainer>
        {pool.vaultKey ? (
          <AutoHarvest {...pool} userDataLoaded={userDataLoaded} />
        ) : (
          <Harvest {...pool} userDataLoaded={userDataLoaded} />
        )}
        <Stake pool={pool} userDataLoaded={userDataLoaded} />
      </ActionContainer>
    </StyledActionPanel>
  )
}

export default ActionPanel
