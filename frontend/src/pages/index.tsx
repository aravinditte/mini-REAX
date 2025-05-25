import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import StatsSection from '../components/sections/StatsSection';

export default function Home() {
  return (
    <>
      <Head>
        <title>Mini-REAX - Cross-Chain DeFi Protocol</title>
        <meta name="description" content="Secure, fast, and decentralized synthetic asset trading across multiple blockchains" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-mx-dark">
        <Header />
        <main>
          <HeroSection />
          <StatsSection />
          <FeaturesSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
