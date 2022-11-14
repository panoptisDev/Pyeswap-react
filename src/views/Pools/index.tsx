import React, { useEffect, useMemo, useRef, useState } from 'react'
import {Link, useLocation, useRouteMatch} from 'react-router-dom'
import styled from 'styled-components'
import { ethers } from 'ethers'
import { formatUnits } from 'ethers/lib/utils'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import {
  Heading,
  Flex,
  Text,
  Spinner,
  Card,
  Box,
  Checkbox,
  ButtonMenu,
  ButtonMenuItem,
  NotificationDot,
  useMatchBreakpoints
} from 'uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import useIntersectionObserver from 'hooks/useIntersectionObserver'
import {
  useFetchPublicPoolsData,
  usePools,
  useFetchUserPools,
  useFetchAppleVault,
  useVaultPools,
} from 'state/pools/hooks'
import { usePollFarmsPublicData } from 'state/farms/hooks'
import { latinise } from 'utils/latinise'
import Page from 'components/Layout/Page'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { DeserializedPool } from 'state/types'
import { useUserPoolStakedOnly } from 'state/user/hooks'
import { BIG_ZERO } from 'utils/bigNumber'
import Loading from 'components/Loading'
import BountyCard from './components/BountyCard'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { getAppleVaultEarnings } from './helpers'
import { usePoolsWithVault } from './hooks/useGetTopPoolsByApr'
import StylePage from '../Page'
import {Wrapper} from "../Swap/components/styleds";
import useTheme from "../../hooks/useTheme";

const ControlContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-end;
  gap: 18px;
  margin-bottom: 32px;
`

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 3px;
  }
`

const ControlWrapper = styled(Card)`
  overflow: visible;
`

const PoolControls = styled(Box)`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 20px;
  padding: 22px 23px;


  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 14px;
    margin-bottom: 0;
  }
`

const FilterContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  padding-bottom: 13px;
  margin-top: 30px;
  row-gap: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    row-gap: initial;
    margin-top: 16px;
    padding-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    width: auto;
    margin-top: 0;
  }
`

const LabelWrapper = styled(Flex)`
  align-items: center;
  > ${Text} {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.textSubtle};
    white-space: nowrap;
    margin-right: 10px;
  }
