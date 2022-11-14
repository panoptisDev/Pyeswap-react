import React from 'react'
import { Text, TooltipText, useTooltip } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import Balance from 'components/Balance'

interface RecentAppleProfitBalanceProps {
  appleToDisplay: number
  dollarValueToDisplay: number
  dateStringToDisplay: string
}

const RecentAppleProfitBalance: React.FC<RecentAppleProfitBalanceProps> = ({
  appleToDisplay,
  dollarValueToDisplay,
  dateStringToDisplay,
}) => {
  const { t } = useTranslation()

  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    <>
      <Balance fontSize="16px" value={appleToDisplay} decimals={3} bold unit=" APPLE" />
      <Balance fontSize="16px" value={dollarValueToDisplay} decimals={2} bold prefix="~$" />
      {t('Earned since your last action')}
      <Text>{dateStringToDisplay}</Text>
    </>,
    {
      placement: 'bottom-end',
    },
  )

  return (
    <>
      {tooltipVisible && tooltip}
      <TooltipText ref={targetRef} small>
        <Balance fontSize="14px" value={appleToDisplay} />
      </TooltipText>
    </>
  )
}

export default RecentAppleProfitBalance
