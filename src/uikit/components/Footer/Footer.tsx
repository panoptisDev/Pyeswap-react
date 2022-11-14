import React from 'react'
import { baseColors, darkColors } from '../../theme/colors'
import { Flex, Box } from '../Box'
import { Link } from '../Link'
import {
  StyledFooter,
  StyledList,
  StyledListItem,
  StyledText,
} from './styles'
import { FooterProps } from './types'
import { Button } from '../Button'
import { useMatchBreakpoints } from '../..'
import useTheme from "../../../hooks/useTheme";

const MenuItem: React.FC<FooterProps> = ({
  items,
  isDark,
  toggleTheme,
  currentLang,
  langs,
  setLang,
  pyePriceUsd,
  buyPyeLabel,
  ...props
}) => {
  const { isMobile } = useMatchBreakpoints()
  const { theme } = useTheme()
  return (
    <StyledFooter p={['40px 16px', null, '68px 40px 84px 40px']} {...props} justifyContent="center">
      <Flex flexDirection="column" width={['100%', null, '1200px;']}>
        <Flex
          order={[2, null, 1]}
          flexDirection={['column', null, 'row']}
          justifyContent="space-around"
          alignItems="flex-start"
          mb={['42px', null, '36px']}
        >
          {!isMobile && (
            <Flex flexDirection="column" alignItems="center">
              <Box>
                <img src="/images/footerIcon.png" alt="logo" width="80px" style={{ marginTop: '20px' }} />
              </Box>
              <Button
                as="a"
                href="/swap?outputCurrency=0x853FCf1e9CAd2FAE2150621D583c98dc5f8748f3"
                target="_blank"
                scale="sm"
                mt="40px"
              >
                {buyPyeLabel}
              </Button>
            </Flex>
          )}

          {items?.map((item) => (
            <StyledList key={item.label}>
              <StyledListItem>{item.label}</StyledListItem>
              {item.items?.map(({ label, href, isHighlighted = false }) => (
                <StyledListItem key={label}>
                  {href ? (
                    <Link
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      color={isHighlighted ? baseColors.warning : theme.colors.textSubtle}
                      bold={false}
                    >
                      {label}
                    </Link>
                  ) : (
                    <StyledText>{label}</StyledText>
                  )}
                </StyledListItem>
              ))}
            </StyledList>
          ))}
          {isMobile && (
            <Flex justifyContent="center" width="100%">
              <Flex flexDirection="column" alignItems="center">
                <Box>
                  <img src="/images/footerIcon.png" alt="logo" width="80px" style={{ marginTop: '20px' }} />
                </Box>
                <Button mt="40px">{buyPyeLabel}</Button>
              </Flex>
            </Flex>
          )}
        </Flex>
      </Flex>
    </StyledFooter>
  )
}

export default MenuItem