`


const NUMBER_OF_POOLS_VISIBLE = 12

const Pools: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { userDataLoaded } = usePools()
  const { isDark } = useTheme()
  const { url, isExact } = useRouteMatch()
  const [stakedOnly, setStakedOnly] = useUserPoolStakedOnly()
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const { observerRef, isIntersecting } = useIntersectionObserver()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const chosenPoolsLength = useRef(0)
  const { isMobile } = useMatchBreakpoints()
  const vaultPools = useVaultPools()
  const appleInVaults = Object.values(vaultPools).reduce((total, vault) => {
    return total.plus(vault.totalAppleInVault)
  }, BIG_ZERO)

  const pools = usePoolsWithVault()

  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.vaultKey) {
          return vaultPools[pool.vaultKey].userData.userShares && vaultPools[pool.vaultKey].userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools, vaultPools],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.vaultKey) {
          return vaultPools[pool.vaultKey].userData.userShares && vaultPools[pool.vaultKey].userData.userShares.gt(0)
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools, vaultPools],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsPublicData()
  useFetchAppleVault()
  useFetchPublicPoolsData()
  useFetchUserPools(account)

  useEffect(() => {
    if (isIntersecting) {
      setNumberOfPoolsVisible((poolsCurrentlyVisible) => {
        if (poolsCurrentlyVisible <= chosenPoolsLength.current) {
          return poolsCurrentlyVisible + NUMBER_OF_POOLS_VISIBLE
        }
        return poolsCurrentlyVisible
      })
    }
  }, [isIntersecting])

  const showFinishedPools = location.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const sortPools = (poolsToSort: DeserializedPool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(poolsToSort, (pool: DeserializedPool) => (pool.apr ? pool.apr : 0), 'desc')
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: DeserializedPool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.vaultKey
              ? getAppleVaultEarnings(
                  account,
                  vaultPools[pool.vaultKey].userData.appleAtLastUserAction,
                  vaultPools[pool.vaultKey].userData.userShares,
                  vaultPools[pool.vaultKey].pricePerFullShare,
                  pool.earningTokenPrice,
                ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: DeserializedPool) => {
            let totalStaked = Number.NaN
            if (pool.vaultKey) {
              if (pool.stakingTokenPrice && vaultPools[pool.vaultKey].totalAppleInVault.isFinite()) {
                totalStaked =
                  +formatUnits(
                    ethers.BigNumber.from(vaultPools[pool.vaultKey].totalAppleInVault.toString()),
                    pool.stakingToken.decimals,
                  ) * pool.stakingTokenPrice
              }
            } else if (pool.sousId === 0) {
              if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice && appleInVaults.isFinite()) {
                const manualAppleTotalMinusAutoVault = ethers.BigNumber.from(pool.totalStaked.toString()).sub(
                  appleInVaults.toString(),
                )
                totalStaked =
                  +formatUnits(manualAppleTotalMinusAutoVault, pool.stakingToken.decimals) * pool.stakingTokenPrice
              }
            } else if (pool.totalStaked?.isFinite() && pool.stakingTokenPrice) {
              totalStaked =
                +formatUnits(ethers.BigNumber.from(pool.totalStaked.toString()), pool.stakingToken.decimals) *
                pool.stakingTokenPrice
            }
            return Number.isFinite(totalStaked) ? totalStaked : 0
          },
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  let chosenPools
  if (showFinishedPools) {
    chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
  } else {
    chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
  }

  if (searchQuery) {
    const lowercaseQuery = latinise(searchQuery.toLowerCase())
    chosenPools = chosenPools.filter((pool) =>
      latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
    )
  }

  chosenPools = sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  chosenPoolsLength.current = chosenPools.length

  const tableLayout = <PoolsTable pools={chosenPools} account={account} userDataLoaded={userDataLoaded} />

  return (
    <StylePage removePadding>
      <Page>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}  mb='40px'>
          <Flex flexDirection='column' flex='1'>
            <Heading as="h1" scale="xl" color="textSubtle" mb="3px">
              {t('Pools')}
            </Heading>
            <Text fontSize='14px' color="textSubtle" style={{ opacity: 0.4 }}>
              {t('Stake your tokens to earn more rewards.')}
            </Text>
            <Text fontSize='14px' color="textSubtle" style={{ opacity: 0.4 }}>
              {t('')}
            </Text>
          </Flex>
        </Flex>
        <ControlContainer style={{ flexDirection: isMobile ? 'column-reverse' : 'row' }}>
          <Flex>
            <ToggleWrapper>
              <Checkbox
                id="staked-only-farms"
                checked={stakedOnly}
                onChange={() => setStakedOnly(!stakedOnly)}
                scale="sm"
              />
              <Text color="textSubtle">Staked Only</Text>
            </ToggleWrapper>
          </Flex>

          <Flex>
            <Wrapper>
              <ButtonMenu activeIndex={isExact ? 0 : 1} scale="sm" variant={isDark ? "dark" : "primary"}>
                <ButtonMenuItem as={Link} to={`${url}`}>
                  {t('Live')}
                </ButtonMenuItem>
                <NotificationDot show={hasStakeInFinishedPools}>
                  <ButtonMenuItem id="finished-farms-button" as={Link} to={`${url}/history`}>
                    {t('Finished')}
                  </ButtonMenuItem>
                </NotificationDot>
              </ButtonMenu>
            </Wrapper>
          </Flex>

          <Flex>
            <LabelWrapper style={{ marginRight: '15px' }}>
              <Select
                options={[
                  {
                    label: t('Hot'),
                    value: 'hot',
                  },
                  {
                    label: t('APR'),
                    value: 'apr',
                  },
                  {
                    label: t('Earned'),
                    value: 'earned',
                  },
                  {
                    label: t('Total staked'),
                    value: 'totalStaked',
                  },
                ]}
                onOptionChange={handleSortOptionChange}
              />
            </LabelWrapper>

            <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
          </Flex>
        </ControlContainer>
        {showFinishedPools && (
          <Text fontSize="16px" bold color="failure">
            {t('These pools are no longer distributing rewards. Please unstake your tokens.')}
          </Text>
        )}
        {account && !userDataLoaded && stakedOnly && (
          <Flex justifyContent="center" mb="4px">
           <Loading /> 
          </Flex>
        )}
        {tableLayout}
        <div ref={observerRef} />
        <Flex mt='32px' justifyContent="center">
        {/*   <Spinner size={32}/> */}
        </Flex>
      </Page>
    </StylePage>
  )
}

export default Pools
