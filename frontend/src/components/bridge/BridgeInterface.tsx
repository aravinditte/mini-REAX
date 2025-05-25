import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowsUpDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Card from '../ui/Card';
import TokenSelector from './TokenSelector';
import ChainSelector from './ChainSelector';
import { useWallet } from '../../hooks/useWallet';
import { useBridge } from '../../hooks/useBridge';

export default function BridgeInterface() {
  const [amount, setAmount] = useState('');
  const [fromChain, setFromChain] = useState(31337);
  const [toChain, setToChain] = useState(31337);
  const [selectedToken, setSelectedToken] = useState('sUSD');

  const { balance, isConnected } = useWallet();
  const { bridge, isLoading, error } = useBridge();

  const handleMaxClick = () => {
    setAmount(balance);
  };

  const handleBridge = async () => {
    if (!amount || !isConnected) return;
    await bridge(amount, toChain);
  };

  const isValidAmount = amount && parseFloat(amount) > 0 && parseFloat(amount) <= parseFloat(balance);

  return (
    <div className="max-w-md mx-auto">
      <Card className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-mx-text mb-2">Bridge Assets</h2>
          <p className="text-mx-text-muted">Transfer tokens across chains securely</p>
        </div>

        {/* From Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium text-mx-text">From</label>
            <span className="text-sm text-mx-text-muted">
              Balance: {balance} {selectedToken}
            </span>
          </div>
          
          <div className="bg-mx-dark rounded-lg p-4 space-y-3">
            <ChainSelector value={fromChain} onChange={setFromChain} />
            <div className="flex space-x-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.0"
                  className="w-full bg-transparent text-2xl font-semibold text-mx-text placeholder-mx-text-muted focus:outline-none"
                />
              </div>
              <div className="flex flex-col items-end space-y-2">
                <TokenSelector value={selectedToken} onChange={setSelectedToken} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMaxClick}
                  className="text-xs"
                >
                  MAX
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Swap Icon */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
            className="p-2 bg-mx-surface border border-mx-surface-light rounded-lg hover:bg-mx-surface-light transition-colors"
            onClick={() => {
              setFromChain(toChain);
              setToChain(fromChain);
            }}
          >
            <ArrowsUpDownIcon className="w-5 h-5 text-mx-text-muted" />
          </motion.button>
        </div>

        {/* To Section */}
        <div className="space-y-4">
          <label className="text-sm font-medium text-mx-text">To</label>
          <div className="bg-mx-dark rounded-lg p-4">
            <ChainSelector value={toChain} onChange={setToChain} />
            <div className="mt-3 flex justify-between items-center">
              <span className="text-2xl font-semibold text-mx-text">
                {amount || '0.0'}
              </span>
              <span className="text-mx-text-muted">{selectedToken}</span>
            </div>
          </div>
        </div>

        {/* Bridge Info */}
        <div className="bg-mx-purple/10 border border-mx-purple/20 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <InformationCircleIcon className="w-5 h-5 text-mx-cyan mt-0.5 flex-shrink-0" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-mx-text-muted">Bridge Fee:</span>
                <span className="text-mx-text">0.1%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mx-text-muted">Estimated Time:</span>
                <span className="text-mx-text">~2 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mx-text-muted">You will receive:</span>
                <span className="text-mx-text font-medium">
                  {amount ? (parseFloat(amount) * 0.999).toFixed(6) : '0.0'} {selectedToken}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Bridge Button */}
        <Button
          onClick={handleBridge}
          disabled={!isConnected || !isValidAmount || isLoading}
          isLoading={isLoading}
          className="w-full"
          size="lg"
        >
          {!isConnected 
            ? 'Connect Wallet' 
            : !isValidAmount 
            ? 'Enter Valid Amount' 
            : 'Bridge Assets'
          }
        </Button>
      </Card>
    </div>
  );
}
