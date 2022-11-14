import { useEffect, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { simpleRpcProvider } from 'utils/providers'
import useRefresh from 'hooks/useRefresh'
import {
  fetchPoolsPublicDataAsync,
  fetchPoolsUserDataAsync,
  fetchAppleVaultPublicData,
  fetchAppleVaultUserData,
  fetchAppleVaultFees,
  fetchPoolsStakingLimitsAsync,
  initialPoolVaultState,
} from '.'
import { State, DeserializedPool, VaultKey } from '../types'
import { transformPool } from './helpers'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { slowRefresh } = useRefresh()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      const blockNumber = await simpleRpcProvider.getBlockNumber()
      dispatch(fetchPoolsPublicDataAsync(blockNumber))
    }

    fetchPoolsPublicData()
    dispatch(fetchPoolsStakingLimitsAsync())
  }, [dispatch, slowRefresh])
}

export const useFetchUserPools = (account) => {
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (account) {
      dispatch(fetchPoolsUserDataAsync(account))
    }
  }, [account, dispatch, fastRefresh])
}

export const usePools = (): { pools: DeserializedPool[]; userDataLoaded: boolean } => {
  const { pools, userDataLoaded } = useSelector((state: State) => ({
    pools: state.pools.data,
    userDataLoaded: state.pools.userDataLoaded,
  }))
  return { pools: pools.map(transformPool), userDataLoaded }
}

export const usePool = (sousId: number): { pool: DeserializedPool; userDataLoaded: boolean } => {
  const { pool, userDataLoaded } = useSelector((state: State) => ({
    pool: state.pools.data.find((p) => p.sousId === sousId),
    userDataLoaded: state.pools.userDataLoaded,
  }))
  return { pool: transformPool(pool), userDataLoaded }
}

export const useFetchAppleVault = () => {
  const { account } = useWeb3React()
  const { fastRefresh } = useRefresh()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchAppleVaultPublicData())
  }, [dispatch, fastRefresh])

  useEffect(() => {
    dispatch(fetchAppleVaultUserData({ account }))
  }, [dispatch, fastRefresh, account])

  useEffect(() => {
    dispatch(fetchAppleVaultFees())
  }, [dispatch])
}

export const useAppleVault = () => {
  return useVaultPoolByKey(VaultKey.AppleVault)
}

export const useVaultPools = () => {
  return {
    [VaultKey.AppleVault]: useVaultPoolByKey(VaultKey.AppleVault),
  }
}

export const useVaultPoolByKey = (key: VaultKey) => {
  const {
    totalShares: totalSharesAsString,
    pricePerFullShare: pricePerFullShareAsString,
    totalAppleInVault: totalAppleInVaultAsString,
    estimatedAppleBountyReward: estimatedAppleBountyRewardAsString,
    totalPendingAppleHarvest: totalPendingAppleHarvestAsString,
    fees: { performanceFee, callFee, withdrawalFee, withdrawalFeePeriod },
    userData: {
      isLoading,
      userShares: userSharesAsString,
      appleAtLastUserAction: appleAtLastUserActionAsString,
      lastDepositedTime,
      lastUserActionTime,
    },
  } = useSelector((state: State) => (key ? state.pools[key] : initialPoolVaultState))

  const estimatedAppleBountyReward = useMemo(() => {
    return new BigNumber(estimatedAppleBountyRewardAsString)
  }, [estimatedAppleBountyRewardAsString])

  const totalPendingAppleHarvest = useMemo(() => {
    return new BigNumber(totalPendingAppleHarvestAsString)
  }, [totalPendingAppleHarvestAsString])

  const totalShares = useMemo(() => {
    return new BigNumber(totalSharesAsString)
  }, [totalSharesAsString])

  const pricePerFullShare = useMemo(() => {
    return new BigNumber(pricePerFullShareAsString)
  }, [pricePerFullShareAsString])

  const totalAppleInVault = useMemo(() => {
    return new BigNumber(totalAppleInVaultAsString)
  }, [totalAppleInVaultAsString])

  const userShares = useMemo(() => {
    return new BigNumber(userSharesAsString)
  }, [userSharesAsString])

  const appleAtLastUserAction = useMemo(() => {
    return new BigNumber(appleAtLastUserActionAsString)
  }, [appleAtLastUserActionAsString])

  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  return {
    totalShares,
    pricePerFullShare,
    totalAppleInVault,
    estimatedAppleBountyReward,
    totalPendingAppleHarvest,
    fees: {
      performanceFeeAsDecimal,
      performanceFee,
      callFee,
      withdrawalFee,
      withdrawalFeePeriod,
    },
    userData: {
      isLoading,
      userShares,
      appleAtLastUserAction,
      lastDepositedTime,
      lastUserActionTime,
    },
  }
}
