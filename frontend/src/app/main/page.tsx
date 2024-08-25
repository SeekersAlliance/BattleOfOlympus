//@ts-nocheck
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAptosWallet } from '@razorlabs/wallet-kit';
import { address_formatter} from '../_utils/helper'
import { get_token_balance, get_nft_balance, get_transaction_details } from '../_utils/chain';
import { StoreContext } from '../_components/Provider';
import { AptosSignAndSubmitTransactionInput } from '@aptos-labs/wallet-standard';
import { contract_address } from '../_utils/chain';
import { nft_balance_formatter } from '../_utils/helper';
import { handle_game } from '../_utils/chain';
import { clear } from 'console';

const Home = () => {
  const {tokenBalace, setTokenBalance, nftBalance, setNftBalance, drawTx, setDrawTx} = React.useContext(StoreContext);
  const wallet = useAptosWallet();
  const router = useRouter();
  const [bet, setBet] = React.useState(0)
  const [popup, setPopup] = React.useState(false)
  const [maxCard, setMaxCard] = React.useState(false)
  const [balance, setBalance] = React.useState(0)
  const [buyEvent, setBuyEvent] = React.useState(false)

  
  React.useEffect(() => {
    if (!(wallet.connected) && wallet.account === undefined) {
      wallet.disconnect();
      router.push("/")
    }
  }
  , [wallet]);
  React.useEffect(() => {
    setMaxCard(nftBalance.length >= 50)
  }
  , [nftBalance]);


  const pop_cancel = () => {
      setPopup(false)
  }
  const pop_alert = () => {
      setPopup(true)
  }
  const handle_faucet = async () => {
    if (wallet.account === undefined) {
      return;
    }
    const transaction: AptosSignAndSubmitTransactionInput = {
      payload: {
      // All transactions on Aptos are implemented via smart contracts.
      function: `${contract_address}::asset::mint_to_primary_stores`,
      functionArguments: [wallet.address, 10],
      },
    };
    let tx = await wallet.signAndSubmitTransaction(transaction).catch (error => {
      console.log("error",error);
      window.alert("Oops, something went wrong.\nPlease make sure you have $MOVE for gas and try again.");
    });
    console.log("hash",tx.args.hash);
    setTokenBalance(prev => prev + 10)

    window.open("https://faucet.movementlabs.xyz/?network=aptos", "_blank");
  }
  const handle_buy = async () => {
    if(buyEvent) return
    setBuyEvent(prev => true)

    if (wallet.account === undefined) {
      return;
    }
    let rAnDom_SeEd = Math.floor(Math.random() * 1000000000000000000);; // u64
    const transaction: AptosSignAndSubmitTransactionInput = {
      payload: {
      // All transactions on Aptos are implemented via smart contracts.
      function: `${contract_address}::market::draw_cards`,
      typeArguments: ["0x275f508689de8756169d1ee02d889c777de1cebda3a7bbcce63ba8a27c563c6f::tokens::USDC"],
      functionArguments: [rAnDom_SeEd],
      },
    };
    let tx = await wallet.signAndSubmitTransaction(transaction).catch (error => {
      console.log("error",error);
      window.alert("Oops, something went wrong.\nPlease make sure you have $MOVE for gas and try again.");
    });
    if (tx === undefined) {
      setBuyEvent(prev => false)
      return
    }
    console.log("hash",tx.args.hash);
    //TEST let test_hash = "0xc2cf18e6e3a1bbf9fa236bac346b7878ece2be99c7700ab6b63385833ebb14dd"
    
    
    setDrawTx(tx.args.hash)

    setBuyEvent(prev => false)

    router.push(`/anime`)
  }

  return (
    <div id="main" className="container-block">
      <div className="content" id="main-content">
      <div id="place_bet_box" className={`pop_up_box content ${popup?"up":"noup"}`}>
          <div id="place_bet" className="pop_up">
            <div><img src="./img/bet_title.png"/></div>
            <div className="pop_up_data">
              <div>I want to bet</div>
              <div><input id="pop_up_bet" style={{color:"black", paddingLeft:"10px"}} type="number" value={bet} onChange={(e) => setBet(e.target.value)}/></div>
              
              <div><img src="./img/red_medal.png"/></div>
            </div>
            <div id="place_bet_info" className="pop_up_data">
              <div></div>
              <div>(Amount Available: {tokenBalace})</div>
              <div></div>
            </div>
            <div>
              {/* <!-- if #pop_up_bet > 0, then #confirm_btn add className "on" and remove "off".--> */}
              <img id="confirm_btn" className={(bet > 0) && (bet <= tokenBalace)? "on":"off"} src="./img/confirm_btn.png" onClick={(bet > 0) && (bet <= tokenBalace)? ()=>{handle_game(wallet, router, bet, nftBalance)}:()=>{}}/>
              <img onClick={pop_cancel} src="./img/cancel_btn.png"/>
            </div>
          </div>
        </div>
        <div className="content" id="logoposition">
          <img src="./img/logo.png"/>
        </div>
        <div id="all-data">
            <div id="Aptos" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><img src="./img/move2.png" /* style={{marginTop:"1px"}} *//>Movement-Aptos</div>
            <div id="wallet_address">{address_formatter(wallet?.address)}</div>
          </div>
        <div id="all-title">
          <img src="./img/welcome_title.png"/>
        </div>
        <div id="main-info">
          <div id="MOVEfaucet" style={{display: "flex",alignItems: "center"}}>
            <img id="faucet_btn" src="./img/faucet_btn.png" onClick={handle_faucet}/><img id="aptos" src="./img/need_aptos_txt.png"/>
          </div>
          <div id="medal">
            <div><img src="./img/red_medal.png"/><div id="medal_R">{tokenBalace}</div></div>
          </div>
        </div>
        <div id="main-btn" className="bgsize">
          <div>
            {maxCard?<></>:<div id="needcard_txt"><img src="./img/need_card_txt.png"/></div>}
            <div id="buy_btn" className={maxCard? "off":"on"} onClick={maxCard? ()=>{}:handle_buy}></div>
            <Link href="./inventory"><div id="inventory_btn" className="on" ></div></Link>
            <div id="start_btn" className={maxCard? "on":"off"} onClick={maxCard? pop_alert:()=>{}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home