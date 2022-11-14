import React from 'react'
import styled from 'styled-components'
import { useLocation, Link, useRouteMatch } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem, NotificationDot } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from "../../../../hooks/useTheme";

interface FarmTabButtonsProps {
  hasStakeInFinishedFarms: boolean
}

const FarmTabButtons: React.FC<FarmTabButtonsProps> = ({ hasStakeInFinishedFarms }) => {
  const { url } = useRouteMatch()
  const location = useLocation()
  const { t } = useTranslation()
  const { isDark } = useTheme()

  let activeIndex
  switch (location.pathname) {
    case '/farms':
      activeIndex = 0
      break
    case '/farms/history':
      activeIndex = 1
      break
    case '/farms/archived':
      activeIndex = 2
      break
    default:
      activeIndex = 0
      break
  }

  return (
    <Wrapper>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant={isDark ? "dark" : "primary"}>
        <ButtonMenuItem as={Link} to={`${url}`}>
          {t('Live')}
        </ButtonMenuItem>
        <NotificationDot show={hasStakeInFinishedFarms}>
          <ButtonMenuItem id="finished-farms-button" as={Link} to={`${url}/history`}>
            {t('Finished')}
          </ButtonMenuItem>
        </NotificationDot>
      </ButtonMenu>
    </Wrapper>
  )
}

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
