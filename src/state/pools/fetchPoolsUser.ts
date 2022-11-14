import poolsConfig from 'config/constants/pools'
import smartChef from 'config/abi/sousChefV2.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import {getMasterchefContract, getSouschefContract} from 'utils/contractHelpers'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'

// Pool 0, Apple / Apple is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'BNB')
const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'BNB')
const nonMasterPools = poolsConfig.filter((pool) => pool.sousId !== 0 && pool.sousId !== 1 && pool.sousId !== 2)
const cherryChefPool = getSouschefContract(1);
const masterChefContract = getMasterchefContract()

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'allowance',
    params: [account, getAddress(pool.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // BNB pools
  const bnbBalance = await simpleRpcProvider.getBalance(account)
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance.toString()).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [account],
  }))
  const userInfo = await multicall(smartChef, calls)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  // Apple / Apple pool
  const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)
  const { amount: cherryPoolAmount } = await cherryChefPool.userInfo('0', account)
  const { amount: pyePoolAmount } = await masterChefContract.userInfo('3', account)

  return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON(), 1: new BigNumber(cherryPoolAmount.toString()).toJSON(), 2: new BigNumber(pyePoolAmount.toString()).toJSON() }
}

export const fetchUserPendingRewards = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'pendingReward',
    params: [account],
  }))
  const res = await multicall(smartChef, calls)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )

  // Apple / Apple pool
  const pendingReward = await masterChefContract.pendingApple('0', account)
  const pendingPyeReward = await masterChefContract.pendingApple('3', account)
  const pendingCherryReward = await cherryChefPool.pendingReward('0', account)

  return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON(), 1: new BigNumber(pendingCherryReward.toString()).toJSON(), 2: new BigNumber(pendingPyeReward.toString()).toJSON() }
}
