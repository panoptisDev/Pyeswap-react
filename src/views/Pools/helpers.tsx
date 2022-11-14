import BigNumber from 'bignumber.js'
import { vaultPoolConfig } from 'config/constants/pools'
import { DeserializedPool } from 'state/types'
import { getApy } from 'utils/compoundApyHelpers'
import { getBalanceNumber, getFullDisplayBalance, getDecimalAmount } from 'utils/formatBalance'

export const convertSharesToApple = (
  shares: BigNumber,
  applePerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(applePerFullShare, decimals)
  const amountInApple = new BigNumber(shares.multipliedBy(sharePriceNumber))
  const appleAsNumberBalance = getBalanceNumber(amountInApple, decimals)
  const appleAsBigNumber = getDecimalAmount(new BigNumber(appleAsNumberBalance), decimals)
  const appleAsDisplayBalance = getFullDisplayBalance(amountInApple, decimals, decimalsToRound)
  return { appleAsNumberBalance, appleAsBigNumber, appleAsDisplayBalance }
}

export const convertAppleToShares = (
  apple: BigNumber,
  applePerFullShare: BigNumber,
  decimals = 18,
  decimalsToRound = 3,
) => {
  const sharePriceNumber = getBalanceNumber(applePerFullShare, decimals)
  const amountInShares = new BigNumber(apple.dividedBy(sharePriceNumber))
  const sharesAsNumberBalance = getBalanceNumber(amountInShares, decimals)
  const sharesAsBigNumber = getDecimalAmount(new BigNumber(sharesAsNumberBalance), decimals)
  const sharesAsDisplayBalance = getFullDisplayBalance(amountInShares, decimals, decimalsToRound)
  return { sharesAsNumberBalance, sharesAsBigNumber, sharesAsDisplayBalance }
}

const MANUAL_POOL_AUTO_COMPOUND_FREQUENCY = 0

export const getAprData = (pool: DeserializedPool, performanceFee: number) => {
  const { vaultKey, apr } = pool

  //   Estimate & manual for now. 288 = once every 5 mins. We can change once we have a better sense of this
  const autoCompoundFrequency = MANUAL_POOL_AUTO_COMPOUND_FREQUENCY

  if (vaultKey) {
    const autoApr = getApy(apr, autoCompoundFrequency, 365, performanceFee) * 100
    return { apr: autoApr, autoCompoundFrequency }
  }
  return { apr, autoCompoundFrequency }
}

export const getAppleVaultEarnings = (
  account: string,
  appleAtLastUserAction: BigNumber,
  userShares: BigNumber,
  pricePerFullShare: BigNumber,
  earningTokenPrice: number,
) => {
  const hasAutoEarnings =
    account && appleAtLastUserAction && appleAtLastUserAction.gt(0) && userShares && userShares.gt(0)
  const { appleAsBigNumber } = convertSharesToApple(userShares, pricePerFullShare)
  const autoAppleProfit = appleAsBigNumber.minus(appleAtLastUserAction)
  const autoAppleToDisplay = autoAppleProfit.gte(0) ? getBalanceNumber(autoAppleProfit, 18) : 0

  const autoUsdProfit = autoAppleProfit.times(earningTokenPrice)
  const autoUsdToDisplay = autoUsdProfit.gte(0) ? getBalanceNumber(autoUsdProfit, 18) : 0
  return { hasAutoEarnings, autoAppleToDisplay, autoUsdToDisplay }
}

export const getPoolBlockInfo = (pool: DeserializedPool, currentBlock: number) => {
  const { startBlock, endBlock, isFinished } = pool
  const shouldShowBlockCountdown = Boolean(!isFinished && startBlock && endBlock)
  const blocksUntilStart = Math.max(startBlock - currentBlock, 0)
  const blocksRemaining = Math.max(endBlock - currentBlock, 0)
  const hasPoolStarted = blocksUntilStart === 0 && blocksRemaining > 0
  const blocksToDisplay = hasPoolStarted ? blocksRemaining : blocksUntilStart
  return { shouldShowBlockCountdown, blocksUntilStart, blocksRemaining, hasPoolStarted, blocksToDisplay }
}
