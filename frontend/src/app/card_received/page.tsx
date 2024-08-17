import React from 'react'
import Link from 'next/link'
import { address_formatter } from '../_utils/helper'

function Home() {
  return (
    <div id="cards_received" className="container-block">
      <div className="content" id="cdr-content">
          <div id="all-data">
            <div id="Aptos" style={{display: 'flex', alignItems: 'center', justifyContent:'center'}}><img src="./img/move2.png"/>Movement-Aptos</div>
            <div id="wallet_address">{address_formatter("wallet?.afdfdfddress")}</div>
          </div>
        <div id="all-title">
          <img src="./img/received_title.png"/>
        </div>
        <div id="cards_drawbox" className="bgsize">
          <div>
            <img src="./img/cards/3.png"/>
            <img src="./img/cards/7.png"/>
            <img src="./img/cards/1.png"/>
            <img src="./img/cards/6.png"/>
            <img src="./img/cards/5.png"/>

            <img src="./img/cards/1.png"/>
            <img src="./img/cards/2.png"/>
            <img src="./img/cards/6.png"/>
            <img src="./img/cards/5.png"/>
            <img src="./img/cards/4.png"/>
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