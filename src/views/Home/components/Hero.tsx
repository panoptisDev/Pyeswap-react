import React from 'react'
import {useHistory} from "react-router-dom";
import styled, { keyframes } from 'styled-components'
import { Box, Flex, Heading, Button, Text } from 'uikit'
import { useWeb3React } from '@web3-react/core'
import { useTranslation } from 'contexts/Localization'
import ConnectWalletButton from 'components/ConnectWalletButton'
import useTheme from 'hooks/useTheme'
import { SlideSvgDark, SlideSvgLight } from './SlideSvg'
// import "../../../../public/images/home/pye/pye_old.png"

const heroImg = "/images/home/PYESWAP_Hero_4.2.png"
const heroLogo = "/public/images/HERO_IMG.png"
const herLogo = "/images/home/pye/NAVBAR_LOGO.png"
const appleImg = "/images/home/pye/ap.png"
const cherryImg = "/images/home/pye/ch.png"
const pyeImg = "images/home/pye/pye1.png"

const flyingAnim = () => keyframes`
  from {
    transform: translate(0,  0px);
  }
  50% {
    transform: translate(-5px, -5px);
  }
  to {
    transform: translate(0, 0px);
  }
`

const fading = () => keyframes`
  from {
    opacity: 0.9;
  }
  50% {
    opacity: 0.1;
  }
  to {
    opacity: 0.9;
  }
`
// @TODO: Add z-index to image, image can overflow, baackground can't ~Quan
const BgWrapper = styled.div`
  z-index: -1;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: -4px;
  left: 0px;
  background: url(${heroImg}) no-repeat;
  background-size: 100%;
  
  img {
  }
`
// New
// const BgWrapper = styled.div`
//   z-index: -1;
//   overflow: hidden;
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   bottom: -4px;
//   left: 0px;
//   background: url(${heroImg}) no-repeat;
//   background-size: 100%;
  
//   img {
//     z-index: 300;
//   }
// `

const InnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  bottom: -3px;
`
const PyePye = styled.div`
  img {
    max-width: 450px;
    max-height: 300px;
  }
`
const PyeLogo = styled.div`

  img {
    max-width: 450px;
    max-height: 300px;
  }
`

const AppleLogo = styled.div`

img {
  max-width: 200px;
  max-height: 300px;
}
`

const CherryLogo = styled.div`
  img {
    max-width: 200px;
    max-height: 200px;
  }
`

const BunnyWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  
  img {
    position: absolute;
    max-width: 200px;
  }
`

const imagePath = '/images/home/pye/'
const imageSrc = 'pye'

const NewBground = styled(Flex)`
  background: white;
  width: 100%;
`
// const NewBground = styled(Box)`
//   background: url(${imagePath}${imageSrcBackground})
//   width: 100%
//   `
// /Users/quan/code/devteamsix/PyeSwap_frontend/public/images/home/PYESWAP_Hero_4.2.png
// const heroImg = "NAVBAR_LOGO.png"


const Hero = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { theme } = useTheme()
  const history = useHistory()

  return (
    <>
      <BgWrapper>
        <img src={heroImg} alt="heroimage" />
         <InnerWrapper>{theme.isDark ? <NewBground /> : <NewBground />}</InnerWrapper>
      </BgWrapper>
      <Flex
        position="relative"
        flexDirection={['column-reverse', null, null, 'row']}
        alignItems={['flex-end', null, null, 'center']}
        justifyContent="center"
        mt={[account ? '280px' : '50px', null, 0]}
        id="homepage-hero"
      >
        <Flex flex="1" flexDirection="column">
          
        
          <Heading scale="lg" color="white" mb="12px">
            {t('Revolutionary Swap 2.0 Technology:')}
          </Heading>
          {/* <Text fontSize='16px' color='textSubtle' style={{ opacity: 0.6 }} mb="32px">
            PYESwap - The First Swap Utilizing BNB To Power BuyBack Functionality. Advancing the blockchain through NEW revolutionary 
            technology. It has accomplished something never before seen in blockchain history. This proprietary tech allows the BNB 
            instead of the native token to be utilized in the swap. In return, projects utilizing the Swap 2.0 function inside of 
            PYESwap will create a positive effect on all projects that launch on MoonForce’s launchpad.
          </Text> */}
          <Flex>
            {!account && <ConnectWalletButton mr="8px" />}
              <Button variant={!account ? 'secondary' : 'primary'} onClick={() => history.push('/swap')}>{t('Trade Now')}</Button>
          </Flex>
        </Flex>
        <Flex
          height={['192px', null, null, '100%']}
          width={['192px', null, null, '100%']}
          flex={[null, null, null, '1']}
          mb={['24px', null, null, '0']}
          position="relative"
        >
            <PyeLogo>
            <img alt="fu" src={`${herLogo}`} />
          </PyeLogo>
          <AppleLogo>
            <img alt="applepyelogo" src={`${appleImg}`} />
          </AppleLogo>
          <PyePye>
            <img alt="damn" src={`${pyeImg}`} />
          </PyePye>
          <CherryLogo>
            <img alt="idc" src={`${cherryImg}`} />
          </CherryLogo>
          {/* <BunnyWrapper>
              <img src={`${imagePath}${imageSrc}.png`} alt="PYE" />
          </BunnyWrapper> */}
        </Flex>
      </Flex>
    </>
  )
}

export default Hero
