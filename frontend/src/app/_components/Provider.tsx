// @ts-nocheck
'use client';
import { AptosWalletProvider } from '@razorlabs/wallet-kit';


 
// Import the CSS for the connectors.
export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <AptosWalletProvider autoConnect={false}>
      {children}
    </AptosWalletProvider>
  );
}