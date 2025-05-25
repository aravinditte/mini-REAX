import { motion } from 'framer-motion';
import { 
  CubeIcon, 
  BanknotesIcon, 
  ChartBarIcon,
  GlobeAltIcon 
} from '@heroicons/react/24/outline';
import Card from '../ui/Card';

export default function EcosystemSection() {
  const ecosystemApps = [
    {
      icon: CubeIcon,
      title: 'Synthetic Assets',
      description: 'Trade synthetic versions of real-world assets',
      status: 'Live',
      color: 'from-mx-purple to-mx-cyan',
    },
    {
      icon: BanknotesIcon,
      title: 'Cross-Chain Bridge',
      description: 'Seamlessly transfer assets between chains',
      status: 'Live',
      color: 'from-green-400 to-blue-500',
    },
    {
      icon: ChartBarIcon,
      title: 'Analytics Dashboard',
      description: 'Track protocol metrics and performance',
      status: 'Coming Soon',
      color: 'from-orange-400 to-pink-500',
    },
    {
      icon: GlobeAltIcon,
      title: 'Multi-Chain DEX',
      description: 'Decentralized exchange across multiple chains',
      status: 'Coming Soon',
      color: 'from-purple-400 to-indigo-500',
    },
  ];

  return (
    <section className="py-24 bg-mx-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mx-text mb-4">
            Ecosystem <span className="gradient-text">Applications</span>
          </h2>
          <p className="text-xl text-mx-text-muted max-w-3xl mx-auto">
            Explore the growing suite of applications built on Mini-REAX protocol
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ecosystemApps.map((app, index) => (
            <motion.div
              key={app.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card hover className="h-full">
                <div className="text-center">
                  <div className={`w-16 h-16 bg-gradient-to-r ${app.color} rounded-xl flex items-center justify-center mx-auto mb-6`}>
                    <app.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      app.status === 'Live' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-mx-text mb-4">
                    {app.title}
                  </h3>
                  <p className="text-mx-text-muted">
                    {app.description}
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
