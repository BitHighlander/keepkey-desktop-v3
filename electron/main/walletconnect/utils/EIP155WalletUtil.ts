import EIP155Lib from '../lib/EIP155Lib'

export let wallet1: EIP155Lib
export let wallet2: EIP155Lib
export let eip155Wallets: Record<string, EIP155Lib>
export let eip155Addresses: string[]

let address1: string
let address2: string

/**
 * Utilities
 */
export function createOrRestoreEIP155Wallet(mnemonic: string) {
  wallet1 = EIP155Lib.init({ mnemonic })
  address1 = wallet1.getAddress()
  address2 = wallet1.getAddress()

  eip155Wallets = {
    [address1]: wallet1,
    [address2]: wallet1
  }
  eip155Addresses = Object.keys(eip155Wallets)

  return {
    eip155Wallets,
    eip155Addresses
  }
}
