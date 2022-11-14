import styled from 'styled-components'
import { darkColors } from '../../theme/colors'
import { Box, Flex } from '../Box'
import SocialLinks from './Components/SocialLinks'

export const StyledFooter = styled(Flex)`
  background: ${({ theme }) => theme.colors.footerBackground};
  margin-right: 30px;
  margin-left: 30px;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
`

export const StyledList = styled.ul`
  list-style: none;
  margin-bottom: 40px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0px;
  }
`

export const StyledListItem = styled.li`
  font-size: 16px;
  margin-bottom: 16px;
  line-height: 1.5;
  text-transform: capitalize;
  color: ${({ theme}) => theme.colors.textSubtle};

  &:first-child {
    color: ${({ theme}) => theme.colors.secondary};
    font-weight: 600;
    font-size: 14px;
  }
`

export const StyledIconMobileContainer = styled(Box)`
  margin-bottom: 24px;
`

export const StyledToolsContainer = styled(Flex)`
  border-color: ${darkColors.cardBorder};
  border-top-width: 1px;
  border-bottom-width: 1px;
  border-style: solid;
  padding: 24px 0;
  margin-bottom: 24px;

  ${({ theme }) => theme.mediaQueries.sm} {
    border-top-width: 0;
    border-bottom-width: 0;
    padding: 0 0;
    margin-bottom: 0;
  }
`

export const StyledSocialLinks = styled(SocialLinks)`
  border-bottom: 1px solid ${darkColors.cardBorder};
`

export const StyledText = styled.span`
  color: ${({ theme }) => theme.colors.textSubtle};
`
