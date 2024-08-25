//@ts-nocheck
'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useAptosWallet } from '@razorlabs/wallet-kit';
import { AptosSignAndSubmitTransactionInput } from '@aptos-labs/wallet-standard';
import { contract_address } from '../_utils/chain';
import { StoreContext } from '../_components/Provider';


function Home() {
  const {tokenBalace, setTokenBalance} = React.useContext(StoreContext);
  const wallet = useAptosWallet();
  const router = useRouter();

  const handleMessage = async (event:any) => {
    console.log("event",event);
    if (event.origin !== window.location.origin) return;
    if (event.data.messageId !== "gameEnded") return;
    await handle_claim(event.data.result);
    localStorage.removeItem("bet");
  };
  const handle_claim = async (status: string) => {
    // statusCode win->2, draw->1, lose->0
    let statusCode = 0;
    if (status === "draw") {
      statusCode = 1;
    } else if (status === "win") {
      statusCode = 2;
    }

    if (wallet.account === undefined) {
      return;
    }
    const transaction: AptosSignAndSubmitTransactionInput = {
      payload: {
      // All transactions on Aptos are implemented via smart contracts.
      function: `${contract_address}::gameManager::claim_reward`,
      functionArguments: [statusCode],
      },
    };
    let tx = await wallet.signAndSubmitTransaction(transaction).catch (error => {
      console.log("error",error);
      window.alert("Oops, something went wrong.\nPlease make sure you have $MOVE for gas and try again.");
    });

    if (tx == undefined) return
    let bet_number = Number(localStorage.getItem("bet"));
    if(statusCode == 2) {
      setTokenBalance(prev => prev + bet_number);
    }else if(statusCode == 1) {
      setTokenBalance(prev => prev);
    }else if (statusCode == 0) {
      setTokenBalance(prev => prev - bet_number);
    }

    
    router.push('/main');
  }
  React.useEffect(() => {
    
    // read the local storage "bet" if it exists, if not, redirect to main page
    let bet_number = localStorage.getItem("bet");
    if (bet_number == null || wallet.account === undefined) {
      router.push('/main');
    }
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  
  return (
    <div style={{width: "100%", height: "100vh"}}>
    <iframe src="../game/index.html" frameBorder="0" width="100%" height="100%" allowFullScreen></iframe>
  </div>
  )
}

export default Home