import React from 'react'
import BigNumber from 'bignumber.js'
import { CardFooter } from 'uikit'
import { DeserializedPool } from 'state/types'
import ExpandedFooter from './ExpandedFooter'

interface FooterProps {
  pool: DeserializedPool
  account: string
  totalAppleInVault?: BigNumber
}

const Footer: React.FC<FooterProps> = ({ pool, account }) => {
  return (
    <CardFooter>
      <ExpandedFooter pool={pool} account={account} />
    </CardFooter>
  )
}

export default Footer
