import React, { useRef } from 'react'
import styled from 'styled-components'
import {Button, ChevronUpIcon, Flex} from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { DeserializedPool } from 'state/types'
import PoolRow from './PoolRow'

interface PoolsTableProps {
  pools: DeserializedPool[]
  userDataLoaded: boolean
  account: string
}

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const Container = styled(Flex)`
  width: 100%;
  max-width: 100%;
  margin: 20px 0;
  flex-direction: column;
  gap: 20px;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 1200px;
  }
`

const PoolsTable: React.FC<PoolsTableProps> = ({ pools, userDataLoaded, account }) => {
  const { t } = useTranslation()
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }
  return (
    <Container ref={tableWrapperEl}>
      {pools.map((pool) => (
        <PoolRow key={pool.vaultKey ?? pool.sousId} pool={pool} account={account} userDataLoaded={userDataLoaded} />
      ))}
      <ScrollButtonContainer>
        <Button variant="text" onClick={scrollToTop}>
          {t('To Top')}
          <ChevronUpIcon color="primary" />
        </Button>
      </ScrollButtonContainer>
    </Container>
  )
}

export default PoolsTable
