'use client'
import Link from 'next/link'
import { useRouter } from "next/navigation";
import { AptosConnectButton, AptosWalletProvider } from '@razorlabs/wallet-kit';
import { useAptosWallet } from '@razorlabs/wallet-kit';
import { StoreContext } from './_components/Provider';
import { get_token_balance, get_nft_balance } from './_utils/chain';
import '@razorlabs/wallet-kit/style.css';
import React from 'react';

export default function Home() {
  const {tokenBalace, setTokenBalance, nftBalance, setNftBalance} = React.useContext(StoreContext);
  const [showButton, setShowButton] = React.useState(true);
  const [connectWallet, setConnectWallet] = React.useState('');
  let wallet = useAptosWallet();
  const router = useRouter();
  React.useEffect(() => {
    if (wallet.connected && wallet.account !== undefined) {
      _get_token_balance()
      _get_nft_balance()
    }else {
      router.push("/")
    }
  }
  , []);
  React.useEffect(() => {
    if (wallet.account !== undefined) {
      console.log("wallet",wallet);
      console.log("wallet.account",connectWallet);
      if(connectWallet != "Nightly" && wallet.chain?.id != "aptos:testnet") {
        window.alert("Please connect to the Movement Aptos testnet.");
        wallet.disconnect();
      }else{
        _get_nft_balance();
        _get_token_balance();
        router.push("/main");
      }
    }else{
      if(wallet.connected){
        wallet?.disconnect();
        setShowButton(true);
      }
    }
  }
  , [wallet]);

  const _get_token_balance = async () => {
    let balance = await get_token_balance(wallet?.address);
    setTokenBalance(balance);
    
  }
  const _get_nft_balance = async () => {
    let nft_balance = await get_nft_balance(wallet?.address);
    setNftBalance(nft_balance);
  }
  return (
    <div id="index" className="container-block bgsize">
      <div className="content" id="logoposition">
        <img src="./img/logo.png"/>
      </div>
      <div className="content" id="index-content">
        <div></div>
        <div></div>
        <div id="cnt_bt" style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
          <div style={{width:"60%"}}>
            {/* <Link href="./main" target="_self"><img src="./img/connect_button.png"/></Link> */}
            <AptosConnectButton style={{display:showButton?"":"none", width: '100%'}} onConnectSuccess={(name)=>{setShowButton(false);setConnectWallet(prev=>name)}}><img src="./img/connect_button.png"/></AptosConnectButton>
          </div>
        </div>
        <div></div>
      </div>
    </div>
  );
}
