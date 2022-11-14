import React from 'react'
import styled from 'styled-components'
import { Flex, Skeleton, Text } from 'uikit'
import Balance from 'components/Balance'
import { useTranslation } from 'contexts/Localization'

interface TopFarmProps {
  title: string
  percentage: number
  index: number
  visible: boolean
}

const StyledWrapper = styled(Flex)<{ index: number }>`
  position: relative;
`

const AbsoluteWrapper = styled(Flex)<{ visible: boolean; index: number; topOffset: string }>`
 
  top: ${({ topOffset }) => topOffset};
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  margin-top: ${({ visible }) => (visible ? 0 : `50%`)};
  transition: opacity, margin-top, 0.4s ease-out;
  flex-direction: column;
  position: absolute;

  ${({ index, theme }) =>
    index > 0
      ? `
         ${theme.mediaQueries.sm} {
           height: 80px;
           top: 0;
           padding-left: 16px;
           border-left: 1px ${theme.colors.inputSecondary} solid;
         }
       `
      : `padding-right: 16px;`}
`

const s: any = {
  boxShadow: 'rgb(243 141 186 / 45%) 0px 0px 12px'
}

const TopFarm: React.FC<TopFarmProps> = ({ title, percentage, index, visible }) => {
  const { t } = useTranslation()

  const topOffset = () => {
    if (index >= 0 && index < 2) {
      return '0px'
    }

    if (index >= 2 && index < 3) {
      return '80px'
    }

    return '160px'
  }

  return (
    <StyledWrapper index={index} style={s}>
      <AbsoluteWrapper index={index} visible={visible} topOffset={topOffset()}>
        {title ? (
          <Text bold mb="8px" fontSize="12px" color="secondary">
            {title}
          </Text>
        ) : (
          <Skeleton width={80} height={12} mb="8px" />
        )}
        {percentage ? (
          <Balance lineHeight="1.1" fontSize="20px" bold unit="%" value={percentage} />
        ) : (
          <Skeleton width={60} height={16} />
        )}
        {percentage ? (
          <Text fontSize="16px" style={{ opacity: 0.6 }} color="textSubtle">
            {t('APR')}
          </Text>
        ) : (
          <Skeleton width={30} height={16} mt="4px" />
        )}
      </AbsoluteWrapper>
    </StyledWrapper>
  )
}

export default TopFarm
