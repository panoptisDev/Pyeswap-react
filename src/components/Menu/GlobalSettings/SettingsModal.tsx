import React, { useState } from 'react'
import styled from 'styled-components'
import { Text, Toggle, Flex, Modal, InjectedModalProps, ThemeSwitcher } from 'uikit'
import {
  useAudioModeManager,
  useExpertModeManager,
  useUserExpertModeAcknowledgementShow,
  useUserSingleHopOnly,
} from 'state/user/hooks'
import { useTranslation } from 'contexts/Localization'
import { useSwapActionHandlers } from 'state/swap/hooks'
import useTheme from 'hooks/useTheme'
import QuestionHelper from '../../QuestionHelper'
import TransactionSettings from './TransactionSettings'
import ExpertModal from './ExpertModal'
import GasSettings from './GasSettings'

const ScrollableContainer = styled(Flex)`
  flex-direction: column;
  max-height: 400px;
  ${({ theme }) => theme.mediaQueries.sm} {
    max-height: none;
  }
`

const SettingsModal: React.FC<InjectedModalProps> = ({ onDismiss }) => {
  const [showConfirmExpertModal, setShowConfirmExpertModal] = useState(false)
  const [showExpertModeAcknowledgement, setShowExpertModeAcknowledgement] = useUserExpertModeAcknowledgementShow()
  const [expertMode, toggleExpertMode] = useExpertModeManager()
  const [singleHopOnly, setSingleHopOnly] = useUserSingleHopOnly()
  const [audioPlay, toggleSetAudioMode] = useAudioModeManager()
  const { onChangeRecipient } = useSwapActionHandlers()

  const { t } = useTranslation()
  const { theme, isDark, toggleTheme } = useTheme()

  if (showConfirmExpertModal) {
    return (
      <ExpertModal
        setShowConfirmExpertModal={setShowConfirmExpertModal}
        onDismiss={onDismiss}
        setShowExpertModeAcknowledgement={setShowExpertModeAcknowledgement}
      />
    )
  }

  const handleExpertModeToggle = () => {
    if (expertMode) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else if (!showExpertModeAcknowledgement) {
      onChangeRecipient(null)
      toggleExpertMode()
    } else {
      setShowConfirmExpertModal(true)
    }
  }

  return (
    <Modal
      title={t('Settings')}
      headerBackground="gradients.cardHeader"
      onDismiss={onDismiss}
      style={{ maxWidth: '420px' }}
    >
      <ScrollableContainer>
        <Flex pb="24px" flexDirection="column">
          <Text bold textTransform="uppercase" fontSize="12px" color="secondary" mb="18px">
            {t('Global')}
          </Text>
          <Flex justifyContent="space-between">
            <Text fontSize='14px' mb="18px">{t('Dark mode')}</Text>
            <ThemeSwitcher isDark={isDark} toggleTheme={toggleTheme} />
          </Flex>
          <GasSettings />
        </Flex>
        <Flex pt="24px" flexDirection="column" borderTop={`1px ${theme.colors.muted} solid`}>
          <Text bold textTransform="uppercase" fontSize="12px" color="secondary" mb="18px">
            {t('Swaps & Liquidity')}
          </Text>
          <TransactionSettings />
        </Flex>
      </ScrollableContainer>
    </Modal>
  )
}

export default SettingsModal
