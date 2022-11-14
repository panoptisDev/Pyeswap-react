import styled from 'styled-components'

export const ActionContainer = styled.div`
  padding: 24px;
  border: 1px solid ${({ theme }) => theme.colors.background};
  border-radius: 14px;
  flex-grow: 1;
  flex-basis: 0;
  margin-top: 20px;
  max-width: 372px;
  display: flex;
  flex-direction: column;
  align-items: stretch;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-left: 12px;
    margin-right: 12px;
    margin-top: 0;
    height: 130px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-left: 25px;
    margin-right: 0;
    margin-top: 0;
    height: 130px;
  }
`

export const ActionTitles = styled.div`
  display: flex;
`

export const ActionContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex: 1;
`
