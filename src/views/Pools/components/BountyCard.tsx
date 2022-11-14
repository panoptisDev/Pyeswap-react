import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  HelpIcon,
  Button,
  Heading,
  Skeleton,
  useModal,
  Box,
  useTooltip,
} from 'uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { usePriceAppleBusd } from 'state/farms/hooks'
import { useAppleVault } from 'state/pools/hooks'
import Balance from 'components/Balance'
import BountyModal from './BountyModal'

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  padding: 0;
  border-radius: 0;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const BountyCard = () => {
  const { t } = useTranslation()
  const {
    estimatedAppleBountyReward,
    fees: { callFee },
  } = useAppleVault()
  const applePriceBusd = usePriceAppleBusd()

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedAppleBountyReward).multipliedBy(applePriceBusd)
  }, [applePriceBusd, estimatedAppleBountyReward])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedAppleBounty = estimatedAppleBountyReward ? estimatedAppleBountyReward.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const appleBountyToDisplay = hasFetchedAppleBounty ? getBalanceNumber(estimatedAppleBountyReward, 18) : 0

  const TooltipComponent = ({ fee }: { fee: number }) => (
    <>
      <Text mb="16px">{t('This bounty is given as a reward for providing a service to other users.')}</Text>
      <Text mb="16px">
        {t(
          'Whenever you successfully claim the bounty, you’re also helping out by activating the Auto APPLE Pool’s compounding function for everyone.',
        )}
      </Text>
      <Text style={{ fontWeight: 'bold' }}>
        {t('Auto-Compound Bounty: %fee%% of all Auto APPLE pool users pending yield', { fee: fee / 100 })}
      </Text>
    </>
  )

  const [onPresentBountyModal] = useModal(<BountyModal TooltipComponent={TooltipComponent} />)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <CardBody p='0' style={{ borderRadius: 0}}>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="13px" bold color="textSubtle" mr="4px">
                {t('Auto APPLE Bounty')}
              </Text>
              <Box ref={targetRef}>
                <HelpIcon color="textSubtle" width='14px' />
              </Box>
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex flexDirection="column" mr="12px">
              <Heading>
                {hasFetchedAppleBounty ? (
                  <Balance fontSize="26px" bold value={appleBountyToDisplay} decimals={3} />
                ) : (
                  <Skeleton height={20} width={96} mb="2px" />
                )}
              </Heading>
              {hasFetchedDollarBounty ? (
                <Balance
                  fontSize="12px"
                  color="textSubtle"
                  value={dollarBountyToDisplay}
                  decimals={2}
                  unit=" USD"
                  prefix="~"
                />
              ) : (
                <Skeleton height={16} width={62} />
              )}
            </Flex>
            <Button
              disabled={!dollarBountyToDisplay || !appleBountyToDisplay || !callFee}
              onClick={onPresentBountyModal}
              scale="sm"
              id="clickClaimVaultBounty"
            >
              {t('Claim')}
            </Button>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default BountyCard
