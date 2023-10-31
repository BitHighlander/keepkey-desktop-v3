import { EIP155_CHAINS, EIP155_SIGNING_METHODS, TEIP155Chain } from '../data/EIP155Data'
import { eip155Addresses, eip155Wallets } from '../utils/EIP155WalletUtil'
import {
  getSignParamsMessage,
  getSignTypedDataParamsData,
  getWalletAddressFromParams
} from '../utils/HelperUtil'
import { formatJsonRpcError, formatJsonRpcResult } from '@json-rpc-tools/utils'
import { SignClientTypes } from '@walletconnect/types'
import { getSdkError } from '@walletconnect/utils'
import { ethers } from 'ethers'
type RequestEventArgs = Omit<SignClientTypes.EventArguments['session_request'], 'verifyContext'>
export async function approveEIP155Request(requestEvent: RequestEventArgs, wallet:any) {
  const { params, id } = requestEvent
  const { chainId, request } = params

  let addressNList = [2147483732, 2147483648, 2147483648, 0, 0]

  //keepkey
  switch (request.method) {
    case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
    case EIP155_SIGNING_METHODS.ETH_SIGN:
      try {
        const message = getSignParamsMessage(request.params)
        console.log("message: ", message)
        const signedMessage = await wallet.signMessage({
          typedData,
          addressNList: hardenedPath.concat(relPath),
        })
        return formatJsonRpcResult(id, signedMessage)

        // const signedMessage = await wallet.signMessage(message)
        // return formatJsonRpcResult(id, signedMessage)
      } catch (error: any) {
        console.error(error)
        alert(error.message)
        return formatJsonRpcError(id, error.message)
      }

    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
    case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      try {
        const { domain, types, message: data } = getSignTypedDataParamsData(request.params)
        // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
        delete types.EIP712Domain
        let typedData  = { types, domain, message: data }
        const signedData = await wallet.signTypedData({
          typedData,
          addressNList,
        })
        return formatJsonRpcResult(id, signedData)

        // const { domain, types, message: data } = getSignTypedDataParamsData(request.params)
        // // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
        // delete types.EIP712Domain
        // const signedData = await wallet._signTypedData(domain, types, data)
        // return formatJsonRpcResult(id, signedData)
      } catch (error: any) {
        console.error(error)
        alert(error.message)
        return formatJsonRpcError(id, error.message)
      }

    case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      try {
        const provider = new ethers.JsonRpcProvider(EIP155_CHAINS[chainId as TEIP155Chain].rpc)
        const sendTransaction = request.params[0]
        const connectedWallet = wallet.connect(provider)
        const signature = await wallet.signTransaction(sendTransaction)
        console.log("signature: ", signature)
        // const { hash } = await connectedWallet.sendTransaction(sendTransaction)
        // return formatJsonRpcResult(id, hash)


        // const provider = new ethers.JsonRpcProvider(EIP155_CHAINS[chainId as TEIP155Chain].rpc)
        // const sendTransaction = request.params[0]
        // const connectedWallet = wallet.connect(provider)
        // const { hash } = await connectedWallet.sendTransaction(sendTransaction)
        // return formatJsonRpcResult(id, hash)
      } catch (error: any) {
        console.error(error)
        alert(error.message)
        return formatJsonRpcError(id, error.message)
      }

    case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
      try {
        const signTransaction = request.params[0]
        console.log("signTransaction: ", signTransaction)

        // const baseTx = {
        //   addressNList,
        //   chainId: BigNumber.from(ChainToChainId[this.chain]).toHexString(),
        //   to,
        //   value: BigNumber.from(value || 0).toHexString(),
        //   gasLimit: BigNumber.from(gasLimit).toHexString(),
        //   nonce: BigNumber.from(
        //       nonce || (await this._innerProvider.getTransactionCount(from, 'pending')),
        //   ).toHexString(),
        //   data,
        //   ...(isEIP1559
        //       ? {
        //         maxFeePerGas: BigNumber.from(restTx?.maxFeePerGas).toHexString(),
        //         maxPriorityFeePerGas: BigNumber.from(restTx.maxPriorityFeePerGas).toHexString(),
        //       }
        //       : { gasPrice: BigNumber.from(restTx.gasPrice).toHexString() }),
        // };
        //
        // const signature = await wallet.ethSignTx(baseTx)
        // return formatJsonRpcResult(id, signature)
      } catch (error: any) {
        console.error(error)
        alert(error.message)
        return formatJsonRpcError(id, error.message)
      }

    default:
      throw new Error(getSdkError('INVALID_METHOD').message)
  }


  // const wallet = eip155Wallets[getWalletAddressFromParams(eip155Addresses, params)]
  //
  // switch (request.method) {
  //   case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
  //   case EIP155_SIGNING_METHODS.ETH_SIGN:
  //     try {
  //       const message = getSignParamsMessage(request.params)
  //       const signedMessage = await wallet.signMessage(message)
  //       return formatJsonRpcResult(id, signedMessage)
  //     } catch (error: any) {
  //       console.error(error)
  //       alert(error.message)
  //       return formatJsonRpcError(id, error.message)
  //     }
  //
  //   case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
  //   case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
  //   case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
  //     try {
  //       const { domain, types, message: data } = getSignTypedDataParamsData(request.params)
  //       // https://github.com/ethers-io/ethers.js/issues/687#issuecomment-714069471
  //       delete types.EIP712Domain
  //       const signedData = await wallet._signTypedData(domain, types, data)
  //       return formatJsonRpcResult(id, signedData)
  //     } catch (error: any) {
  //       console.error(error)
  //       alert(error.message)
  //       return formatJsonRpcError(id, error.message)
  //     }
  //
  //   case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
  //     try {
  //       const provider = new ethers.JsonRpcProvider(EIP155_CHAINS[chainId as TEIP155Chain].rpc)
  //       const sendTransaction = request.params[0]
  //       const connectedWallet = wallet.connect(provider)
  //       const { hash } = await connectedWallet.sendTransaction(sendTransaction)
  //       return formatJsonRpcResult(id, hash)
  //     } catch (error: any) {
  //       console.error(error)
  //       alert(error.message)
  //       return formatJsonRpcError(id, error.message)
  //     }
  //
  //   case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
  //     try {
  //       const signTransaction = request.params[0]
  //       const signature = await wallet.signTransaction(signTransaction)
  //       return formatJsonRpcResult(id, signature)
  //     } catch (error: any) {
  //       console.error(error)
  //       alert(error.message)
  //       return formatJsonRpcError(id, error.message)
  //     }
  //
  //   default:
  //     throw new Error(getSdkError('INVALID_METHOD').message)
  // }
}

export function rejectEIP155Request(request: RequestEventArgs) {
  const { id } = request

  return formatJsonRpcError(id, getSdkError('USER_REJECTED').message)
}
