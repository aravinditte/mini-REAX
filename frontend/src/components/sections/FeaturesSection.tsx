import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  GlobeAltIcon,
  CubeTransparentIcon,
  ArrowPathIcon,
  LockClosedIcon 
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';

export default function FeaturesSection() {
  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Audited',
      description: 'Smart contracts audited by leading security firms. Your assets are protected by battle-tested code.',
    },
    {
      icon: BoltIcon,
      title: 'Lightning Fast',
      description: 'Cross-chain transactions completed in minutes, not hours. Experience the speed of modern DeFi.',
    },
    {
      icon: GlobeAltIcon,
      title: 'Multi-Chain Support',
      description: 'Bridge assets across Ethereum, Polygon, BSC, and more. True interoperability for your DeFi needs.',
    },
    {
      icon: CubeTransparentIcon,
      title: 'Synthetic Assets',
      description: 'Trade synthetic versions of real-world assets. Access global markets from any blockchain.',
    },
    {
      icon: ArrowPathIcon,
      title: 'Automated Relayer',
      description: 'Fully automated cross-chain relaying. No manual intervention required for seamless bridging.',
    },
    {
      icon: LockClosedIcon,
      title: 'Decentralized',
      description: 'No central authority or single point of failure. True decentralization for maximum security.',
    },
  ];

  return (
    <section className="py-24 bg-mx-dark relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mx-text mb-4">
            Why Choose <span className="gradient-text">Mini-REAX</span>?
          </h2>
          <p className="text-xl text-mx-text-muted max-w-3xl mx-auto">
            Built for the future of DeFi with cutting-edge technology and uncompromising security.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hover className="h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-mx-purple to-mx-cyan rounded-xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-mx-text mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-mx-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
