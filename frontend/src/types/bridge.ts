export interface BridgeTransaction {
  id: string;
  fromChain: number;
  toChain: number;
  token: string;
  amount: string;
  sender: string;
  recipient: string;
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  timestamp: number;
}

export interface BridgeState {
  fromChain: number;
  toChain: number;
  token: string;
  amount: string;
  recipient: string;
  isLoading: boolean;
  error: string | null;
}
