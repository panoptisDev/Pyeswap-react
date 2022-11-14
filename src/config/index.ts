import { ChainId } from '@pyeswap/swap-sdk'
import BigNumber from 'bignumber.js/bignumber'
import { BIG_TEN } from 'utils/bigNumber'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

export const BSC_BLOCK_TIME = 3

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}

// APPLE_PER_BLOCK details
// 40 APPLE is minted per block
// 20 APPLE per block is sent to Burn pool (A farm just for burning apple)
// 10 APPLE per block goes to APPLE syrup pool
// 9 APPLE per block goes to Yield farms and lottery
// APPLE_PER_BLOCK in config/index.ts = 40 as we only change the amount sent to the burn pool which is effectively a farm.
// APPLE/Block in src/views/Home/components/AppleDataRow.tsx = 15 (40 - Amount sent to burn pool)
export const APPLE_PER_BLOCK = 10
export const BLOCKS_PER_YEAR = (60 / BSC_BLOCK_TIME) * 60 * 24 * 365 // 10512000
export const APPLE_PER_YEAR = APPLE_PER_BLOCK * BLOCKS_PER_YEAR
export const BASE_URL = 'https://pyeswap.com'
export const BASE_ADD_LIQUIDITY_URL = `${BASE_URL}/add`
export const BASE_BSC_SCAN_URL = BASE_BSC_SCAN_URLS[ChainId.MAINNET]
export const DEFAULT_TOKEN_DECIMAL = BIG_TEN.pow(18)
export const DEFAULT_GAS_LIMIT = 1900000
