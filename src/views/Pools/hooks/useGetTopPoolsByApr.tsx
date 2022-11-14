import { useState, useEffect, useMemo } from 'react'
import { usePriceAppleBusd } from 'state/farms/hooks'
import { useAppDispatch } from 'state'
import { orderBy } from 'lodash'
import { VaultKey, DeserializedPool } from 'state/types'
import { fetchAppleVaultFees, fetchPoolsPublicDataAsync } from 'state/pools'
import { simpleRpcProvider } from 'utils/providers'
import { useAppleVault, usePools } from 'state/pools/hooks'
// import { getAprData } from 'views/Pools/helpers'

enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  FETCHING = 'fetching',
  SUCCESS = 'success',
  FAILED = 'failed',
}

export function usePoolsWithVault() {
  const { pools: poolsWithoutAutoVault } = usePools()
  // const appleVault = useAppleVault()
  // const pools = useMemo(() => {
  //   const activePools = poolsWithoutAutoVault.filter((pool) => !pool.isFinished)
  //   const applePool = activePools.find((pool) => pool.sousId === 0)
  //   const appleAutoVault = { ...applePool, vaultKey: VaultKey.AppleVault }
  //   const appleAutoVaultWithApr = {
  //     ...appleAutoVault,
  //     apr: getAprData(appleAutoVault, appleVault.fees.performanceFeeAsDecimal).apr,
  //     rawApr: applePool.apr,
  //   }
  //   return [appleAutoVaultWithApr, ...poolsWithoutAutoVault]
  // }, [poolsWithoutAutoVault, appleVault.fees.performanceFeeAsDecimal])

  return poolsWithoutAutoVault
}

const useGetTopPoolsByApr = (isIntersecting: boolean) => {
  const dispatch = useAppDispatch()

  const [fetchStatus, setFetchStatus] = useState(FetchStatus.NOT_FETCHED)
  const [topPools, setTopPools] = useState<DeserializedPool[]>([null, null, null, null, null])

  const pools = usePoolsWithVault()

  const applePriceBusd = usePriceAppleBusd()

  useEffect(() => {
    const fetchPoolsPublicData = async () => {
      setFetchStatus(FetchStatus.FETCHING)
      const blockNumber = await simpleRpcProvider.getBlockNumber()

      try {
        await dispatch(fetchAppleVaultFees())
        await dispatch(fetchPoolsPublicDataAsync(blockNumber))
        setFetchStatus(FetchStatus.SUCCESS)
      } catch (e) {
        console.error(e)
        setFetchStatus(FetchStatus.FAILED)
      }
    }

    if (isIntersecting && fetchStatus === FetchStatus.NOT_FETCHED) {
      fetchPoolsPublicData()
    }
  }, [dispatch, setFetchStatus, fetchStatus, topPools, isIntersecting])

  useEffect(() => {
    const getTopPoolsByApr = (activePools: DeserializedPool[]) => {
      const sortedByApr = orderBy(activePools, (pool: DeserializedPool) => pool.apr || 0, 'desc')
      setTopPools(sortedByApr.slice(0, 5))
    }
    if (fetchStatus === FetchStatus.SUCCESS && !topPools[0]) {
      getTopPoolsByApr(pools)
    }
  }, [setTopPools, pools, fetchStatus, applePriceBusd, topPools])

  return { topPools }
}

export default useGetTopPoolsByApr
