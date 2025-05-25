import { useState } from 'react';
import { useAccount } from 'wagmi';
import { useBridgeContract, useTokenContract } from './useContract';
import { parseTokenAmount } from '../utils/helpers';

export function useBridge() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address } = useAccount();
  const { bridgeTokens } = useBridgeContract();
  const { approve } = useTokenContract();

  const bridge = async (amount: string, targetChainId: number) => {
    if (!address || !bridgeTokens || !approve) {
      setError('Wallet not connected or contracts not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First approve the bridge contract
      const parsedAmount = parseTokenAmount(amount);
      await approve({
        args: [process.env.NEXT_PUBLIC_BRIDGE_ADDRESS, parsedAmount]
      });

      // Then bridge the tokens
      await bridgeTokens({
        args: [parsedAmount, BigInt(targetChainId)]
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bridge transaction failed');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    bridge,
    isLoading,
    error,
  };
}
