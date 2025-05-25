import { motion } from 'framer-motion';

export default function PartnersSection() {
  const partners = [
    { name: 'Chainlink', logo: '/images/partners/chainlink.svg' },
    { name: 'Polygon', logo: '/images/partners/polygon.svg' },
    { name: 'Ethereum', logo: '/images/partners/ethereum.svg' },
    { name: 'OpenZeppelin', logo: '/images/partners/openzeppelin.svg' },
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-mx-purple/5 to-mx-cyan/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mx-text mb-4">
            Trusted <span className="gradient-text">Partners</span>
          </h2>
          <p className="text-xl text-mx-text-muted max-w-3xl mx-auto">
            Working with industry leaders to build the future of cross-chain DeFi
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center justify-center p-8 bg-mx-surface/30 rounded-xl hover:bg-mx-surface/50 transition-colors"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="h-12 w-auto opacity-70 hover:opacity-100 transition-opacity"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
