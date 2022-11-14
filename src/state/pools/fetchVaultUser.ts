import BigNumber from 'bignumber.js'
import { getAppleVaultContract } from 'utils/contractHelpers'

const appleVaultContract = getAppleVaultContract()

const fetchVaultUser = async (account: string) => {
  try {
    const userContractResponse = await appleVaultContract.userInfo(account)
    return {
      isLoading: false,
      userShares: new BigNumber(userContractResponse.shares.toString()).toJSON(),
      lastDepositedTime: userContractResponse.lastDepositedTime.toString(),
      lastUserActionTime: userContractResponse.lastUserActionTime.toString(),
      appleAtLastUserAction: new BigNumber(userContractResponse.appleAtLastUserAction.toString()).toJSON(),
    }
  } catch (error) {
    return {
      isLoading: true,
      userShares: null,
      lastDepositedTime: null,
      lastUserActionTime: null,
      appleAtLastUserAction: null,
    }
  }
}

export default fetchVaultUser
