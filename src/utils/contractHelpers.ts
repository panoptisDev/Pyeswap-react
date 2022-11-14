import { ethers } from 'ethers'
import { simpleRpcProvider } from 'utils/providers'
import tokens from 'config/constants/tokens'
import {poolsConfig} from "config/constants";
import {PoolCategory} from "config/constants/types";

// Addresses
import {
  getAddress,
  getAppleVaultAddress,
  getMasterChefAddress,
  getMulticallAddress,
} from 'utils/addressHelpers'

// ABI
import bep20Abi from 'config/abi/erc20.json'
import erc721Abi from 'config/abi/erc721.json'
import lpTokenAbi from 'config/abi/lpToken.json'
import pyeAbi from 'config/abi/pye.json'
import appleAbi from 'config/abi/apple.json'
import cherryAbi from 'config/abi/chery.json'
import masterChef from 'config/abi/masterchef.json'
import MultiCallAbi from 'config/abi/Multicall.json'
import sousChefBnb from 'config/abi/sousChefBnb.json'
import cherryChef from 'config/abi/cherryChef.json'
import sousChefV2 from 'config/abi/sousChefV2.json'
import appleVaultAbi from 'config/abi/appleVault.json'

const getContract = (abi: any, address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  const signerOrProvider = signer ?? simpleRpcProvider
  return new ethers.Contract(address, abi, signerOrProvider)
}

export const getBep20Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(bep20Abi, address, signer)
}
export const getErc721Contract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(erc721Abi, address, signer)
}
export const getLpContract = (address: string, signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(lpTokenAbi, address, signer)
}
export const getPYEContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(pyeAbi, tokens.pye.address, signer)
}
export const getAppleContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(appleAbi, tokens.apple.address, signer)
}
export const getCherryContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(cherryAbi, tokens.cherry.address, signer)
}
export const getMasterchefContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(masterChef, getMasterChefAddress(), signer)
}
export const getMulticallContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(MultiCallAbi, getMulticallAddress(), signer)
}
export const getSouschefContract = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  const abi = id > 2 ? sousChefV2 : cherryChef
  return getContract(abi, getAddress(config.contractAddress), signer)
}
export const getSouschefV2Contract = (id: number, signer?: ethers.Signer | ethers.providers.Provider) => {
  const config = poolsConfig.find((pool) => pool.sousId === id)
  return getContract(sousChefV2, getAddress(config.contractAddress), signer)
}
export const getAppleVaultContract = (signer?: ethers.Signer | ethers.providers.Provider) => {
  return getContract(appleVaultAbi, getAppleVaultAddress(), signer)
}