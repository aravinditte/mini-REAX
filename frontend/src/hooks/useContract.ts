import { useContract, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { BRIDGE_ABI, SUSD_ABI } from '../utils/contracts';

export function useBridgeContract() {
  const { config } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_BRIDGE_ADDRESS as `0x${string}`,
    abi: BRIDGE_ABI,
    functionName: 'bridgeTokens',
  });

  const { write: bridgeTokens, isLoading } = useContractWrite(config);

  return {
    bridgeTokens,
    isLoading,
  };
}

export function useTokenContract() {
  const { config: approveConfig } = usePrepareContractWrite({
    address: process.env.NEXT_PUBLIC_SUSD_ADDRESS as `0x${string}`,
    abi: SUSD_ABI,
    functionName: 'approve',
  });

  const { write: approve } = useContractWrite(approveConfig);

  return {
    approve,
  };
}
