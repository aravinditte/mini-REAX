import { useAccount, useBalance, useNetwork } from 'wagmi';

export function useWallet() {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: balance } = useBalance({
    address,
    token: process.env.NEXT_PUBLIC_SUSD_ADDRESS as `0x${string}`,
  });

  return {
    address,
    isConnected,
    chain,
    balance: balance?.formatted || '0',
    symbol: balance?.symbol || 'sUSD',
  };
}
