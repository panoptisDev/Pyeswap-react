import React from 'react'
import styled from 'styled-components'
import { Text, ChevronDownIcon } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import CellLayout from "../CellLayout";

interface ExpandActionCellProps {
  expanded: boolean
  isFullLayout: boolean
}

const ArrowIcon = styled(ChevronDownIcon)<{ toggled: boolean }>`
  transform: ${({ toggled }) => (toggled ? 'rotate(180deg)' : 'rotate(0)')};
  height: 24px;
`

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
`


const TotalStakedCell: React.FC<ExpandActionCellProps> = ({ expanded, isFullLayout }) => {
  const { t } = useTranslation()
  return (
    <CellLayout>
      <Container>
        {isFullLayout && (
          <Text color="text" fontSize='15px'>
            {expanded ? t('Hide') : t('Details')}
          </Text>
        )}
        <ArrowIcon color="text" toggled={expanded} />
      </Container>
    </CellLayout>
  )
}

export default TotalStakedCell
