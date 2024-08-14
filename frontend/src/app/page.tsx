'use client'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { AptosConnectButton, AptosWalletProvider } from '@razorlabs/wallet-kit';
import { useAptosWallet } from '@razorlabs/wallet-kit';
import '@razorlabs/wallet-kit/style.css';
import React from 'react';
export default function Home() {
  let wallet = useAptosWallet();
  const router = useRouter();
  React.useEffect(() => {
    if (wallet.account !== undefined) {
      if(wallet.chain?.id != "aptos:testnet") {
        window.alert("Please connect to the Movement Aptos testnet.");
        wallet.disconnect();
      }else{
        router.push("/main");
      }
    }else{
      if(wallet.connected)
        wallet?.disconnect();
    }
  }
  , [wallet]);
  console.log(wallet);
  return (
    <div id="index" className="container-block bgsize">
      <div className="content" id="logoposition">
        <img src="./img/logo.png"/>
      </div>
      <div className="content" id="index-content">
        <div></div>
        <div></div>
        <div id="cnt_bt">
          {/* <Link href="./main" target="_self"><img src="./img/connect_button.png"/></Link> */}
          <AptosConnectButton><img src="./img/connect_button.png"/></AptosConnectButton>
        </div>
        <div></div>
      </div>
    </div>
  );
}
