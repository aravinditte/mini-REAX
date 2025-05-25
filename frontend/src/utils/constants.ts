export const SUPPORTED_CHAINS = {
  31337: {
    id: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    contracts: {
      sUSD: process.env.NEXT_PUBLIC_SUSD_ADDRESS || '',
      bridge: process.env.NEXT_PUBLIC_BRIDGE_ADDRESS || '',
      collateralManager: '',
    }
  }
};

export const TOKENS = {
  sUSD: {
    address: process.env.NEXT_PUBLIC_SUSD_ADDRESS || '',
    symbol: 'sUSD',
    name: 'Synthetic USD',
    decimals: 18,
    logoURI: '/images/susd-logo.svg'
  }
};

export const BRIDGE_CONFIG = {
  maxAmount: '1000000',
  minAmount: '0.01',
  fee: '0.001', // 0.1%
};
