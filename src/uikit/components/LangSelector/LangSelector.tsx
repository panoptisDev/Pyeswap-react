import React from 'react'
import Text from '../Text/Text'
import Dropdown from '../Dropdown/Dropdown'
import Button from '../Button/Button'
import LanguageIcon from '../Svg/Icons/Language'
import MenuButton from './MenuButton'
import { Colors } from '../../theme'
import { Language } from './types'
import { Position } from '../Dropdown/types'
import { Scale } from '../Button/types'
import { Flex } from '../Box'
import {ArrowDownIcon} from "../Svg";

interface Props {
  currentLang: string
  langs: Language[]
  setLang: (lang: Language) => void
  color: keyof Colors
  dropdownPosition?: Position
  buttonScale?: Scale
  hideLanguage?: boolean
}

const LangSelector: React.FC<Props> = ({
  currentLang,
  langs,
  color,
  setLang,
  dropdownPosition = 'bottom',
}) => (
  <Dropdown
    position={dropdownPosition}
    target={
      <Flex alignItems="center" justifyContent="flex-start">
        <Button variant="text" startIcon={<LanguageIcon color={color} width="20px" />} endIcon={<ArrowDownIcon color={color} width='12px'/>}>
          <Text small color={color}>
            {currentLang?.toUpperCase()}
          </Text>
        </Button>
      </Flex>
    }
  >
    {langs.map((lang) => (
      <MenuButton
        key={lang.locale}
        fullWidth
        onClick={() => setLang(lang)}
        // Safari fix
        style={{ minHeight: '32px', height: 'auto' }}
      >
        {lang.language}
      </MenuButton>
    ))}
  </Dropdown>
)

export default React.memo(LangSelector, (prev, next) => prev.currentLang === next.currentLang)
