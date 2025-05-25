import { formatUnits, parseUnits } from "ethers";

// Format a token amount based on custom decimals
export const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  try {
    return formatUnits(amount, decimals);
  } catch {
    return '0';
  }
};

// Parse a human-readable token amount into a BigInt
export const parseTokenAmount = (amount: string, decimals: number = 18): bigint => {
  try {
    return parseUnits(amount, decimals);
  } catch {
    return BigInt(0);
  }
};

// Shorten an Ethereum address (e.g., 0x1234...abcd)
export const shortenAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format a timestamp into "x ago" format
export const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return 'Just now';
};
