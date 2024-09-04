// @ts-nocheck
'use client';
import { AptosWalletProvider, AllDefaultWallets } from '@razorlabs/wallet-kit';
import React from 'react';

type Props = {
  tokenBalace: number;
  setTokenBalance: (value: number) => void;
  nftBalance: number[];
  setNftBalance: (value: number[]) => void;
  drawTx: string;
  setDrawTx: (value: string) => void;
};
export const StoreContext = React.createContext<Props>({} as Props);
// Import the CSS for the connectors.
export function Provider({ children }: { children: React.ReactNode }) {
  const [tokenBalace, setTokenBalance] = React.useState(0);
  const [nftBalance, setNftBalance] = React.useState([]);
  const [drawTx, setDrawTx] = React.useState("");
  return (
    <StoreContext.Provider value={{ tokenBalace, setTokenBalance, nftBalance, setNftBalance, drawTx, setDrawTx }}>
      <AptosWalletProvider autoConnect={false} defaultWallets={AllDefaultWallets.filter(wallet => wallet.name == "Razor Wallet")}>
        {children}
      </AptosWalletProvider>
    </StoreContext.Provider>
  );
}