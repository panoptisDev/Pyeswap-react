import styled from 'styled-components'
import Text from '../Text/Text'
import { tags, scales, HeadingProps } from './types'

const style = {
  [scales.SM]: {
    fontSize: '12px',
    fontSizeLg: '12px',
  },
  [scales.MD]: {
    fontSize: '20px',
    fontSizeLg: '32px',
  },
  [scales.LG]: {
    fontSize: '30px',
    fontSizeLg: '24px',
  },
  [scales.XL]: {
    fontSize: '32px',
    fontSizeLg: '40px',
  },
  [scales.XXL]: {
    fontSize: '48px',
    fontSizeLg: '64px',
  },
}

const Heading = styled(Text).attrs({ bold: true })<HeadingProps>`
  font-size: ${({ scale }) => style[scale || scales.MD].fontSize};
  font-weight: 600;
`

Heading.defaultProps = {
  as: tags.H2,
  color: 'text'

}

export default Heading
