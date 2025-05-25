import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

interface TokenSelectorProps {
  value: string;
  onChange: (token: string) => void;
}

export default function TokenSelector({ value, onChange }: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tokens = [
    {
      symbol: 'sUSD',
      name: 'Synthetic USD',
      logo: '/images/susd-logo.svg',
    },
    // Add more tokens as needed
  ];

  const selectedToken = tokens.find(token => token.symbol === value) || tokens[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 bg-mx-surface hover:bg-mx-surface-light rounded-lg px-3 py-2 transition-colors"
      >
        <img src={selectedToken.logo} alt={selectedToken.symbol} className="w-6 h-6" />
        <span className="font-medium text-mx-text">{selectedToken.symbol}</span>
        <ChevronDownIcon className={`w-4 h-4 text-mx-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 bg-mx-surface border border-mx-surface-light rounded-lg shadow-xl z-10 min-w-[200px]"
          >
            {tokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onChange(token.symbol);
                  setIsOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-mx-surface-light transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <img src={token.logo} alt={token.symbol} className="w-8 h-8" />
                <div className="text-left">
                  <div className="font-medium text-mx-text">{token.symbol}</div>
                  <div className="text-sm text-mx-text-muted">{token.name}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
