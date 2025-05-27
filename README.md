# Mini-REAX

Mini-REAX is a cross-chain decentralized finance (DeFi) protocol enabling secure, fast, and decentralized synthetic asset trading across multiple blockchains. This project includes a smart contract backend, a Rust-based relayer for cross-chain event monitoring and bridging, and a modern Next.js frontend inspired by MultiversX.


## 🚀 Features

- **Cross-Chain Bridge**: Seamlessly transfer synthetic assets between blockchains
- **Synthetic Assets**: Trade synthetic versions of real-world assets (sUSD)
- **Automated Relayer**: Rust-based relayer for automatic cross-chain transaction processing
- **Modern UI**: MultiversX-inspired frontend with Web3 wallet integration
- **Multi-Chain Support**: Ethereum, Polygon, and local development networks

## 📋 Prerequisites

- **Node.js** v16 or later
- **Rust** toolchain (for relayer)
- **Git**
- **MetaMask** or compatible Web3 wallet

## 🔧 Backend Setup

### 1. Install Dependencies
cd backend
npm install


### 2. Create Environment File
Create `backend/.env`:


### 3. Start Local Blockchain
npx hardhat node
Keep this terminal running. You'll see 20 demo accounts with 10,000 ETH each.

### 4. Deploy Contracts (New Terminal)

xyz