import styled from 'styled-components'
import { StyledMenuItemProps } from './types'

export const StyledMenuItemContainer = styled.div<StyledMenuItemProps>`
  position: relative;

  ${({ $isActive, $variant, theme }) =>
    $variant === 'subMenu' &&
    `
      background: ${theme.colors.backgroundAlt};
      width: 108px;
      height: 40px;
      border-radius: 83px;
      display: flex;
      justify-content: center;
      align-items: center;
    `};

  ${({ $isActive, $variant, theme }) =>
    !$isActive &&
    `
      background: transparent;
    `};
`
// @todo ~quan change default color of inactive menu <a> 
// what else uses muted?
const StyledMenuItem = styled.a<StyledMenuItemProps>`
  position: relative;
  display: flex;
  align-items: center;

  color: ${({ theme, $isActive, $variant }) => {
    // this changes the color of the SubMenu links 
    if ($variant === 'subMenu') return $isActive ? theme.colors.text : theme.colors.muted
    // this changes the color of the menu items
    // return $isActive ? theme.colors.gold2 : theme.colors.muted 
    return $isActive ? theme.colors.gold2 : theme.colors.textNav 
  }};

  font-size: 16px;

  font-weight: ${({ $isActive }) => ($isActive ? '600' : '500')};

  ${({ $statusColor, theme }) =>
    $statusColor &&
    `
    &:after {
      content: "";
      border-radius: 100%;
      background: ${theme.colors[$statusColor]};
      height: 8px;
      width: 8px;
      margin-left: 12px;
    }
  `}

  ${({ $variant }) =>
    $variant === 'default'
      ? `
    padding: 0 12px;
    height: 48px;
  `
      : `
    padding: 4px 4px 0px 4px;
    height: 42px;
  `}

  &:hover {
    background: ${({ theme, $isActive, $variant }) => theme.colors.hover};
    ${({ $variant }) => $variant === 'default' && 'border-radius: 16px;'};
  }
`

export default StyledMenuItem
