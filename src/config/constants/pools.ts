import { serializeTokens } from './tokens'
import { SerializedPoolConfig, PoolCategory } from './types'

const serializedTokens = serializeTokens()

export const vaultPoolConfig = {} as const

const pools: SerializedPoolConfig[] = [
/**   {
  *  sousId: 0,
  * stakingToken: serializedTokens.apple,
  *  earningToken: serializedTokens.apple,
  *  contractAddress: {
  *    97: '',
  *    56: '0xC6994c759B707370782A3d318F77ED5e615293E7',
  *  },
  *  poolCategory: PoolCategory.CORE,
  *  harvest: true,
  *  tokenPerBlock: '10',
  *  sortOrder: 1,
  *  isFinished: false,
 * },
 */ 
  {
    sousId: 1,
    stakingToken: serializedTokens.apple,
    earningToken: serializedTokens.cherry,
    contractAddress: {
      97: '',
      56: '0xf0Aaa0d2BdbC324552c82122a636F15239941333',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 2,
    tokenPerBlock: '0.015',
    isFinished: false,
  },
  {
    sousId: 2,
    stakingToken: serializedTokens.pye,
    earningToken: serializedTokens.apple,
    contractAddress: {
      97: '',
      56: '0xb68fd3d62154EA738e5B0a42Fc620CE90Bd8a472',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 2,
    tokenPerBlock: '6.7568',
    isFinished: false,
  },
  {
    sousId: 301,
    stakingToken: serializedTokens.cherry,
    earningToken: serializedTokens.pye,
    contractAddress: {
      97: '',
      56: '0xf287462779e191745398f752b11c7de1052bc72f',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '27',
    isFinished: false,
  },
  {
    sousId: 303,
    stakingToken: serializedTokens.cherry,
    earningToken: serializedTokens.pye,
    contractAddress: {
      97: '',
      56: '0x7BbCF683CA71583F732d422910F732Fe2CcF17DF',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '120',
    isFinished: false,
  },
  {
    sousId: 306,
    stakingToken: serializedTokens.cherry,
    earningToken: serializedTokens.force,
    contractAddress: {
      97: '',
      56: '0x49f3d7B29954AC02990628462FbBbc979233BE94',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '48',
    isFinished: false,
  },
  {
    sousId: 307,
    stakingToken: serializedTokens.cherry,
    earningToken: serializedTokens.minidoge,
    contractAddress: {
      97: '',
      56: '0x6617CED727531B29ca6066348ebF7F8476D79443',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '665509',
    isFinished: false,
  },
  {
    sousId: 308,
    stakingToken: serializedTokens.cherry,
    earningToken: serializedTokens.symbull,
    contractAddress: {
      97: '',
      56: '0x4cb50C70781F83364Da65deB7571BC542140003e',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '13.5',
    isFinished: false,
  },
  {
    sousId: 302,
    stakingToken: serializedTokens.apple,
    earningToken: serializedTokens.pye,
    contractAddress: {
      97: '',
      56: '0x60057381d83b53fb09059cc04268b8324d715700',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '11.57',
    isFinished: false,
  },
  {
    sousId: 309,
    stakingToken: serializedTokens.minidoge,
    earningToken: serializedTokens.force,
    contractAddress: {
      97: '',
      56: '0x754fd531423271B1b807B257f6946439856432D8',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '19',
    isFinished: false,
  },
  {
    sousId: 310,
    stakingToken: serializedTokens.symbull,
    earningToken: serializedTokens.force,
    contractAddress: {
      97: '',
      56: '0x5e8884405Ea863A44B52584a42e2511f7f9dfBb2',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '14',
    isFinished: false,
  },
  {
    sousId: 311,
    stakingToken: serializedTokens.treasure,
    earningToken: serializedTokens.force,
    contractAddress: {
      97: '',
      56: '0x9CbBc5DBe8b968CaD28E55292d6ad645d502d6eA',
    },
    poolCategory: PoolCategory.CORE,
    harvest: true,
    sortOrder: 999,
    tokenPerBlock: '14',
    isFinished: false,
  },
]

export default pools

