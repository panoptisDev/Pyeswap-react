import styled from 'styled-components'
import { space } from 'styled-system'
import { RadioProps, scales } from './types'

const getScale = ({ scale }: RadioProps) => {
  switch (scale) {
    case scales.SM:
      return '16px'
    case scales.MD:
    default:
      return '32px'
  }
}

const getCheckedScale = ({ scale }: RadioProps) => {
  switch (scale) {
    case scales.SM:
      return '12px'
    case scales.MD:
    default:
      return '20px'
  }
}

const Radio = styled.input.attrs({ type: 'radio' })<RadioProps>`
  appearance: none;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  display: inline-block;
  height: ${getScale};
  width: ${getScale};
  vertical-align: middle;
  transition: background-color 0.2s ease-in-out;
  border: 0;
  border-radius: 50%;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled):not(:checked) {
    border: 1px solid ${({ theme }) => theme.colors.success};
  }

  &:focus {
    outline: none;
    border: 1px solid ${({ theme }) => theme.colors.success};
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.success};
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
  ${space}
`

Radio.defaultProps = {
  scale: scales.MD,
  m: 0,
}

export default Radio
