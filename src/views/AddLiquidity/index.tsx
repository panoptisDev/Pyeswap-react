import React, {useCallback, useEffect, useState} from 'react'
import {BigNumber} from '@ethersproject/bignumber'
import {TransactionResponse} from '@ethersproject/providers'
import {Currency, currencyEquals, ETHER, TokenAmount, WETH} from '@pyeswap/swap-sdk'
import {Box, Button, CardBody, Flex, Message, Text, useModal} from 'uikit'
import {RouteComponentProps} from 'react-router-dom'
import {useIsTransactionUnsupported} from 'hooks/Trades'
import {useTranslation} from 'contexts/Localization'
import UnsupportedCurrencyFooter from 'components/UnsupportedCurrencyFooter'
import useActiveWeb3React from 'hooks/useActiveWeb3React'
import {useDispatch} from 'react-redux'
import {AppDispatch} from '../../state'
import {LightCard, LightGreyCard} from '../../components/Card'
import {AutoColumn} from '../../components/Layout/Column'
import TransactionConfirmationModal, {ConfirmationModalContent} from '../../components/TransactionConfirmationModal'
import CurrencyInputPanel from '../../components/CurrencyInputPanel'
import {DoubleCurrencyLogo} from '../../components/Logo'
import {AppBody, AppHeader} from '../../components/App'
import {MinimalPositionCard} from '../../components/PositionCard'
import Row, {RowBetween} from '../../components/Layout/Row'
import ConnectWalletButton from '../../components/ConnectWalletButton'

import {ROUTER_ADDRESS} from '../../config/constants'
import {PairState} from '../../hooks/usePairs'
import {useCurrency} from '../../hooks/Tokens'
import {ApprovalState, useApproveCallback} from '../../hooks/useApproveCallback'
import useTransactionDeadline from '../../hooks/useTransactionDeadline'
import {Field, resetMintState} from '../../state/mint/actions'
import {useDerivedMintInfo, useMintActionHandlers, useMintState} from '../../state/mint/hooks'

