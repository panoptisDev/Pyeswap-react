import React from 'react'
import { Currency, Pair } from '@pyeswap/swap-sdk'
import { Button, ChevronDownIcon, Text, useModal, Flex, Box } from 'uikit'
import styled, { useTheme } from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { useCurrencyBalance } from '../../state/wallet/hooks'
import CurrencySearchModal from '../SearchModal/CurrencySearchModal'
import { CurrencyLogo, DoubleCurrencyLogo } from '../Logo'

import { RowBetween } from '../Layout/Row'
import { Input as NumericalInput } from './NumericalInput'

const InputRow = styled.div<{ selected: boolean }>`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;

  justify-content: flex-end;
  padding: ${({ selected }) => (selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem')};
`
const CurrencySelectButton = styled(Button).attrs({ variant: 'text'})`
  padding: 0;
`
const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 0.75rem;
  padding: 0 2px 0 16px;
  height: 100%;
`

const InputPanel = styled.div`
  display: flex;
  position: relative;
  border-radius: 20px;
  z-index: 1;
`

const CurrencyFlex = styled(Flex)<{ alt?: boolean }>`
  background: ${({ theme, alt }) => !alt ? theme.colors.chipBack : theme.colors.chipBackAlt};
  min-width: 136px;
  height: 40px;
  border-radius: 69px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
`
const Container = styled.div`
  border-radius: 200px;
  height: 40px;
  width: 100%;
  min-width: 288px;
`
interface CurrencyInputPanelProps {
  value: string
  onUserInput: (value: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  horizontal?: boolean
  onCurrencySelect: (currency: Currency) => void
  currency?: Currency | null
  disableCurrencySelect?: boolean
  hideBalance?: boolean
  pair?: Pair | null
  otherCurrency?: Currency | null
  id: string
  showCommonBases?: boolean
  alt?: boolean
}
export default function CurrencyInputPanel({
  value,
  onUserInput,
  onMax,
  showMaxButton,
  horizontal = false,
  label,
  onCurrencySelect,
  currency,
  disableCurrencySelect = false,
  hideBalance = false,
  alt = false,
  pair = null, // used for double token logo
  otherCurrency,
  id,
  showCommonBases,
}: CurrencyInputPanelProps) {
  const { account } = useActiveWeb3React()
  const selectedCurrencyBalance = useCurrencyBalance(account ?? undefined, currency ?? undefined)
  const { t } = useTranslation()
  const theme = useTheme()

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      selectedCurrency={currency}
      otherSelectedCurrency={otherCurrency}
      showCommonBases={showCommonBases}
    />,
  )
  return (
    <Box>
      <Flex flexDirection={horizontal ? 'row' : 'column'} justifyContent="center" alignItems="stretch">
        <Flex mb="6px" alignItems="center" style={{ width: '100%' }} justifyContent={account ? "space-between" : 'center'}>
          <CurrencySelectButton
            className="open-currency-select-button"
            selected={!!currency}
            onClick={() => {
              if (!disableCurrencySelect) {
                onPresentCurrencyModal()
              }
            }}
          >
            <CurrencyFlex alt={alt}>
              <Flex alignItems='center'>
                {pair ? (
                  <CurrencyLogo currency={pair.token0}  size="24px" style={{ marginRight: '8px' }} />
                ) : currency ? (
                  <CurrencyLogo currency={currency} size="24px" style={{ marginRight: '8px' }} />
                ) : null}
                {pair ? (
                  <Text color={alt ? "textSubtle" : "lightText"} id="pair" bold>
                    PYE-LP
                  </Text>
                ) : (
                  <Text color={alt ? "textSubtle" : "lightText"} small id="pair" bold>
                    {(currency && currency.symbol && currency.symbol.length > 20
                      ? `${currency.symbol.slice(0, 4)}...${currency.symbol.slice(
                          currency.symbol.length - 5,
                          currency.symbol.length,
                        )}`
                      : currency?.symbol) || t('Select')}
                  </Text>
                )}
              </Flex>

              {!disableCurrencySelect && <ChevronDownIcon color={alt ? "textSubtle" : "lightText"} />}
            </CurrencyFlex>
          </CurrencySelectButton>
          {account && (
            <Text onClick={onMax} color={alt ? "textSubtle" : "lightText"} fontSize="12px" style={{ cursor: 'pointer' , opacity: 0.4 }}>
              {!hideBalance && !!currency
                ? t('Balance: %balance%', { balance: selectedCurrencyBalance?.toSignificant(6) ?? t('Loading') })
                : ' -'}
            </Text>
          )}
        </Flex>
        <InputPanel>
          <Container
            style={{
              backgroundColor: alt ? theme.colors.inputAlt : theme.colors.input,
              border: alt ? `2px solid ${theme.colors.inputAlt}` : '2px solid #222531',
            }}
          >
            <LabelRow>
              <RowBetween align='center'>
                <NumericalInput
                  className="token-amount-input"
                  value={value}
                  onUserInput={(val) => {
                    onUserInput(val)
                  }}
                  align={account ? 'left' : 'center'}
                  isDarker={!alt}
                />

                {account && currency && showMaxButton && label !== 'To' && (
                  <Button onClick={onMax} scale="sm" variant="primary">
                    MAX
                  </Button>
                )}
              </RowBetween>
            </LabelRow>
          </Container>
        </InputPanel>
      </Flex>
    </Box>
  )
}
