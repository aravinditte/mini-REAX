import Head from 'next/head';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import EcosystemSection from '../components/sections/EcosystemSection';
import PartnersSection from '../components/sections/PartnersSection';

export default function Ecosystem() {
  return (
    <>
      <Head>
        <title>Ecosystem - Mini-REAX</title>
        <meta name="description" content="Explore the Mini-REAX ecosystem and our partners" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-mx-dark">
        <Header />
        <main className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-mx-text mb-4">
                Mini-REAX <span className="gradient-text">Ecosystem</span>
              </h1>
              <p className="text-xl text-mx-text-muted max-w-2xl mx-auto">
                Discover the growing ecosystem of applications, partners, and integrations
              </p>
            </div>
          </div>
          <EcosystemSection />
          <PartnersSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
