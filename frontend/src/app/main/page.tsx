'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAptosWallet } from '@razorlabs/wallet-kit';
import { address_formatter} from '../_utils/helper'
import { get_token_balance, get_nft_balance } from '../_utils/chain';
import { get } from 'http';

const Home = () => {
  const wallet = useAptosWallet();
  const router = useRouter();
  const [popup, setPopup] = React.useState(false)
  const [valid, setValid] = React.useState(false)
  const [balance, setBalance] = React.useState(0)
  const [cardNum, setCardNum] = React.useState(0)

  React.useEffect(() => {
    const _get_token_balance = async () => {
      let balance = await get_token_balance(wallet?.address);
      setBalance(balance);
    }
    const _get_nft_balance = async () => {
      let nft_balance = await get_nft_balance(wallet?.address);
      setCardNum(nft_balance.length)
    }
    if (wallet.account === undefined) {
      wallet.disconnect();
      router.push("/")
    }else{
      _get_token_balance()
      _get_nft_balance()
    }
  }
  , [wallet]);
  React.useEffect(() => {
    if (cardNum >= 50) {
      setValid(true)
    } else {
      setValid(false)
    }
  }, [cardNum])


  const pop_cancel = () => {
      setPopup(false)
  }
  const pop_alert = () => {
      setPopup(true)
  }
  const handle_faucet = () => {
    window.open("https://faucet.movementlabs.xyz/?network=aptos", "_blank");
  }
  return (
    <div id="main" className="container-block">
      <div className="content" id="main-content">
        <div id="pop_up_box" className={`content ${popup?"up":"noup"}`}>
          <div id="pop_up">
            <div><img src="./img/bet_title.png"/></div>
            <div id="pop_up_data">
              <div>I want to bet</div>
              <div><input id="pop_up_bet" type="number"/></div>
              <div><img src="./img/red_medal.png"/></div>
            </div>
            <div>
              {/* <!-- if #pop_up_bet > 0, then #confirm_btn add className "on" and remove "off".--> */}
              <img id="confirm_btn" className="off" src="./img/confirm_btn.png"/>
              <img onClick={pop_cancel} src="./img/cancel_btn.png"/>
            </div>
          </div>
        </div>
        <div className="content" id="logoposition">
          <img src="./img/logo.png"/>
        </div>
        <div id="all-data">
          <div
          style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
          >
            <img src="./img/move2.png"/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>Movement-Aptos</div>
          </div>
          <div id="wallet_address" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{address_formatter(wallet?.address)}</div>
        </div>
        <div id="all-title">
          <img src="./img/welcome_title.png"/>
        </div>
        <div id="main-info">
          <div id="MOVEfaucet">
            <img id="faucet_btn" src="./img/faucet_btn.png" onClick={handle_faucet}/><img id="aptos" src="./img/need_aptos_txt.png"/>
          </div>
          <div id="medal">
            <div><img src="./img/red_medal.png"/><div id="medal_R">{balance}</div></div>
          </div>
        </div>
        <div id="main-btn" className="bgsize">
          <div>
            {valid?<></>:<div id="needcard_txt"><img src="./img/need_card_txt.png"/></div>}
            <Link href="./anime"><div id="buy_btn" className={valid? "off":"on"}></div></Link>
            <div id="inventory_btn" className={valid? "on":"off"}></div>
            <div id="start_btn" className={valid? "on":"off"} onClick={valid? pop_alert:()=>{}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home