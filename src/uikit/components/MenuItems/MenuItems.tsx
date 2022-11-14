/**
 * @todo Change the coloring of the navigation items
 */

import React from 'react'
import { Flex } from '../Box'
import isTouchDevice from '../../util/isTouchDevice'
import DropdownMenu from '../DropdownMenu/DropdownMenu'
import MenuItem from '../MenuItem/MenuItem'
import IconComponent from '../Svg/IconComponent'
import { MenuItemsProps } from './types'

/**
 * This component spits out a menu item for the top Navigation Bar.
 * The component is called and the items are passed in as a prop. 
 * The component then uses the items prop to generate children inside of it.  
 * @param param0 items These items have a status. 
 * @returns 
 */
const MenuItems: React.FC<MenuItemsProps> = ({ items = [], activeItem, activeSubItem, ...props }) => {
  return (
    <Flex {...props}>
      {items.map(({ label, items: menuItems = [], href, icon = '' }) => {
        const statusColor = menuItems?.find((menuItem) => menuItem.status !== undefined)?.status?.color
        const isActive = activeItem === href
        const linkProps = isTouchDevice() && menuItems && menuItems.length > 0 ? {} : { href }
        return (
          <DropdownMenu key={`${label}#${href}#${icon}`} items={menuItems} py={1} activeItem={activeSubItem}>
            <MenuItem {...linkProps} isActive={isActive} statusColor={statusColor}>
              {label || <IconComponent iconName={icon} color={isActive ? 'secondary' : 'textSubtle'} />}
            </MenuItem>
          </DropdownMenu>
        )
      })}
    </Flex>
  )
}

export default MenuItems
