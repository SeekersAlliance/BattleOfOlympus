import { Aptos, AptosConfig, InputViewFunctionData } from '@aptos-labs/ts-sdk'
import { nft_balance_formatter } from './helper'
let _provider: Aptos | undefined
const endpoint = 'https://aptos.testnet.suzuka.movementlabs.xyz/v1'
export const contract_address = '0x41e7f4a9847f0455596144f00b937e7b26b9d1ee12b1a3f284f3810d22ba6b35'

const getMovement = () => {
  if (_provider) return _provider
  const conf = new AptosConfig({
    fullnode: endpoint,
  })
  _provider = new Aptos(conf)
  return _provider
}

export const get_token_balance = async (address: string | undefined) => {
  if (address == undefined) return 0
  const aptos = getMovement()
  const payload: InputViewFunctionData = {
    function: `${contract_address}::asset::get_balance`,
    functionArguments: [address],
  };
  const chainId = (await aptos.view({ payload }))[0];
  console.log(chainId)
  return Number(chainId)
}

export const get_nft_balance = async (address: string | undefined) => {
  if (address == undefined) return []
  const aptos = getMovement()
  const payload: InputViewFunctionData = {
    function: `${contract_address}::nft::get_NFT_balance`,
    functionArguments: [address],
  };
  const chainId = (await aptos.view({ payload }))[0];
  console.log(nft_balance_formatter(String(chainId))) 
  return nft_balance_formatter(String(chainId))
}