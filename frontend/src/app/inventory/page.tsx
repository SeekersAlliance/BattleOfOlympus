//@ts-nocheck
'use client'
import React from 'react'
import Link from 'next/link';
import { useAptosWallet } from '@razorlabs/wallet-kit';
import { address_formatter} from '../_utils/helper'
import { StoreContext } from '../_components/Provider';
import { useRouter } from 'next/navigation'
import { AptosSignAndSubmitTransactionInput } from '@aptos-labs/wallet-standard';
import { contract_address } from '../_utils/chain';
import { handle_game } from '../_utils/chain';

function Home() {
  const router = useRouter()
  const wallet = useAptosWallet()
  const [bet, setBet] = React.useState(0)
  const [popupBurn, setPopupBurn] = React.useState(false)
  const [popupBattle, setPopupBattle] = React.useState(false)
  const [maxCard, setMaxCard] = React.useState(false)
  const {tokenBalace, setTokenBalance, nftBalance, setNftBalance} = React.useContext(StoreContext);
  React.useEffect(() => {
    if (wallet.connected && wallet.account !== undefined) {
    }else {
      router.push("/")
    }
  }
  , []);

  React.useEffect(() => {
    setMaxCard(nftBalance.length >= 50)
  }
  , [nftBalance]);

  const pop_burn_cancel = () => {
    setPopupBurn(false)
  }
  const pop_burn_alert = () => {
    setPopupBurn(true)
  }
  const pop_battle_cancel = () => {
    setPopupBattle(false)
  }
  const pop_battle_alert = () => {
    setPopupBattle(true)
  }
  const handle_burn = async () => {
    if (wallet.account === undefined) {
      return;
    }
    const transaction: AptosSignAndSubmitTransactionInput = {
      payload: {
      // All transactions on Aptos are implemented via smart contracts.
      function: `${contract_address}::nft::burn_all`,
      functionArguments: [],
      },
    };
    let tx = await wallet.signAndSubmitTransaction(transaction).catch (error => {
      console.log("error",error);
      window.alert("Oops, something went wrong.\nPlease make sure you have APT for gas and try again.");
    });
    setNftBalance(prev => [])
    setPopupBurn(false)
  }
  return (
    <div id="inventory" className="container-block">
      <div className="content" id="ivt-content">
        <div id="warning_pop_box" className={`pop_up_box content ${popupBurn?"up":"noup"}`}>
          <div id="warning_pop" className="pop_up bgsize">
            <div></div>
            <div className="buttons">
              <img className="on" onClick={handle_burn} src="./img/yes_btn.png"/>
              <img className="on" onClick={pop_burn_cancel} src="./img/no_btn.png"/>
            </div>
          </div>
        </div>
        <div id="place_bet_box" className={`pop_up_box content ${popupBattle?"up":"noup"}`}>
          <div id="place_bet" className="pop_up">
            <div><img src="./img/bet_title.png"/></div>
            <div className="pop_up_data">
              <div>I want to bet</div>
              <div><input id="pop_up_bet" style={{color:"black", paddingLeft:"10px"}} type="number" value={bet} onChange={(e) => setBet(e.target.value)}/></div>
              <div><img src="./img/red_medal.png"/></div>
            </div>
            <div className="buttons">
              {/* <!-- if #pop_up_bet > 0, then #confirm_btn add className "on" and remove "off".--> */}
              <img id="confirm_btn" className={(bet > 0) && (bet <= tokenBalace)? "on":"off"} src="./img/confirm_btn.png" onClick={(bet > 0) && (bet <= tokenBalace)?()=>{handle_game(wallet, router, bet, nftBalance)}:()=>{}}/>
              <img onClick={pop_battle_cancel} src="./img/cancel_btn.png"/>
            </div>
          </div>
        </div>
        <div id="all-data">
          <div id="logoposition">
            <a href="./main" target="_self"><img src="./img/logo.png"/></a>
          </div>
          <div id="Aptos" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><img src="./img/move2.png"/>Movement-Aptos</div>
          <div id="wallet_address">{address_formatter(wallet?.address)}</div>
        </div>
        <div id="all-title">
          <img id="inventoryTtl" src="./img/inventory_title.png"/>
          <div id="inventory-info">
            <div id="burn_btn" onClick={pop_burn_alert}><img src="./img/burn_btn.png"/></div>
            <div id="needcardtxt"><img src="./img/need_card_txt.png"/></div>
          </div>
          </div>
        <div id="inventory_drawbox" className="bgsize">
          <div>
            {nftBalance.sort().map((nft, index) => {
              return <img key={index} src={`./img/cards/${nft}.png`} />
            })}
          </div>
        </div>
        <div className="buttons">
          {/* <!--  if have 50 cards, #buymore_btn add className "off", remove "on", and remove onclick event : --> */}
          <Link href="./main"><div id="buymore_btn" className="on" onClick={()=>{}}></div></Link>
          {/* <!--  if player can start play, #start_btn add className "on", remove "off", and add onclick event "place_alert()" : --> */}
          <div id="start_btn" className={maxCard? "on":"off"} onClick={maxCard? pop_battle_alert:()=>{}}></div>
        </div>
      </div>
    </div>
  )
}

export default Home