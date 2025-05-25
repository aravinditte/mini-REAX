import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Card from '../ui/Card';
import { formatTimeAgo, shortenAddress } from '../../utils/helpers';
import { BridgeTransaction } from '../../types/bridge';

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<BridgeTransaction[]>([]);

  // Mock data - replace with real data from your backend/indexer
  useEffect(() => {
    const mockTransactions: BridgeTransaction[] = [
      {
        id: '1',
        fromChain: 31337,
        toChain: 137,
        token: 'sUSD',
        amount: '100.0',
        sender: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        status: 'completed',
        txHash: '0x1234567890abcdef',
        timestamp: Date.now() - 300000, // 5 minutes ago
      },
      {
        id: '2',
        fromChain: 137,
        toChain: 31337,
        token: 'sUSD',
        amount: '50.0',
        sender: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        recipient: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        status: 'pending',
        timestamp: Date.now() - 120000, // 2 minutes ago
      },
    ];
    setTransactions(mockTransactions);
  }, []);

  const getStatusIcon = (status: BridgeTransaction['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'pending':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: BridgeTransaction['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'pending':
        return 'text-yellow-400';
      case 'failed':
        return 'text-red-400';
    }
  };

  return (
    <Card>
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-mx-text">Recent Transactions</h3>
        
        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <ClockIcon className="w-12 h-12 text-mx-text-muted mx-auto mb-4" />
            <p className="text-mx-text-muted">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, index) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-mx-dark rounded-lg p-4 border border-mx-surface-light"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(tx.status)}
                    <span className={`text-sm font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                  <span className="text-xs text-mx-text-muted">
                    {formatTimeAgo(tx.timestamp)}
                  </span>
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-mx-text-muted">Amount:</span>
                    <span className="text-mx-text font-medium">
                      {tx.amount} {tx.token}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mx-text-muted">From:</span>
                    <span className="text-mx-text">Chain {tx.fromChain}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-mx-text-muted">To:</span>
                    <span className="text-mx-text">Chain {tx.toChain}</span>
                  </div>
                  {tx.txHash && (
                    <div className="flex justify-between">
                      <span className="text-mx-text-muted">Tx Hash:</span>
                      <a
                        href={`#`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-mx-cyan hover:text-mx-cyan-dark"
                      >
                        {shortenAddress(tx.txHash)}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
