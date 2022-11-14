import React from 'react'
import {useRouteMatch, useHistory} from 'react-router-dom'
import { ViewMode } from 'state/user/actions'
import styled from 'styled-components'
import { Toggle, Text, NotificationDot } from 'uikit'
import { useTranslation } from 'contexts/Localization'
import ToggleView from './ToggleView/ToggleView'
import useTheme from "../../../hooks/useTheme";
import {TabToggle, TabToggleGroup} from "../../../components/TabToggle";

const ToggleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: 10px;

  ${Text} {
    margin-left: 8px;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  display: flex;
  align-items: center;
  width: 100%;
  gap: 30px;

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;
    gap: initial;
  }
`


const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    padding-left: 12px;
    padding-right: 12px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 30px;
  }
`

const StyledTabToggle = styled(TabToggle)`
  padding: 9px 20px;
  min-width: 100px;
`

const PoolTabButtons = ({ stakedOnly, setStakedOnly, hasStakeInFinishedPools, viewMode, setViewMode }) => {
  const { url, isExact } = useRouteMatch()
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const history = useHistory()

  const viewModeToggle = <ToggleView viewMode={viewMode} onToggle={(mode: ViewMode) => setViewMode(mode)} />

  const liveOrFinishedSwitch = (
    <Wrapper>
      <TabToggleGroup>
        <StyledTabToggle isActive={isExact} onClick={() => history.push(url)}>
          {t('Live')}
        </StyledTabToggle>
        <NotificationDot show={hasStakeInFinishedPools}>
          <StyledTabToggle isActive={!isExact} onClick={() => history.push(`${url}/history`)}>
            {t('Finished')}
          </StyledTabToggle>
        </NotificationDot>
      </TabToggleGroup>
    </Wrapper>
  )

  const stakedOnlySwitch = (
    <ToggleWrapper>
      <Toggle
        id="staked-only-farms"
        checked={stakedOnly}
        onChange={() => setStakedOnly(!stakedOnly)}
        scale="md"
        defaultColor={isDark ? 'darkText' : 'toggleBackground'}
        checkedColor={isDark ? 'darkText' : 'toggleBackground'}
      />
      <Text fontSize='15px'> {t('Staked only')}</Text>
    </ToggleWrapper>
  )

  return (
    <ViewControls>
      {viewModeToggle}
      {stakedOnlySwitch}
      {liveOrFinishedSwitch}
    </ViewControls>
  )
}

export default PoolTabButtons
