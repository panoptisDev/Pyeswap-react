import { ChainId } from '@pyeswap/swap-sdk'

const NETWORK_URLS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'https://bsc-dataseed1.defibit.io',
  [ChainId.TESTNET]: 'https://data-seed-prebsc-2-s2.binance.org:8545',
}

export default NETWORK_URLS
