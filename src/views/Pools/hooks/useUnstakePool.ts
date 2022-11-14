import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { parseUnits } from 'ethers/lib/utils'
import { useAppDispatch } from 'state'
import { updateUserStakedBalance, updateUserBalance, updateUserPendingReward } from 'state/actions'
import { unstakeFarm } from 'utils/calls'
// eslint-disable-next-line import/named
import { useMasterchef, useSousChef } from 'hooks/useContract'
import getGasPrice from 'utils/getGasPrice'

const sousUnstake = async (sousChefContract: any, amount: string, decimals: number, sousId: any) => {
  const gasPrice = getGasPrice()
  const units = parseUnits(amount, decimals)

  const method = sousId > 1 ? "withdraw" : "leaveStaking"
  const args = sousId === 2 ? ['3', units.toString()] : [units.toString()]

  const tx = await sousChefContract[method](...args, {
    gasPrice,
  })
  const receipt = await tx.wait()
  return receipt.status
}

const sousEmergencyUnstake = async (sousChefContract: any) => {
  const gasPrice = getGasPrice()
  const tx = await sousChefContract.emergencyWithdraw({ gasPrice })
  const receipt = await tx.wait()
  return receipt.status
}

const useUnstakePool = (sousId: number, enableEmergencyWithdraw = false) => {
  const dispatch = useAppDispatch()
  const { account } = useWeb3React()
  const masterChefContract = useMasterchef()
  const sousChefContract = useSousChef(sousId)

  const handleUnstake = useCallback(
    async (amount: string, decimals: number) => {
      if (sousId === 0) {
        await unstakeFarm(masterChefContract, 0, amount)
      } else if (enableEmergencyWithdraw) {
        await sousEmergencyUnstake(sousChefContract)
      } else {
        await sousUnstake(sousChefContract, amount, decimals, sousId)
      }
      dispatch(updateUserStakedBalance(sousId, account))
      dispatch(updateUserBalance(sousId, account))
      dispatch(updateUserPendingReward(sousId, account))
    },
    [account, dispatch, enableEmergencyWithdraw, masterChefContract, sousChefContract, sousId],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstakePool
