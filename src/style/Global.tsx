import { createGlobalStyle } from 'styled-components'
// eslint-disable-next-line import/no-unresolved
import { PYESwapTheme } from 'uikit'

declare module 'styled-components' {
  /* eslint-disable @typescript-eslint/no-empty-interface */
  export interface DefaultTheme extends PYESwapTheme {}
}

const GlobalStyle = createGlobalStyle`
  * {
    font-family: 'Montserrat', sans-serif;
  }
  
  body {
    background-color: ${({ theme }) => theme.colors.bodyBackground};
    iframe {
      display: none;
    }
    img {
      height: auto;
      max-width: 100%;
    }
  }
`

export default GlobalStyle
