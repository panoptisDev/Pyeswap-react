import BigNumber from 'bignumber.js'
import { convertSharesToApple } from 'views/Pools/helpers'
import { multicallv2 } from 'utils/multicall'
import appleVaultAbi from 'config/abi/appleVault.json'
import { getAppleVaultAddress } from 'utils/addressHelpers'
import { BIG_ZERO } from 'utils/bigNumber'

export const fetchPublicVaultData = async () => {
  try {
    const calls = [
      'getPricePerFullShare',
      'totalShares',
      'calculateHarvestAppleRewards',
      'calculateTotalPendingAppleRewards',
    ].map((method) => ({
      address: getAppleVaultAddress(),
      name: method,
    }))

    const [[sharePrice], [shares], [estimatedAppleBountyReward], [totalPendingAppleHarvest]] = await multicallv2(
      appleVaultAbi,
      calls,
    )

    const totalSharesAsBigNumber = shares ? new BigNumber(shares.toString()) : BIG_ZERO
    const sharePriceAsBigNumber = sharePrice ? new BigNumber(sharePrice.toString()) : BIG_ZERO
    const totalAppleInVaultEstimate = convertSharesToApple(totalSharesAsBigNumber, sharePriceAsBigNumber)
    return {
      totalShares: totalSharesAsBigNumber.toJSON(),
      pricePerFullShare: sharePriceAsBigNumber.toJSON(),
      totalAppleInVault: totalAppleInVaultEstimate.appleAsBigNumber.toJSON(),
      estimatedAppleBountyReward: new BigNumber(estimatedAppleBountyReward.toString()).toJSON(),
      totalPendingAppleHarvest: new BigNumber(totalPendingAppleHarvest.toString()).toJSON(),
    }
  } catch (error) {
    return {
      totalShares: null,
      pricePerFullShare: null,
      totalAppleInVault: null,
      estimatedAppleBountyReward: null,
      totalPendingAppleHarvest: null,
    }
  }
}

export const fetchVaultFees = async () => {
  try {
    const calls = ['performanceFee', 'callFee', 'withdrawFee', 'withdrawFeePeriod'].map((method) => ({
      address: getAppleVaultAddress(),
      name: method,
    }))

    const [[performanceFee], [callFee], [withdrawalFee], [withdrawalFeePeriod]] = await multicallv2(appleVaultAbi, calls)

    return {
      performanceFee: performanceFee.toNumber(),
      callFee: callFee.toNumber(),
      withdrawalFee: withdrawalFee.toNumber(),
      withdrawalFeePeriod: withdrawalFeePeriod.toNumber(),
    }
  } catch (error) {
    return {
      performanceFee: null,
      callFee: null,
      withdrawalFee: null,
      withdrawalFeePeriod: null,
    }
  }
}

export default fetchPublicVaultData
