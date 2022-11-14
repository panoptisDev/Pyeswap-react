import React, { cloneElement, Children, ReactElement } from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { space } from 'styled-system'
import { scales, variants } from '../Button/types'
import { ButtonMenuProps } from './types'

interface StyledButtonMenuProps extends ButtonMenuProps {
  theme: DefaultTheme
  fullDark?: boolean
  hasBorder?: boolean
}

const StyledButtonMenu = styled.div<StyledButtonMenuProps>`
  background-color: ${({ theme, fullDark }) => fullDark ? theme.colors.darkBackground : theme.colors.background};
  border-radius: 32px;
  padding: 4px;
  display: ${({ fullWidth }) => (fullWidth ? 'flex' : 'inline-flex')};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  border: ${({ hasBorder, theme }) => hasBorder ? `1px solid ${theme.colors.chipBack}` : 'none'};

  & > button,
  & > a {
    flex: ${({ fullWidth }) => (fullWidth ? 1 : 'auto')};
  }

  & > button + button,
  & > a + a {
    margin-left: 2px; // To avoid focus shadow overlap
  }

  & > button,
  & a {
    box-shadow: none;
  }

  ${({ disabled, theme, variant }) => {
    if (disabled) {
      return `
        opacity: 0.5;
        
          background-color: transparent;
          color: ${variant === variants.PRIMARY ? '#FFFFFF' : '#5F6478'};
        
    `
    }
    return `
    
    `
  }}
  ${space}
`

const ButtonMenu: React.FC<ButtonMenuProps> = ({
  activeIndex = 0,
  scale = scales.MD,
  variant = variants.PRIMARY,
  onItemClick,
  disabled,
  children,
  fullWidth = false,
  hasBorder = false,
  fullDark = false,
  ...props
}) => {
  return (
    <StyledButtonMenu hasBorder={hasBorder} disabled={disabled} variant={variant} fullWidth={fullWidth} fullDark={fullDark} {...props}>
      {Children.map(children, (child: ReactElement, index) => {
        return cloneElement(child, {
          isActive: activeIndex === index,
          onClick: onItemClick ? () => onItemClick(index) : undefined,
          scale,
          variant,
          disabled,
        })
      })}
    </StyledButtonMenu>
  )
}

export default ButtonMenu
