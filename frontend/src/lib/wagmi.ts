import { configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { mainnet, polygon, localhost } from 'wagmi/chains';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';

const { chains, publicClient } = configureChains(
  [localhost, mainnet, polygon],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Mini-REAX',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || '',
  chains,
});

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export { chains };
