import React, { useMemo, useEffect } from 'react'
import {Text, Heading, Card, Flex} from 'uikit'
import Page from 'components/Layout/Page'
import TokenTable from 'views/Info/components/InfoTables/TokensTable'
import { useAllTokenData, useTokenDatas } from 'state/info/hooks'
import { useWatchlistTokens } from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import TopTokenMovers from 'views/Info/components/TopTokenMovers'
import useTheme from "../../../hooks/useTheme";

const TokensOverview: React.FC = () => {
  const { t } = useTranslation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const allTokens = useAllTokenData()
  const { isDark, theme } = useTheme()

  const formattedTokens = useMemo(() => {
    return Object.values(allTokens)
      .map((token) => token.data)
      .filter((token) => token)
  }, [allTokens])

  const [savedTokens] = useWatchlistTokens()
  const watchListTokens = useTokenDatas(savedTokens)

  return (
    <Page>
      <Heading color="textSubtle" scale="lg" mb="16px">
        {t('Your Watchlist')}
      </Heading>
      {savedTokens.length > 0 ? (
        <TokenTable tokenDatas={watchListTokens} />
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
      <TopTokenMovers />
      <Heading color="textSubtle" scale="lg" mt="40px" mb="16px" id="info-tokens-title">
        {t('All Tokens')}
      </Heading>
      <TokenTable tokenDatas={formattedTokens} />
    </Page>
  )
}

export default TokensOverview
