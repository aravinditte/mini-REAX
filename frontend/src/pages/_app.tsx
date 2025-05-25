import '@/styles/globals.css';
import '@/styles/components.css';
import type { AppProps } from 'next/app';
import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { RainbowKitProvider, darkTheme, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { mainnet, polygon, localhost } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient } = configureChains(
  [localhost, mainnet, polygon],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Mini-REAX',
  projectId: 'your-project-id', // Get from WalletConnect
  chains,
});

const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <RainbowKitProvider 
        chains={chains} 
        theme={darkTheme({
          accentColor: '#6366f1',
          accentColorForeground: 'white',
          borderRadius: 'medium',
          fontStack: 'system',
          overlayBlur: 'small',
        })}
      >
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
