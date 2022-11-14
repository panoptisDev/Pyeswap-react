import { scales, variants } from './types'

export const scaleVariants = {
  [scales.MD]: {
    height: '40px',
    padding: '0 24px',
  },
  [scales.SM]: {
    height: '32px',
    padding: '0 16px',
  },
  [scales.XS]: {
    height: '20px',
    fontSize: '12px',
    padding: '0 8px',
  },
}

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: '#EC649C',
    color: '#FFFFFF',
    fontSize: '14px',
    borderRadius: '39px',
  },
  [variants.SECONDARY]: {
    backgroundColor: 'transparent',
    border: '1px solid',
    borderColor: '#5F647840',
    boxShadow: 'none',
    color: 'text',
    ':disabled': {
      backgroundColor: 'transparent',
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: 'chipBack',
    boxShadow: 'none',
    color: 'white',
  },
  [variants.SUBTLE]: {
    backgroundColor: 'textSubtle',
    color: 'backgroundAlt',
  },
  [variants.DANGER]: {
    backgroundColor: 'failure',
    color: 'white',
  },
  [variants.SUCCESS]: {
    backgroundColor: 'success',
    color: 'white',
  },
  [variants.TEXT]: {
    backgroundColor: 'transparent',
    color: 'primary',
    boxShadow: 'none',
  },
  [variants.LIGHT]: {
    backgroundColor: 'input',
    color: 'textSubtle',
    boxShadow: 'none',
  },
  [variants.DARK]: {
    backgroundColor: 'chipBack',
    color: 'white',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.2)'
  }
}
