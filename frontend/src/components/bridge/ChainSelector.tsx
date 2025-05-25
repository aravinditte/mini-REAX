import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface ChainSelectorProps {
  value: number;
  onChange: (chainId: number) => void;
}

export default function ChainSelector({ value, onChange }: ChainSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const chains = [
    {
      id: 31337,
      name: 'Localhost',
      logo: '/images/ethereum-logo.svg',
    },
    {
      id: 1,
      name: 'Ethereum',
      logo: '/images/ethereum-logo.svg',
    },
    {
      id: 137,
      name: 'Polygon',
      logo: '/images/polygon-logo.svg',
    },
  ];

  const selectedChain = chains.find(chain => chain.id === value) || chains[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 bg-mx-surface hover:bg-mx-surface-light rounded-lg px-4 py-3 transition-colors w-full"
      >
        <img src={selectedChain.logo} alt={selectedChain.name} className="w-6 h-6" />
        <span className="font-medium text-mx-text flex-1 text-left">{selectedChain.name}</span>
        <ChevronDownIcon className={`w-4 h-4 text-mx-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 left-0 right-0 bg-mx-surface border border-mx-surface-light rounded-lg shadow-xl z-10"
          >
            {chains.map((chain) => (
              <button
                key={chain.id}
                onClick={() => {
                  onChange(chain.id);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-mx-surface-light transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <img src={chain.logo} alt={chain.name} className="w-6 h-6" />
                <span className="font-medium text-mx-text">{chain.name}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
