import styled from 'styled-components'
import Button from './Button'
import { BaseButtonProps, PolymorphicComponent } from './types'

interface IconButton extends BaseButtonProps {
  hasBorder?: boolean
}

const IconButton: PolymorphicComponent<IconButton, 'button'> = styled(Button)<IconButton>`
  padding: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 32px;
  height: 32px;
  border-radius: 32px;
  border: ${({ theme, hasBorder }) => !hasBorder ? 'none' : `1px solid ${theme.colors.muted}`};
  background-color: transparent;
  color: rgba(255, 255, 255, 0.4);
  transition: all ease 0.3s;
  
  &:hover {
    color: #fff;
    ${({ theme, hasBorder }) => 
      hasBorder ? 
        `background-color: ${theme.colors.muted};` 
        : `opacity: 0.85`
    };
  }
`

export default IconButton
