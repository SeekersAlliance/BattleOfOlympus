// @ts-nocheck
'use client'
import React from 'react'
import Link from 'next/link'
import { address_formatter } from '../_utils/helper'
import { useAptosWallet } from '@razorlabs/wallet-kit';
import { StoreContext } from '../_components/Provider';
import { get_transaction_details } from '../_utils/chain';
import { useRouter } from 'next/navigation';
import { contract_address } from '../_utils/chain';
import { AptosSignAndSubmitTransactionInput } from '@aptos-labs/wallet-standard';
import { nft_balance_formatter } from '../_utils/helper';
function Home() {
  const wallet = useAptosWallet();
  const router = useRouter();
  const { drawTx, setNftBalance, nftBalance } = React.useContext(StoreContext);
  const [drawNfts, setDrawNfts] = React.useState([]);
  const [isLoaded, setIsLoaded] = React.useState(false);
  React.useEffect(() => {
    const _get_draw_cards = async () => {
      let detail = await get_transaction_details(drawTx)
      let draw_cards_event = detail.events.filter((event) => event.type == `${contract_address}::market::PurchaseEvent`)[0]
      let draw_cards = nft_balance_formatter(draw_cards_event.data.ids)
      setDrawNfts(draw_cards)
      setNftBalance([...nftBalance, ...draw_cards])
      setIsLoaded(true)
    }
    if (drawTx !== "") {
      _get_draw_cards()
    }else{
      router.push("/main")
    }
  }, []);
  return (
    <div id="cards_received" className="container-block">
      <div className="content" id="cdr-content">
          <div id="all-data">
            <div id="Aptos" style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}><img src="./img/move2.png"/>Movement-Aptos</div>
            <div id="wallet_address">{address_formatter(wallet?.address)}</div>
          </div>
        <div id="all-title">
          <img src="./img/received_title.png"/>
        </div>
        <div id="cards_drawbox" className="bgsize">
          <div>
            {isLoaded?drawNfts.map((nft, index) => (
              <img key={index} src={`./img/cards/${nft}.png`}/>
            )):<div style={{marginTop:"130px", fontSize:"30px"}}>Loading...</div>}
          </div>
        </div>
        <div className="buttons">
          {/* <!--  if have 50 cards, #buymore_btn add className "off", and remove "on" : --> */}
          <Link href="./main"><div id="buymore_btn" className="on"></div></Link>
          <Link href="./inventory"><div id="see_inventory_btn" className="on" /* onClick={()=>{}"goInventory()"} */></div></Link>
        </div>
      </div>
    </div>
  )
}

export default Home