import { ContextApi } from 'contexts/Localization/types'
import { PageMeta } from './types'

export const DEFAULT_META: PageMeta = {
  title: 'PYESwap',
  description: '',
  image: 'https://pyeswap.com/images/hero.png',
}

export const getCustomMeta = (path: string, t: ContextApi['t']): PageMeta => {
  let basePath
  if (path.startsWith('/swap')) {
    basePath = '/swap'
  } else if (path.startsWith('/add')) {
    basePath = '/add'
  } else if (path.startsWith('/remove')) {
    basePath = '/remove'
  } else {
    basePath = path
  }

  switch (basePath) {
    case '/':
      return {
        title: `${t('PYESwap')} | ${t('Swap 2.0')}`,
      }
    case '/swap':
      return {
        title: `${t('Exchange')} | ${t('PYESwap')}`,
      }
    case '/add':
      return {
        title: `${t('Add Liquidity')} | ${t('PYESwap')}`,
      }
    case '/remove':
      return {
        title: `${t('Remove Liquidity')} | ${t('PYESwap')}`,
      }
    case '/liquidity':
      return {
        title: `${t('Liquidity')} | ${t('PYESwap')}`,
      }
    case '/find':
      return {
        title: `${t('Import Pool')} | ${t('PYESwap')}`,
      }
    case '/farms':
      return {
        title: `${t('Farms')} | ${t('PYESwap')}`,
      }
    case '/info':
      return {
        title: `${t('Overview')} | ${t('PYESwap Info & Analytics')}`,
        description: 'View statistics for PYESwap exchanges.',
      }
    case '/info/pools':
      return {
        title: `${t('Pools')} | ${t('PYESwap Info & Analytics')}`,
        description: 'View statistics for PYESwap exchanges.',
      }
    case '/info/tokens':
      return {
        title: `${t('Tokens')} | ${t('PYESwap Info & Analytics')}`,
        description: 'View statistics for PYESwap exchanges.',
      }
    default:
      return null
  }
}
