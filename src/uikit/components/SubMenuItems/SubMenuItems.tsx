import React, {useMemo} from 'react'
import {Link} from "react-router-dom";
import StyledSubMenuItems from './styles'
import { SubMenuItemsProps } from './types'
import {ButtonMenu, ButtonMenuItem} from "../ButtonMenu";
import useTheme from "../../../hooks/useTheme";

const SubMenuItems: React.FC<SubMenuItemsProps> = ({ items = [], activeItem, isMobileOnly = false, ...props }) => {
  const { isDark } = useTheme()
  const activeIndex = useMemo(() => {
    return items.findIndex(({ href }) => href === activeItem);
  }, [items, activeItem])

  return (
    <StyledSubMenuItems alignItems='center' justifyContent="center" {...props} pl={['12px', null, '0px']} $isMobileOnly={isMobileOnly}>
      <ButtonMenu activeIndex={activeIndex} variant={isDark ? "dark" : "primary"}>
        {items.map(
          ({ label, href }) =>
            label && (
              <ButtonMenuItem as={Link} to={href}>
                {label}
              </ButtonMenuItem>
            ),
        )}
      </ButtonMenu>
    </StyledSubMenuItems>
  )
}

export default SubMenuItems
