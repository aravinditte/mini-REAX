export interface ContractAddresses {
  sUSD: string;
  bridge: string;
  collateralManager: string;
}

export interface ChainConfig {
  id: number;
  name: string;
  rpcUrl: string;
  contracts: ContractAddresses;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
  logoURI?: string;
}
