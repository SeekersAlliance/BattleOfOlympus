//@ts-nocheck
'use client'
import React from 'react'
import {useRouter } from 'next/navigation'
import { get_transaction_details } from '../_utils/chain'
import { contract_address } from '../_utils/chain'
import { nft_balance_formatter } from '../_utils/helper'
import { StoreContext } from '../_components/Provider'

function Home() {
  const router = useRouter()
  const { drawTx, setNftBalance, nftBalance } = React.useContext(StoreContext);


  React.useEffect(() => {
    const _get_draw_cards = async () => {
      let detail = await get_transaction_details(drawTx)
      let draw_cards_event = detail.events.filter((event) => event.type == `${contract_address}::market::PurchaseEvent`)[0]
      let draw_cards = nft_balance_formatter(draw_cards_event.data.ids)
      setNftBalance([...nftBalance, ...draw_cards])
    }
    if (drawTx !== "") {
      _get_draw_cards()
    }else{
      router.push("/main")
    }
  }, []);
  return (
    <div id="anime" className="container-block bgsize">
    <div className="content" id="anime-content">
      <video id="drawcards_mp4" autoPlay muted onEnded={()=>{router.push("/inventory")}}>
        <source src='./img/reveal.mp4' type='video/mp4' />
      </video>
    </div>
  </div>
  )
}

export default Home