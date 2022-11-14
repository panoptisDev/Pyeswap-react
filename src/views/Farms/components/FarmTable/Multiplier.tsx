import React from 'react'
import styled from 'styled-components'
import { Text, HelpIcon, Skeleton, useTooltip } from 'uikit'
import { useTranslation } from 'contexts/Localization'

const ReferenceElement = styled.div`
  display: inline-block;
`

export interface MultiplierProps {
  multiplier: string
}

const MultiplierWrapper = styled.div`
  color: ${({ theme }) => theme.colors.textSubtle};
  width: 36px;
  text-align: right;
  margin-right: 14px;

  ${({ theme }) => theme.mediaQueries.lg} {
    text-align: left;
    margin-right: 0;
  }
`

const Container = styled.div`
  display: flex;
  align-items: center;
`

const Multiplier: React.FunctionComponent<MultiplierProps> = ({ multiplier }) => {
  const displayMultiplier = multiplier ? multiplier.toLowerCase() : <Skeleton width={30} />
  const { t } = useTranslation()
  const tooltipContent = (
    <>
      <Text>
        {t(
          'The Multiplier represents the proportion of APPLE rewards each farm receives, as a proportion of the APPLE produced each block.',
        )}
      </Text>
      <Text my="24px">
        {t('For example, if a 1x farm received 1 APPLE per block, a 10x farm would receive 10 APPLE per block.')}
      </Text>
      <Text>{t('This amount is already included in all APR calculations for the farm.')}</Text>
    </>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, {
    placement: 'top-end',
    tooltipOffset: [20, 10],
  })

  return (
    <Container>
      <MultiplierWrapper>{displayMultiplier}</MultiplierWrapper>

      {tooltipVisible && tooltip}
    </Container>
  )
}

export default Multiplier
