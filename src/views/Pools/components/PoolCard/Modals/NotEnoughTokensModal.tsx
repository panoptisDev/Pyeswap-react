import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Modal, Text, Button, OpenNewIcon, Link } from 'uikit'
import useTheme from 'hooks/useTheme'

interface NotEnoughTokensModalProps {
  tokenSymbol: string
  onDismiss?: () => void
}

const StyledLink = styled(Link)`
  width: 100%;
`

const NotEnoughTokensModal: React.FC<NotEnoughTokensModalProps> = ({ tokenSymbol, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  return (
    <Modal
      title={t('%symbol% required', { symbol: tokenSymbol })}
      onDismiss={onDismiss}
      headerBackground={theme.colors.gradients.cardHeader}
    >
      <Text color="failure" bold>
        {t('Insufficient %symbol% balance', { symbol: tokenSymbol })}
      </Text>
      <Text color='textSubtle' fontSize='13px' mt="14px">{t('You’ll need %symbol% to stake in this pool!', { symbol: tokenSymbol })}</Text>
      <Text color='textSubtle' fontSize='13px'>
        {t('Buy some %symbol%, or make sure your %symbol% isn’t in another pool or LP.', {
          symbol: tokenSymbol,
        })}
      </Text>
      <Button variant='primary' mt="24px" as="a" external href="/swap">
        {t('Buy')} {tokenSymbol}
      </Button>
      <StyledLink href="https://yieldwatch.net" external>
        <Button variant="tertiary" mt="8px" width="100%">
          {t('Locate Assets')}
          <OpenNewIcon color="primary" width='10px' style={{ marginLeft: 8 }} />
        </Button>
      </StyledLink>
      <Button variant="text" scale='xs' onClick={onDismiss} mt='8px'>
        <Text color='textSubtle' fontSize='13px' bold>
          {t('Close Window')}
        </Text>
      </Button>
    </Modal>
  )
}

export default NotEnoughTokensModal
