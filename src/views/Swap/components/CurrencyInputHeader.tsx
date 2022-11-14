import React from 'react'
import styled from 'styled-components'
import SVG from 'react-inlinesvg';
import {
  Flex,
  Heading,
  IconButton,
  Text,
  useModal,
} from 'uikit'
import TransactionsModal from 'components/App/Transactions/TransactionsModal'
import SettingsModal from "../../../components/Menu/GlobalSettings/SettingsModal";

interface Props {
  title: string
  subtitle: string
  noConfig?: boolean
  setIsChartDisplayed?: React.Dispatch<React.SetStateAction<boolean>>
  isChartDisplayed?: boolean
  isDark?: boolean
}

const CurrencyInputContainer = styled(Flex)`
  align-items: center;
  width: 100%;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background-color: transparent;
  padding-bottom: 18px;
  margin-bottom: 18px;
`

const CurrencyInputHeader: React.FC<Props> = ({ title, subtitle, isDark}) => {
  const [onPresentTransactionsModal] = useModal(<TransactionsModal />)
  const [onPresentSettingsModal] = useModal(<SettingsModal />)

  return (
    <CurrencyInputContainer>
      <Flex width="100%" alignItems="center" justifyContent="space-between">
        <Flex flexDirection="column" alignItems="flex-start">
          <Heading as="h2" mb="1px" color={isDark ? 'lightText' : "text"}>
            {title}
          </Heading>
          <Flex alignItems="center">
            <Text color="#FFFFFF" fontSize="14px" style={{ opacity: 0.4 }}>
              {subtitle}
            </Text>
          </Flex>
        </Flex>
        <Flex>
          <IconButton onClick={onPresentTransactionsModal} variant="text" scale="sm" mr='8px' hasBorder>
            <SVG src='/images/rateIcon.svg'/>
          </IconButton>
          <IconButton onClick={onPresentSettingsModal} variant="text" scale="sm" hasBorder>
            <SVG src='/images/rate2Icon.svg'/>
          </IconButton>
        </Flex>
      </Flex>
    </CurrencyInputContainer>
  )
}

export default CurrencyInputHeader
