import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTable, Button, ChevronUpIcon, ColumnType, useMatchBreakpoints } from 'uikit'
import { useTranslation } from 'contexts/Localization'

import Row, { RowProps } from './Row'
import { DesktopColumnSchema } from '../types'

export interface ITableProps {
  data: RowProps[]
  columns: ColumnType<RowProps>[]
  userDataReady: boolean
  sortColumn?: string
}

const Container = styled.div`
  filter: ${({ theme }) => theme.card.dropShadow};
  width: 100%;
  border-radius: 16px;
  margin: 16px 0px;
`

const TableWrapper = styled.div`
  overflow: visible;
  scroll-margin-top: 64px;

  &::-webkit-scrollbar {
    display: none;
  }
`

const StyledTable = styled.table`
  font-size: 14px;
  border-radius: 4px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
`

const TableBody = styled.tbody`
  & tr {
    td {
      font-size: 16px;
      vertical-align: middle;
    }
  }
`

const StyledTr = styled.tr`
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const StyledTh = styled.th`
  color: ${({ theme }) => theme.colors.gold2};
`

const TableContainer = styled.div`
  position: relative;
`

const ScrollButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
`

const columnNames = DesktopColumnSchema.map((column) => column.name)

const renderTableTH = () => {
  return columnNames.map((title) => (
    <StyledTh style={{ width: title === 'farm' ? '320px' : '50px' }}>
      {title === 'farm' || title === 'details' ? '' : title[0].toUpperCase().concat(title.slice(1))}
    </StyledTh>
  ))
}
const FarmTable: React.FC<ITableProps> = (props) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null)
  const { t } = useTranslation()
  const { data, columns, userDataReady } = props

  const { rows } = useTable(columns, data, { sortable: true, sortColumn: 'farm' })

  const scrollToTop = (): void => {
    tableWrapperEl.current.scrollIntoView({
      behavior: 'smooth',
    })
  }

  const { isMobile } = useMatchBreakpoints()

  return (
    <Container id="farms-table">
      <TableContainer>
        <TableWrapper ref={tableWrapperEl}>
          <StyledTable>
            <TableBody>
              {!isMobile && <StyledTr>{renderTableTH()}</StyledTr>}
              {rows.map((row) => {
                return <Row {...row.original} userDataReady={userDataReady} key={`table-row-${row.id}`} />
              })}
            </TableBody>
          </StyledTable>
        </TableWrapper>
        <ScrollButtonContainer>
          <Button variant="text" onClick={scrollToTop}>
            {t('To Top')}
            <ChevronUpIcon color="primary" />
          </Button>
        </ScrollButtonContainer>
      </TableContainer>
    </Container>
  )
}

export default FarmTable
