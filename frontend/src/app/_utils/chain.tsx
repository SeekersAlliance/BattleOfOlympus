// @ts-nocheck
import { Aptos, AptosConfig, InputViewFunctionData } from '@aptos-labs/ts-sdk'
import { nft_balance_formatter } from './helper'
let _provider: Aptos | undefined
const endpoint = 'https://aptos.testnet.suzuka.movementlabs.xyz/v1'
export const contract_address = '0xd78afc1a0b56b2e091caedcdb164385564ad6a553261fe2e3102a022e3ca6d4d'
import axios from 'axios'
import { AptosSignAndSubmitTransactionInput } from '@aptos-labs/wallet-standard'

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

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const get_transaction_details = async (txn_hash: string) => {
  const maxRetries = 10;
  const retryDelay = 1000; // 1 second

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await axios.get(`${endpoint}/transactions/by_hash/${txn_hash}`);
      if (response.data) {
        return response.data;
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
    }

    if (attempt < maxRetries) {
      console.log(`Retrying in ${retryDelay / 1000} seconds...`);
      await delay(retryDelay);
    }
  }

  throw new Error(`Failed to fetch transaction details after ${maxRetries} attempts`);
}


export const handle_game = async (wallet: any, router:any, bet_number: number, nfts: any) => {
  if (wallet.account === undefined) {
    return;
  }
  const transaction: AptosSignAndSubmitTransactionInput = {
    payload: {
    // All transactions on Aptos are implemented via smart contracts.
    function: `${contract_address}::gameManager::create_game`,
    functionArguments: [bet_number],
    },
  };
  let tx = await wallet.signAndSubmitTransaction(transaction).catch (error => {
    console.log("error",error);
    window.alert("Oops, something went wrong.\nPlease make sure you have $MOVE for gas and try again.");
  });
  console.log(tx)
  if (tx == undefined || tx.status == "Rejected") return;
  localStorage.setItem("bet", bet_number)
  localStorage.setItem("myCards", nfts.join(","))
  router.push("/game")
  
}