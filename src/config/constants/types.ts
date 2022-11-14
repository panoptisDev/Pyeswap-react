import { Token } from '@pyeswap/swap-sdk'

export type TranslatableText =
  | string
  | {
  key: string
  data?: {
    [key: string]: string | number
  }
}
export interface Address {
  97?: string
  56: string
}

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
  projectLink?: string
}


interface FarmConfigBaseProps {
  pid: number
  lpSymbol: string
  lpAddresses: Address
  multiplier?: string
  isCommunity?: boolean
  dual?: {
    rewardPerBlock: number
    earnLabel: string
    endBlock: number
  }
}

export interface SerializedFarmConfig extends FarmConfigBaseProps {
  token: SerializedToken
  quoteToken: SerializedToken
}

export interface DeserializedFarmConfig extends FarmConfigBaseProps {
  token: Token
  quoteToken: Token
}


export type Images = {
  lg: string
  md: string
  sm: string
  ipfs?: string
}

export type PageMeta = {
  title: string
  description?: string
  image?: string
}

export enum PoolCategory {
  'COMMUNITY' = 'Community',
  'CORE' = 'Core',
  'BINANCE' = 'Binance', // Pools using native BNB behave differently than pools using a token
  'AUTO' = 'Auto',
}

interface PoolConfigBaseProps {
  sousId: number
  contractAddress: Address
  poolCategory: PoolCategory
  tokenPerBlock: string
  sortOrder?: number
  harvest?: boolean
  isFinished?: boolean
  enableEmergencyWithdraw?: boolean
}

export interface SerializedPoolConfig extends PoolConfigBaseProps {
  earningToken: SerializedToken
  stakingToken: SerializedToken
}

export interface DeserializedPoolConfig extends PoolConfigBaseProps {
  earningToken: Token
  stakingToken: Token
}


export enum FetchStatus {
  Idle = 'IDLE',
  Fetching = 'FETCHING',
  Fetched = 'FETCHED',
  Failed = 'FAILED',
}
