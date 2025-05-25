import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function StatsSection() {
  const [stats, setStats] = useState({
    tvl: 0,
    transactions: 0,
    users: 0,
    volume: 0,
  });

  // Animate numbers on mount
  useEffect(() => {
    const targets = {
      tvl: 2500000,
      transactions: 10000,
      users: 5000,
      volume: 15000000,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setStats({
        tvl: Math.floor(targets.tvl * progress),
        transactions: Math.floor(targets.transactions * progress),
        users: Math.floor(targets.users * progress),
        volume: Math.floor(targets.volume * progress),
      });

      if (step >= steps) {
        clearInterval(timer);
        setStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const statsData = [
    {
      label: 'Total Value Locked',
      value: formatNumber(stats.tvl),
      description: 'Secured in smart contracts',
    },
    {
      label: 'Transactions',
      value: formatNumber(stats.transactions),
      description: 'Cross-chain bridges completed',
    },
    {
      label: 'Active Users',
      value: formatNumber(stats.users),
      description: 'Trusted by the community',
    },
    {
      label: 'Volume Bridged',
      value: formatNumber(stats.volume),
      description: 'Total assets transferred',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-r from-mx-purple/10 to-mx-cyan/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mx-text mb-4">
            Trusted by <span className="gradient-text">Thousands</span>
          </h2>
          <p className="text-xl text-mx-text-muted max-w-3xl mx-auto">
            Join the growing community of users who trust Mini-REAX for their cross-chain DeFi needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {statsData.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-mx-surface/50 backdrop-blur-lg rounded-xl p-8 border border-mx-surface-light">
                <div className="text-4xl sm:text-5xl font-bold gradient-text mb-2">
                  {stat.value}
                </div>
                <div className="text-lg font-semibold text-mx-text mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-mx-text-muted">
                  {stat.description}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
