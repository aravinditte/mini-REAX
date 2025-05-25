import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import BridgeInterface from '../components/bridge/BridgeInterface';
import TransactionHistory from '../components/bridge/TransactionHistory';

export default function Bridge() {
  return (
    <>
      <Head>
        <title>Bridge - Mini-REAX</title>
        <meta name="description" content="Bridge your assets across multiple blockchains securely with Mini-REAX" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-mx-dark">
        <Header />
        <main className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-mx-text mb-4">
                Cross-Chain <span className="gradient-text">Bridge</span>
              </h1>
              <p className="text-xl text-mx-text-muted max-w-2xl mx-auto">
                Transfer your synthetic assets seamlessly across different blockchains
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <BridgeInterface />
              </div>
              <div className="lg:col-span-1">
                <TransactionHistory />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
