import { ThunkAction } from 'redux-thunk'
import { AnyAction } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import {
  SerializedFarmConfig,
  DeserializedFarmConfig, Address, SerializedToken, SerializedPoolConfig, DeserializedPoolConfig,
} from 'config/constants/types'

export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, State, unknown, AnyAction>

export interface BigNumberToJson {
  type: 'BigNumber'
  hex: string
}

export type SerializedBigNumber = string

interface SerializedFarmUserData {
  allowance: string
  tokenBalance: string
  stakedBalance: string
  earnings: string
}

export interface DeserializedFarmUserData {
  allowance: BigNumber
  tokenBalance: BigNumber
  stakedBalance: BigNumber
  earnings: BigNumber
}

export interface SerializedFarm extends SerializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: SerializedBigNumber
  lpTotalInQuoteToken?: SerializedBigNumber
  lpTotalSupply?: SerializedBigNumber
  tokenPriceVsQuote?: SerializedBigNumber
  poolWeight?: SerializedBigNumber
  userData?: SerializedFarmUserData
}

export interface DeserializedFarm extends DeserializedFarmConfig {
  tokenPriceBusd?: string
  quoteTokenPriceBusd?: string
  tokenAmountTotal?: BigNumber
  lpTotalInQuoteToken?: BigNumber
  lpTotalSupply?: BigNumber
  tokenPriceVsQuote?: BigNumber
  poolWeight?: BigNumber
  userData?: DeserializedFarmUserData
}


// Slices states

export interface SerializedFarmsState {
  data: SerializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
}

export interface DeserializedFarmsState {
  data: DeserializedFarm[]
  loadArchivedFarmsData: boolean
  userDataLoaded: boolean
}

// Block

export interface BlockState {
  currentBlock: number
  initialBlock: number
}


// Pools
export enum VaultKey {
  AppleVault = 'appleVault'
}
interface CorePoolProps {
  startBlock?: number
  endBlock?: number
  apr?: number
  rawApr?: number
  stakingTokenPrice?: number
  earningTokenPrice?: number
  vaultKey?: VaultKey
}

export interface SerializedPool extends SerializedPoolConfig, CorePoolProps {
  totalStaked?: SerializedBigNumber
  stakingLimit?: SerializedBigNumber
  userData?: {
    allowance: SerializedBigNumber
    stakingTokenBalance: SerializedBigNumber
    stakedBalance: SerializedBigNumber
    pendingReward: SerializedBigNumber
  }
}

export interface VaultFees {
  performanceFee: number
  callFee: number
  withdrawalFee: number
  withdrawalFeePeriod: number
}

export interface VaultUser {
  isLoading: boolean
  userShares: string
  appleAtLastUserAction: string
  lastDepositedTime: string
  lastUserActionTime: string
}

export interface AppleVault {
  totalShares?: string
  pricePerFullShare?: string
  totalAppleInVault?: string
  estimatedAppleBountyReward?: string
  totalPendingAppleHarvest?: string
  fees?: VaultFees
  userData?: VaultUser
}

export interface PoolsState {
  data: SerializedPool[]
  appleVault: AppleVault
  userDataLoaded: boolean
}

export interface DeserializedPool extends DeserializedPoolConfig, CorePoolProps {
  totalStaked?: BigNumber
  stakingLimit?: BigNumber
  userData?: {
    allowance: BigNumber
    stakingTokenBalance: BigNumber
    stakedBalance: BigNumber
    pendingReward: BigNumber
  }
}


// Global state

export interface State {
  block: BlockState
  farms: SerializedFarmsState
  pools: PoolsState
}
