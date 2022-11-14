import { Currency, CurrencyAmount, Fraction, Percent } from '@pyeswap/swap-sdk'
import React from 'react'
import { Button, Text } from 'uikit'
import styled from "styled-components";
import { useTranslation } from 'contexts/Localization'
import { RowBetween, RowFixed } from '../../components/Layout/Row'
import { CurrencyLogo } from '../../components/Logo'
import { Field } from '../../state/mint/actions'
import {AutoColumn} from "../../components/Layout/Column";

const SwapModalFooterContainer = styled(AutoColumn)`
  margin-top: 8px;
  padding: 16px;
  border-radius: ${({ theme }) => theme.radii.default};
  background-color: ${({ theme }) => theme.colors.bodyBackground};
`

function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  const { t } = useTranslation()
  return (
    <AutoColumn gap='lg'>
      <SwapModalFooterContainer gap='sm'>
        <RowBetween>
          <Text fontSize='14px'>{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Text>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <Text bold fontSize='14px'>{parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <Text fontSize='14px'>{t('%asset% Deposited', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Text>
          <RowFixed>
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <Text bold fontSize='14px'>{parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}</Text>
          </RowFixed>
        </RowBetween>
        <RowBetween>
          <Text fontSize='14px'>{t('Rates')}</Text>
          <Text fontSize='14px' bold>
            {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
              currencies[Field.CURRENCY_B]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween style={{ justifyContent: 'flex-end' }}>
          <Text fontSize='14px' bold>
            {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
              currencies[Field.CURRENCY_A]?.symbol
            }`}
          </Text>
        </RowBetween>
        <RowBetween>
          <Text fontSize='14px'>{t('Share of Pool')}:</Text>
          <Text fontSize='14px' bold>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
        </RowBetween>
      </SwapModalFooterContainer>
      <Button onClick={onAdd}>
        {noLiquidity ? t('Create Pool & Supply') : t('Confirm Supply')}
      </Button>
    </AutoColumn>
  )
}

export default ConfirmAddModalBottom
