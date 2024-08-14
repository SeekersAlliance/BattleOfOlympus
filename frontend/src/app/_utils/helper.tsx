export const address_formatter = (address: string | undefined) => {
  if (address === undefined) return "Connect Wallet";
  return address.slice(0, 5) + "..." + address.slice(-4);
}

export const nft_balance_formatter = (balance: string): number[] => {
  /* turn 0x0103040506 -> [1,3,4,5,6] */
  let res: number[] = []
  for (let i = 2; i < balance.length; i += 2) {
    res.push(parseInt(balance.slice(i, i + 2), 16))
  }
  return res
}

