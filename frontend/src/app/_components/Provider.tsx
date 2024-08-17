// @ts-nocheck
'use client';
import { AptosWalletProvider } from '@razorlabs/wallet-kit';
import React from 'react';

export const StoreContext = React.createContext({}); 
// Import the CSS for the connectors.
export function Provider({ children }: { children: React.ReactNode }) {
  const [tokenBalace, setTokenBalance] = React.useState(0);
  const [nftBalance, setNftBalance] = React.useState([]);

  return (
    <StoreContext.Provider value={{ tokenBalace, setTokenBalance, nftBalance, setNftBalance }}>
      <AptosWalletProvider autoConnect={true}>
        {children}
      </AptosWalletProvider>
    </StoreContext.Provider>
  );
}