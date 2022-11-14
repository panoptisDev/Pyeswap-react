import React from 'react'
import styled from 'styled-components'
import {Grid as MuiGrid, Paper, Box as MuiBox} from '@mui/material'
import {Container , Row, Col} from 'react-grid-system'
import PageSection from 'components/PageSection'
import PageSection2 from 'components/PageSection2'
import { useWeb3React } from '@web3-react/core'
import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import { bg } from 'date-fns/locale'
import Hero from "./components/Hero";
import PYEDataRow from "./components/PYEDataRow";
import AppleDataRow from "./components/AppleDataRow";
import CherryDataRow from "./components/CherryDataRow";
import FarmsRow from "./components/FarmsRow";
import {Box, Button, CardHeader, Flex, Heading, Text} from "../../uikit";
import ConnectWalletButton from "../../components/ConnectWalletButton";


const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;
  border-bottom: none;


  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`
const OuterBox = styled(PageSection2)`
  padding: 48px 0;
  align-items: center;
`

const AppleRow = styled(AppleDataRow)`

`

const fBy = `
box-shadow: rgb(243 141 186 / 45%) 0px 0px 12px;  
margin-bottom: 15px;
border-radius: 24px;`

const outerBoxStyles = "uk-grid-small uk-child-width-expand@s uk-text-center"
const InnerBox = styled(Box)`
  padding: 16px 24px 32px;
`
const innerBoxStyles = "uk-card uk-card-default uk-card-body"

const Home: React.FC = () => {
  const {theme} = useTheme()
  const {account} = useWeb3React()
  
  const HomeSectionContainerStyles = {margin: '0', width: '100%', maxWidth: '1200px', padding: '16px 24px 32px'}
  const AppleAndCherryFourByFourStyles: any = {
    margin: 0, width: '95%', padding: '0 0 0',
    boxShadow: 'rgb(243 141 186 / 75%) 0px 0px 12px',
    marginBottom: '15px',
  borderRadius:'24px', 
  alignItems:'center', 
  textAlign: 'center',
  backgroundColor: theme.colors.background
}

const SideBySideStyles: any = {
  margin: '0', 
  width: '100%', maxWidth: '1200px', padding: '16px 24px 32px',
   display: 'flex', alignItems: 'center'
};

const PyeFullWidth: any = {
  margin: '0',  maxWidth: '1200px', padding: '0 0 20px 0', 
  boxShadow: 'rgb(243 141 186 / 75%) 0px 0px 12px',
  marginBottom: '15px',
borderRadius:'24px', alignItems:'center', textAlign: 'center',
backgroundColor: theme.colors.background
};

const CardHeaderStyles: any = {
  textAlign: 'left',
  fontSize: '20px',
  fontWeight: '600',
  color: '#E4C48C'
}
const c: any = {
  padding: '0 16px 16px 16px'

}
const FarmsContainerStyle: any = {
  margin: '0 16px 0 16px', width: '96%', maxWidth: '1200px', padding: '0', 
  borderRadius:'24px',
  boxShadow: 'rgb(243 141 186 / 75%) 0px 0px 12px',
}
  return (
    <>
      <PageMeta />
      {/* @TODO: Hero image is applied this linear-gradient that gets overridden. 
        *   Change this so that it doesn't even apply. 
        *   ~Quan
      */}
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
          ? 'linear-gradient(180deg, #221828 22%, transparent 100%)'
          : 'linear-gradient(180deg, #fce0eb 0%, #fdf0f5 50%)'
        }
        
        index={2}
        hasCurvedDivider={false}
        
      >
      {/* <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        background={
          theme.isDark
            ? 'linear-gradient(180deg, #221828 22%, transparent 100%)'
            : 'linear-gradient(180deg, #fce0eb 0%, #fdf0f5 50%)'
        } */}
        
    {/* // background={theme.colors.navBack}
        index={2}
        hasCurvedDivider={false}
      > 
    */}
        <Hero />
      </StyledHeroSection>

      <OuterBox
        innerProps={{ style: PyeFullWidth }}
        background={theme.colors.bodyBackground}
        index={2}
        hasCurvedDivider={false}
      >
        <CardHeader style={CardHeaderStyles}>Pye</CardHeader>
        <PYEDataRow/>
      </OuterBox>
            
        <OuterBox innerProps={{ style: SideBySideStyles }}
          background={theme.colors.bodyBackground}
          index={2}
          hasCurvedDivider={false}>
            {/* <MuiBox sx={{width: '100%'}}> */}
          <MuiGrid container rowSpacing={1} columnSpacing={{xs: 1}}>
          {/* <Side xs={10}> */}
            <MuiGrid item xs={12} sm={12} md={6}>
            <OuterBox innerProps={{ style: AppleAndCherryFourByFourStyles }}
              background={theme.colors.bodyBackground}
              index={2}
              hasCurvedDivider={false}>
                
                <CardHeader style={CardHeaderStyles}>
                  ApplePye
                </CardHeader>
                
                <AppleDataRow />
              
            </OuterBox>
            </MuiGrid>
          <MuiGrid item xs={12} sm={12} md={6}>
          <OuterBox innerProps={{ style: AppleAndCherryFourByFourStyles }}
            background={theme.colors.bodyBackground}
            index={2}
            hasCurvedDivider={false}>
              <CardHeader style={CardHeaderStyles}>
                CherryPye
              </CardHeader>
            <CherryDataRow  />
          </OuterBox>
          </MuiGrid>
        </MuiGrid>
</OuterBox>

      <OuterBox
        innerProps={{ style: FarmsContainerStyle }}
        background={theme.colors.bodyBackground}
        index={2}
        hasCurvedDivider={false}
      >
        <CardHeader style={CardHeaderStyles}>Top Farms</CardHeader>
        <FarmsRow />
      </OuterBox>

      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.bodyBackground}
        index={2}
        hasCurvedDivider={false}
      >
        <Flex
          position="relative"
          flexDirection={['column-reverse', null, null, 'row']}
          alignItems={['flex-end', null, null, 'center']}
          justifyContent="center"
          mt={[account ? '280px' : '50px', null, 0]}
          id="team"
        >
          <Flex flex="1" flexDirection="column">
            <Heading scale="xl" color="secondary" mb="12px">
              About us
            </Heading>
            <Text fontSize='20px' color='textSubtle' style={{ opacity: 0.6 }} mb="8px">
              PYESwap was created to fulfill a need in the blockchain industry. Tokens who use buyback in the 
              tokenomics are forced to use the tokens built up in the contract, sell on the open market to 
              fuel the buyback. UNTIL NOW. Now projects will have BNB that is built up in the contract and 
              will be able to utilize the BNB to power up the buyback. Instead of creating a negative impact 
              on the project, it will create a positive impact. 
              </Text>
              <Text fontSize='20px' color='textSubtle' style={{ opacity: 0.6 }} mb="8px">
              Now, projects will have the ability to use the funds from the BNB for project development, 
              marketing, etc. PYESwap is creating more opportunities for projects, investors, & institutions 
              to utilize new blockchain technology that will further advance as crypto continues to be widely adopted.
              </Text>
          </Flex>
        </Flex>
      </PageSection>
    </>
  );
}

export default Home;