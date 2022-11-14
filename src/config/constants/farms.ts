import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1, 2) should always be at the top of the file.
   */
 /** {
 *   pid: 0,
 *   lpSymbol: 'APPLE',
 *     97: '',
 *    56: '0x390deb8148397F04f59d99a224Da0e9365D5CB19',
 *   },
 *  token: serializedTokens.cherry,
 *   quoteToken: serializedTokens.wbnb,
 * },
 */ 
  {
    pid: 8,
    lpSymbol: 'PYE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x892b21411c781b242d4f2b6320796c698e49d32d',
    },
    token: serializedTokens.pye,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 9,
    lpSymbol: 'PYE-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xcfd6916e508254fc793d0ae0dc1ca48215bbd176',
    },
    token: serializedTokens.pye,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 23,
    lpSymbol: 'PYE-USDT LP',
    lpAddresses: {
      97: '',
      56: '0xFDd6BfD60A4f8e1CcF56bEefAa2E289dA0b6e497',
    },
    token: serializedTokens.pye,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 1,
    lpSymbol: 'APPLEPYE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x925c9025a99ff3a20e30734b7a9dda79ed9a55a2',
    },
    token: serializedTokens.apple,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'APPLEPYE-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x5fd579c32f8a7b42ec619c2e2cf5231d2ead52ab',
    },
    token: serializedTokens.apple,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 20,
    lpSymbol: 'APPLEPYE-USDT LP',
    lpAddresses: {
      97: '',
      56: '0x1157434FEA6979D0eb38B1bf69c29E9A89D1dC36',
    },
    token: serializedTokens.apple,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 4,
    lpSymbol: 'CHERRY-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xed262bfdaa1c07de4ac7dfb67d42f253cb929947',
    },
    token: serializedTokens.cherry,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 5,
    lpSymbol: 'CHERRY-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xba4b9b90af22d038f00f2d323c44922b2a41a084',
    },
    token: serializedTokens.cherry,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 21,
    lpSymbol: 'CHERRY-USDT LP',
    lpAddresses: {
      97: '',
      56: '0x5e13251E6AeC4A10617d34853cBa548e92cDe804',
    },
    token: serializedTokens.cherry,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 11,
    lpSymbol: 'FORCE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8832662e9C303c71cC40D9C4E339b2ebf49F3151',
    },
    token: serializedTokens.force,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 12,
    lpSymbol: 'FORCE-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x8af2d9BA53C59a25405D5Cd37bDdA599B742B8d5',
    },
    token: serializedTokens.force,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 22,
    lpSymbol: 'FORCE-USDT LP',
    lpAddresses: {
      97: '',
      56: '0x446d2349E2a09B1748286D609afd6798B727AC4f',
    },
    token: serializedTokens.force,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 34,
    lpSymbol: 'FORCE-PYE LP',
    lpAddresses: {
      97: '',
      56: '0x62D30ECDF7B4e1Bbd7B786c37f93322e52FEf366',
    },
    token: serializedTokens.force,
    quoteToken: serializedTokens.pye,
  },
  {
    pid: 26,
    lpSymbol: 'MINIDOGE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xC97a656729d098e4A81c79cc8d56f98Ec7d2a1Ca',
    },
    token: serializedTokens.minidoge,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 6,
    lpSymbol: 'MINIDOGE-PYE LP',
    lpAddresses: {
      97: '',
      56: '0x8e90838574422a88c4ea6a249e2a9de3cd4735a3',
    },
    token: serializedTokens.minidoge,
    quoteToken: serializedTokens.pye,
  },
  {
    pid: 27,
    lpSymbol: 'SYMBULL-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xC41f72a7fFA1Be46129C7b3EBb24d4bB83119CD6',
    },
    token: serializedTokens.symbull,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 35,
    lpSymbol: 'TREASURE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x9e036E8A24Ec9309b39C8c6c28C38Be0cfe256c0',
    },
    token: serializedTokens.treasure,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 7,
    lpSymbol: 'SYMBULL-PYE LP',
    lpAddresses: {
      97: '',
      56: '0xa364b743ec6a299096561f7006b645b36b423499',
    },
    token: serializedTokens.symbull,
    quoteToken: serializedTokens.pye,
  },
  {
    pid: 13,
    lpSymbol: 'PIN-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x386093Ed76336e6F01B31149967a76Eb8e4f19C2',
    },
    token: serializedTokens.pin,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 14,
    lpSymbol: 'PIN-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xddB3d7518cd7a54A9FbFC9Cc7d2Eb98Aa6036e04',
    },
    token: serializedTokens.pin,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 10,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xe5F7afE8FC4771d2035EEf4D53B32CF3514edF5C',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },  
  {
    pid: 28,
    lpSymbol: 'USDT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5323cc3F53011fABaA2C42ee12b4E527A15221dB',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 29,
    lpSymbol: 'USDT-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0xA227b1026FAc98a1eB39Be93F76588A285629c88',
    },
    token: serializedTokens.usdt,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 30,
    lpSymbol: 'ETH-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xca0dbAb04c7790840a0D4E85690cde36062a8b0d',
    },
    token: serializedTokens.eth,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 31,
    lpSymbol: 'USDC-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x1b1c099B771f85aD45147b9f6f344524318ADe46',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 32,
    lpSymbol: 'USDC-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x3aedE6cB1D6b028F0E9604069A7575B95E785689',
    },
    token: serializedTokens.usdc,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 25,
    lpSymbol: 'ADA-USDT LP',
    lpAddresses: {
      97: '',
      56: '0xA7B42278a5e4CEA586a50C522fDef95035C9ea15',
    },
    token: serializedTokens.ada,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 17,
    lpSymbol: 'CAKE-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5eBA5FA6933e4D3A4CDAFb1F608a45Ec3253D4AA',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 33,
    lpSymbol: 'CAKE-USDT LP',
    lpAddresses: {
      97: '',
      56: '0xc32409A97AF819D738E4e69A2422ED48A8594782',
    },
    token: serializedTokens.cake,
    quoteToken: serializedTokens.usdt,
  },
  {
    pid: 15,
    lpSymbol: 'FTM-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xDA54EdeCce7bd0150f02dA94b180B23270381Ba1',
    },
    token: serializedTokens.ftm,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 16,
    lpSymbol: 'FTM-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x54618E852Bf52Ac0cf27AD224d8Df58C07984EbF',
    },
    token: serializedTokens.ftm,
    quoteToken: serializedTokens.busd,
  }, 
  {
    pid: 18,
    lpSymbol: 'FIST-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x8248103f386B3B17b748b9D42c29F860b5bB49F7',
    },
    token: serializedTokens.fist,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 19,
    lpSymbol: 'FIST-BUSD LP',
    lpAddresses: {
      97: '',
      56: '0x02687966b33e91f11E47Eb3761af6E6eC6171932',
    },
    token: serializedTokens.fist,
    quoteToken: serializedTokens.busd,
  },
  {
    pid: 24,
    lpSymbol: 'HERO-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xE776489C9cc85753fe82AA5f73cAE6671c56BcB2',
    },
    token: serializedTokens.hero,
    quoteToken: serializedTokens.wbnb,
  },
]

export default farms
