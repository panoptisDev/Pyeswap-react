import React, { useMemo } from 'react'
import {Text, Heading, Card, Flex} from 'uikit'
import Page from 'components/Layout/Page'
import PoolTable from 'views/Info/components/InfoTables/PoolsTable'
import { useAllPoolData, usePoolDatas } from 'state/info/hooks'
import { useWatchlistPools } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import useTheme from "../../../hooks/useTheme";

const PoolsOverview: React.FC = () => {
  const { t } = useTranslation()
  const { isDark, theme } = useTheme()

  // get all the pool datas that exist
  const allPoolData = useAllPoolData()
  const poolDatas = useMemo(() => {
    return Object.values(allPoolData)
      .map((pool) => pool.data)
      .filter((pool) => pool)
  }, [allPoolData])

  const [savedPools] = useWatchlistPools()
  const watchlistPools = usePoolDatas(savedPools)

  return (
    <Page>
      <Heading color="textSubtle" scale="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      {watchlistPools.length > 0 ? (
        <PoolTable poolDatas={watchlistPools} />
      ) : (
        <Card style={{ backgroundColor: isDark ? theme.colors.table : theme.colors.primary }}>
          <Flex flexDirection='column' alignItems='center'>
            <Text color="textSubtle" fontSize='14px'>
              {t('Oops! I’ts empty')}
            </Text>
            <Text color="textSubtle" fontSize='14px' style={{ opacity: 0.4 }}>
              {t('Saved pools will appear here')}
            </Text>
          </Flex>
        </Card>
      )}
      <Heading color="textSubtle" scale="lg" mt="40px" mb="16px" id="info-pools-title">
        {t('All Pools')}
      </Heading>
      <PoolTable poolDatas={poolDatas} />
    </Page>
  )
}

export default PoolsOverview
