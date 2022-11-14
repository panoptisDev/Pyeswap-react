import React, { useState } from 'react'
import styled from 'styled-components'
import {Flex, useMatchBreakpoints} from 'uikit'
import { DeserializedPool } from 'state/types'
import useDelayedUnmount from 'hooks/useDelayedUnmount'
import NameCell from './Cells/NameCell'
import EarningsCell from './Cells/EarningsCell'
import AprCell from './Cells/AprCell'
import TotalStakedCell from './Cells/TotalStakedCell'
import EndsInCell from './Cells/EndsInCell'
import ExpandActionCell from './Cells/ExpandActionCell'
import ActionPanel from './ActionPanel/ActionPanel'
import AutoEarningsCell from './Cells/AutoEarningsCell'
import AutoAprCell from './Cells/AutoAprCell'

interface PoolRowProps {
  pool: DeserializedPool
  account: string
  userDataLoaded: boolean
}

const RowContainer = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
  box-shadow: none;
  border-radius: ${({ theme }) => theme.radii.card};
  flex-direction: column;
  
`

const MobileBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: 20px;
  column-gap: 20px;
`

const CellInner = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding: 24px 8px 24px 0;

  ${({theme}) => theme.mediaQueries.xl} {
    &:not(:last-child) {
      padding-right: 12px;
    }
  }
`

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;
  padding: 0 24px;
  
  grid-template-columns: 2fr repeat(3, 1fr) 70px;
  
  min-height: 75px;
  
  @media screen and (max-width: 900px) {
    grid-template-columns: 1.5fr repeat(3, 1fr) 70px;
  }
  
  @media screen and (max-width: 500px) {
    grid-template-columns: 20px repeat(2, 1fr);
    & :nth-child(4),
    & :nth-child(5),
    & :nth-child(6),
    & :nth-child(7) {
      display: none;
    }
  }
`


const PoolRow: React.FC<PoolRowProps> = ({ pool, account, userDataLoaded }) => {
  const { isXs, isSm, isMd, isLg, isXl, isXxl, isMobile } = useMatchBreakpoints()
  const [expanded, setExpanded] = useState(false)
  const shouldRenderActionPanel = useDelayedUnmount(expanded, 300)

  const toggleExpanded = () => {
    setExpanded((prev) => !prev)
  }

  const handleRenderRow = () => {
    if (!isMobile) {
      return (
        <ResponsiveGrid onClick={toggleExpanded}>
          <CellInner>
            <NameCell pool={pool} />
          </CellInner>
          <CellInner>
            {pool.vaultKey ? (
              <AutoEarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
            ) : (
              <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
            )}
          </CellInner>
          <CellInner>
            {pool.vaultKey ? <AutoAprCell pool={pool} /> : <AprCell pool={pool} />}
          </CellInner>
          <CellInner>
            <TotalStakedCell pool={pool} />
          </CellInner>
          <CellInner>
            <ExpandActionCell expanded={expanded} isFullLayout />
          </CellInner>
        </ResponsiveGrid>
      )
    }

    return (
      <Flex flexDirection='column' onClick={toggleExpanded} p='30px'>
        <Flex justifyContent='space-between' alignItems='center' mb='30px'>
          <NameCell pool={pool} />
          <ExpandActionCell expanded={expanded} isFullLayout={false} />
        </Flex>
        <MobileBody>
          {pool.vaultKey ? (
            <AutoEarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
          ) : (
            <EarningsCell pool={pool} account={account} userDataLoaded={userDataLoaded} />
          )}
          {pool.vaultKey ? <AutoAprCell pool={pool} /> : <AprCell pool={pool} />}
          <TotalStakedCell pool={pool} />
        </MobileBody>
      </Flex>
    )
  }

  return (
    <RowContainer>
      {handleRenderRow()}
      {shouldRenderActionPanel && (
        <ActionPanel
          account={account}
          pool={pool}
          userDataLoaded={userDataLoaded}
          expanded={expanded}
          breakpoints={{ isXs, isSm, isMd, isLg, isXl, isXxl }}
        />
      )}
    </RowContainer>
  )
}

export default PoolRow
