//@ts-nocheck
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAptosWallet } from '@razorlabs/wallet-kit';
import { address_formatter} from '../_utils/helper'
import { get_token_balance, get_nft_balance } from '../_utils/chain';
import { StoreContext } from '../_components/Provider';

const Home = () => {
  const {tokenBalace, setTokenBalance, nftBalance, setNftBalance} = React.useContext(StoreContext);
  const wallet = useAptosWallet();
  const router = useRouter();
  const [bet, setBet] = React.useState(0)
  const [popup, setPopup] = React.useState(false)
  const [maxCard, setMaxCard] = React.useState(false)
  const [balance, setBalance] = React.useState(0)

  React.useEffect(() => {
    const _get_token_balance = async () => {
      let balance = await get_token_balance(wallet?.address);
      setTokenBalance(balance);
    }
    const _get_nft_balance = async () => {
      let nft_balance = await get_nft_balance(wallet?.address);
      /* setNftBalance(nft_balance); */
      setNftBalance([1,3,4,5,6,7,1,1,1,6,7,1,1,1,3,4,5,6,7,1,1,1,3,4,5,6,7,1,1,1,3,4,5,6,4,5,6,7,1,1,1,3,4,5,6,7,1,1,1,3])
    }
    if (wallet.connected && wallet.account !== undefined) {
      _get_token_balance()
      _get_nft_balance()
    }else {
      router.push("/")
    }
  }
  , []);
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
  const handle_faucet = () => {
    window.open("https://faucet.movementlabs.xyz/?network=aptos", "_blank");
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
            <div>
              {/* <!-- if #pop_up_bet > 0, then #confirm_btn add className "on" and remove "off".--> */}
              <img id="confirm_btn" className={(bet > 0) && (bet <= tokenBalace)? "on":"off"} src="./img/confirm_btn.png"/>
              <img onClick={pop_cancel} src="./img/cancel_btn.png"/>
            </div>
          </div>
        </div>
        <div className="content" id="logoposition">
          <img src="./img/logo.png"/>
        </div>
        <div id="all-data">
            <div id="Aptos" style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}><img src="./img/move2.png"/>Movement-Aptos</div>
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
            <Link href="./anime"><div id="buy_btn" className={maxCard? "off":"on"}></div></Link>
            <Link href="./inventory"><div id="inventory_btn" className="on" ></div></Link>
            <div id="start_btn" className={maxCard? "on":"off"} onClick={maxCard? pop_alert:()=>{}}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home