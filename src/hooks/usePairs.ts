import { TokenAmount, Pair, Currency } from '@pyeswap/swap-sdk'
import { useMemo } from 'react'
import { abi as IPYESwapPair} from 'config/abi/IPYESwapPair.json'
import { Interface } from '@ethersproject/abi'
import useActiveWeb3React from 'hooks/useActiveWeb3React'

import { useMultipleContractSingleData } from '../state/multicall/hooks'
import { wrappedCurrency } from '../utils/wrappedCurrency'

const PAIR_INTERFACE = new Interface(IPYESwapPair)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(currencies: [Currency | undefined, Currency | undefined][]): [PairState, Pair | null][] {
  const { chainId } = useActiveWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies],
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        return tokenA && tokenB && !tokenA.equals(tokenB) ? Pair.getAddress(tokenA, tokenB) : undefined
      }),
    [tokens],
  )

  const results = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getReserves')
  const feesResult = useMultipleContractSingleData(pairAddresses, PAIR_INTERFACE, 'getTotalFee')

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const { result: totalFee, loading: feeLoading } = feesResult[i]
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      let pairFee: any = 1400;
      if (loading || feeLoading) return [PairState.LOADING, null]
      if (!tokenA || !tokenB || tokenA.equals(tokenB)) return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      if(totalFee) pairFee = totalFee.toString();
      const { reserve0, reserve1, baseToken } = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
      return [
        PairState.EXISTS,
        new Pair(new TokenAmount(token0, reserve0.toString()), new TokenAmount(token1, reserve1.toString()), baseToken, pairFee),
      ]
    })
  }, [results, tokens, feesResult])
}

export function usePair(tokenA?: Currency, tokenB?: Currency): [PairState, Pair | null] {
  return usePairs([[tokenA, tokenB]])[0]
}
