import { ethers } from 'ethers';

export const getProvider = (rpcUrl: string) => {
  return new ethers.JsonRpcProvider(rpcUrl);
};

export const getContract = (
  address: string,
  abi: any[],
  signerOrProvider: ethers.Signer | ethers.Provider
) => {
  return new ethers.Contract(address, abi, signerOrProvider);
};

export const formatUnits = ethers.formatUnits;
export const parseUnits = ethers.parseUnits;
export const formatEther = ethers.formatEther;
export const parseEther = ethers.parseEther;