import {useTransactionAdder} from '../../state/transactions/hooks'
import {useGasPrice, useIsExpertMode, useUserSlippageTolerance} from '../../state/user/hooks'
import {calculateGasMargin, calculateSlippageAmount, getRouterContract} from '../../utils'
import {maxAmountSpend} from '../../utils/maxAmountSpend'
import {wrappedCurrency} from '../../utils/wrappedCurrency'
import Dots from '../../components/Loader/Dots'
import ConfirmAddModalBottom from './ConfirmAddModalBottom'
import {currencyId} from '../../utils/currencyId'
import PoolPriceBar from './PoolPriceBar'
import Page from '../Page'
import useTheme from "../../hooks/useTheme";

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB },
  },
  history,
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const dispatch = useDispatch<AppDispatch>()
  const { t } = useTranslation()
  const gasPrice = useGasPrice()
  const { theme } = useTheme()
  const [supportsFee, setSupportsFee] = useState<boolean>(false)
  const [feeTaker, setFeeTaker] = useState(Field.CURRENCY_A)

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  useEffect(() => {
    if (!currencyIdA && !currencyIdB) {
      dispatch(resetMintState())
    }
  }, [dispatch, currencyIdA, currencyIdB])

  const oneCurrencyIsWETH = Boolean(
    chainId &&
      ((currencyA && currencyEquals(currencyA, WETH[chainId])) ||
        (currencyB && currencyEquals(currencyB, WETH[chainId]))),
  )

  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal and loading
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field]),
      }
    },
    {},
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0'),
      }
    },
    {},
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS)
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS)

  const addTransaction = useTransactionAdder()

  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB || !deadline) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0],
    }

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number | boolean>
    let value: BigNumber | null
    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        supportsFee,
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      args = [
        !supportsFee ? (wrappedCurrency(currencyA, chainId)?.address ?? '') : feeTaker === Field.CURRENCY_A ? (wrappedCurrency(currencyA, chainId)?.address ?? '') : wrappedCurrency(currencyB, chainId)?.address ?? '',
        !supportsFee ? (wrappedCurrency(currencyB, chainId)?.address ?? '') : feeTaker === Field.CURRENCY_A ? (wrappedCurrency(currencyB, chainId)?.address ?? '') : wrappedCurrency(currencyA, chainId)?.address ?? '',
        supportsFee,
        !supportsFee ? parsedAmountA.raw.toString() : feeTaker === Field.CURRENCY_A ? parsedAmountA.raw.toString() : parsedAmountB.raw.toString(),
        !supportsFee ? parsedAmountB.raw.toString() : feeTaker === Field.CURRENCY_A ? parsedAmountB.raw.toString() : parsedAmountA.raw.toString(),
        !supportsFee ? amountsMin[Field.CURRENCY_A].toString() : feeTaker === Field.CURRENCY_A ? amountsMin[Field.CURRENCY_A].toString() : amountsMin[Field.CURRENCY_B].toString(),
        !supportsFee ? amountsMin[Field.CURRENCY_B].toString() : feeTaker === Field.CURRENCY_A ? amountsMin[Field.CURRENCY_B].toString() : amountsMin[Field.CURRENCY_A].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setAttemptingTxn(true)
    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response) => {
          setAttemptingTxn(false)

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${
              currencies[Field.CURRENCY_A]?.symbol
            } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
          })

          setTxHash(response.hash)
        }),
      )
      .catch((err) => {
        setAttemptingTxn(false)
        // we only care if the error is something _other_ than the user rejected the tx
        if (err?.code !== 4001) {
          console.error(err)
        }
      })
  }

  const modalHeader = () => {
    return noLiquidity ? (
      <Flex alignItems="center">
        <Text fontSize="36px" bold marginRight="10px">
          {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
        </Text>
        <DoubleCurrencyLogo
          currency0={currencies[Field.CURRENCY_A]}
          currency1={currencies[Field.CURRENCY_B]}
          size={30}
        />
      </Flex>
    ) : (
      <AutoColumn>
        <Flex alignItems="center">
          <Text bold fontSize="36px" marginRight="10px">
            {liquidityMinted?.toSignificant(6)}
          </Text>
          <DoubleCurrencyLogo
            currency0={currencies[Field.CURRENCY_A]}
            currency1={currencies[Field.CURRENCY_B]}
            size={30}
          />
        </Flex>
        <Row>
          <Text fontSize="20px">
            {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol} Pool Tokens`}
          </Text>
        </Row>
        <Text small textAlign="left" my="18px" style={{ opacity: 0.4 }}>
          {t('Output is estimated. If the price changes by more than %slippage%% your transaction will revert.', {
            slippage: allowedSlippage / 100,
          })}
        </Text>
      </AutoColumn>
    )
  }

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const pendingText = t('Supplying %amountA% %symbolA% and %amountB% %symbolB%', {
    amountA: parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    symbolA: currencies[Field.CURRENCY_A]?.symbol ?? '',
    amountB: parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
    symbolB: currencies[Field.CURRENCY_B]?.symbol ?? '',
  })

  const handleCurrencyASelect = useCallback(
    (currencyA_: Currency) => {
      const newCurrencyIdA = currencyId(currencyA_)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else if (currencyIdB) {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      } else {
        history.push(`/add/${newCurrencyIdA}`)
      }
    },
    [currencyIdB, history, currencyIdA],
  )
  const handleCurrencyBSelect = useCallback(
    (currencyB_: Currency) => {
      const newCurrencyIdB = currencyId(currencyB_)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA || 'BNB'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB],
  )

  const handleDismissConfirmation = useCallback(() => {
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
  }, [onFieldAInput, txHash])

  const addIsUnsupported = useIsTransactionUnsupported(currencies?.CURRENCY_A, currencies?.CURRENCY_B)

  const [onPresentAddLiquidityModal] = useModal(
    <TransactionConfirmationModal
      title={noLiquidity ? t('You are creating a pool') : t('You will receive')}
      customOnDismiss={handleDismissConfirmation}
      attemptingTxn={attemptingTxn}
      hash={txHash}
      content={() => <ConfirmationModalContent topContent={modalHeader} bottomContent={modalBottom} />}
      pendingText={pendingText}
      currencyToAdd={pair?.liquidityToken}
    />,
    true,
    true,
    'addLiquidityModal',
  )

  return (
    <Page>
      <AppBody alt width="530px" height="400px">
        <AppHeader title={t('Add Liquidity')} backTo="/pool" />

        <CardBody p='24px 0 0'>
          <AutoColumn gap="20px">
            {noLiquidity && (
              <Message variant="warning">
                <div>
                  <Text color="textSubtle" bold mb="4px">
                    {t('You are the first liquidity provider.')}
                  </Text>
                  <Text style={{ opacity: 0.6 }} fontSize="14px" color="textSubtle">
                    {t('The ratio of tokens you add will set the price of this pool.')}
                  </Text>
                  <Text style={{ opacity: 0.6 }} fontSize="14px" color="textSubtle">{t('Once you are happy with the rate click supply to review.')}</Text>
                  <Text style={{ opacity: 0.6 }} fontSize="14px" color="textSubtle">{t('Note: If you would like fees in BNB, please read Docs before proceeding.')}</Text>
                </div>
              </Message>
            )}
            <Text color="textSubtle" style={{ opacity: 0.4}}>
              Select Currency
            </Text>

            <CurrencyInputPanel
              alt
              value={formattedAmounts[Field.CURRENCY_A]}
              horizontal={!account}
              onUserInput={onFieldAInput}
              onMax={() => {
                onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
              }}
              onCurrencySelect={handleCurrencyASelect}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
              currency={currencies[Field.CURRENCY_A]}
              id="add-liquidity-input-tokena"
              showCommonBases
            />
            {account && (<Text fontSize='28px' color='secondary' textAlign='center' bold>+</Text>)}
            <CurrencyInputPanel
              alt
              value={formattedAmounts[Field.CURRENCY_B]}
              horizontal={!account}
              onUserInput={onFieldBInput}
              onCurrencySelect={handleCurrencyBSelect}
              onMax={() => {
                onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
              }}
              showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
              currency={currencies[Field.CURRENCY_B]}
              id="add-liquidity-input-tokenb"
              showCommonBases
            />
            {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <>
                <LightCard padding="0px" borderRadius="20px">
                  <RowBetween padding="1rem">
                    <Text fontSize="14px">
                      {noLiquidity ? t('Initial prices and pool share') : t('Prices and pool share')}
                    </Text>
                  </RowBetween>{' '}
                  <LightCard padding="1rem" borderRadius="20px">
                    <PoolPriceBar
                      currencies={currencies}
                      poolTokenPercentage={poolTokenPercentage}
                      noLiquidity={noLiquidity}
                      price={price}
                    />
                  </LightCard>
                </LightCard>
              </>
            )}

            {noLiquidity && currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
              <>
                <Box padding="0px" borderRadius="20px">
                  <RowBetween padding="1rem 0 0.5rem">
                    <Text fontSize="14px" color='textSubtle' style={{ opacity: 0.4 }}>
                      Initial pool Swap Fee
                    </Text>
                  </RowBetween>{' '}
                  <LightGreyCard style={{ borderColor: `${theme.colors.backgroundAlt}` }} padding="1rem" borderRadius="20px">
                    <Flex
                      alignItems='center'
                      justifyContent='space-between'
                      pb={supportsFee ? '16px' : '0'}
                      mb={supportsFee ? '16px' : '0'}
                      style={{ borderBottom: supportsFee ? `1px solid ${theme.colors.text}18` : 'none' }}
                    >
                      <Text fontSize="14px" style={{ whiteSpace: 'nowrap' }}>
                        Does your token support Swap 2.0 fees?
                      </Text>
                      <Flex alignItems='center' justifyContent='flex-end'>
                        <Button onClick={() => setSupportsFee(true)} variant={supportsFee ? 'primary' : 'text'} scale='sm' mr='8px'>
                          Yes
                        </Button>
                        <Button onClick={() => setSupportsFee(false)} variant={!supportsFee ? 'primary' : 'text'} scale='sm'>
                          No
                        </Button>
                      </Flex>
                    </Flex>
                    {supportsFee && (
                      <Flex flexDirection='column' justifyContent='flex-end'>
                        <Button onClick={() => setFeeTaker(Field.CURRENCY_B)} variant={feeTaker === Field.CURRENCY_B ? 'primary' : 'text'} scale='md' mb='8px'>
                          Take {currencies[Field.CURRENCY_A].symbol} as fee
                        </Button>
                        <Button onClick={() => setFeeTaker(Field.CURRENCY_A)} variant={feeTaker === Field.CURRENCY_A ? 'primary' : 'text'} scale='md'>
                          Take {currencies[Field.CURRENCY_B].symbol} as fee
                        </Button>
                      </Flex>
                    )}
                  </LightGreyCard>
                </Box>
              </>
            )}

            {addIsUnsupported ? (
              <Button disabled mb="4px">
                {t('Unsupported Asset')}
              </Button>
            ) : !account ? (
              <ConnectWalletButton mt="15px" />
            ) : (
              <AutoColumn gap="md">
                {(approvalA === ApprovalState.NOT_APPROVED ||
                  approvalA === ApprovalState.PENDING ||
                  approvalB === ApprovalState.NOT_APPROVED ||
                  approvalB === ApprovalState.PENDING) &&
                  isValid && (
                    <RowBetween>
                      {approvalA !== ApprovalState.APPROVED && (
                        <Button
                          onClick={approveACallback}
                          disabled={approvalA === ApprovalState.PENDING}
                          width={approvalB !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalA === ApprovalState.PENDING ? (
                            <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })}</Dots>
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.CURRENCY_A]?.symbol })
                          )}
                        </Button>
                      )}
                      {approvalB !== ApprovalState.APPROVED && (
                        <Button
                          onClick={approveBCallback}
                          disabled={approvalB === ApprovalState.PENDING}
                          width={approvalA !== ApprovalState.APPROVED ? '48%' : '100%'}
                        >
                          {approvalB === ApprovalState.PENDING ? (
                            <Dots>{t('Enabling %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })}</Dots>
                          ) : (
                            t('Enable %asset%', { asset: currencies[Field.CURRENCY_B]?.symbol })
                          )}
                        </Button>
                      )}
                    </RowBetween>
                  )}
                <Button
                  variant={
                    !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                      ? 'danger'
                      : 'primary'
                  }
                  onClick={() => {
                    if (expertMode) {
                      onAdd()
                    } else {
                      onPresentAddLiquidityModal()
                    }
                  }}
                  disabled={!isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED}
                >
                  {error ?? t('Supply')}
                </Button>
              </AutoColumn>
            )}
          </AutoColumn>
        </CardBody>
      </AppBody>
      {!addIsUnsupported ? (
        pair && !noLiquidity && pairState !== PairState.INVALID ? (
          <AutoColumn style={{ minWidth: '20rem', width: '100%', maxWidth: '530px', marginTop: '1rem' }}>
            <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
          </AutoColumn>
        ) : null
      ) : (
        <UnsupportedCurrencyFooter currencies={[currencies.CURRENCY_A, currencies.CURRENCY_B]} />
      )}
    </Page>
  )
}
