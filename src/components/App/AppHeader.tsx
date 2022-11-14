import React from 'react'
import styled from 'styled-components'
import { Text, Flex, Heading, IconButton, ArrowBackIcon } from 'uikit'
import { Link } from 'react-router-dom'
import { useExpertModeManager } from 'state/user/hooks'

interface Props {
  title: string
  subtitle?: string
  backTo?: string
  noConfig?: boolean
}

const AppHeaderContainer = styled(Flex)`
  align-items: center;
  width: 100%;
  padding-bottom: 10px;
`

const AppHeader: React.FC<Props> = ({ title, subtitle, backTo, noConfig = false }) => {
  return (
    <AppHeaderContainer>
      <Flex alignItems="center" mr={noConfig ? 0 : '16px'}>
        {backTo && (
          <IconButton
            as={Link}
            to={backTo}
            style={{
              border: '1px solid rgba(34, 37, 49, 1)',
              borderRadius: '20px',
            }}
          >
            <ArrowBackIcon color="textSubtle" width="15px" />
          </IconButton>
        )}
        <Flex flexDirection="column" ml={backTo ? '15px' : 0}>
          <Heading color="textSubtle">{title}</Heading>
          <Text color="textSubtle" fontSize="14px" mt={subtitle ? '4px' : 0} style={{ opacity: 0.4 }}>
            {subtitle}
          </Text>
        </Flex>
      </Flex>
    </AppHeaderContainer>
  )
}

export default AppHeader
