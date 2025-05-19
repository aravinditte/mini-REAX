import { ethers } from "ethers";
import BridgeEthJSON from "./artifacts/contracts/BridgeETH.sol/BridgeETH.json";
import BridgePolygonJSON from "./artifacts/contracts/BridgePolygon.sol/BridgePolygon.json";

// Environment variables (RPC URLs, private key, addresses)
const GOERLI_RPC = process.env.GOERLI_RPC_URL!;
const MUMBAI_RPC = process.env.MUMBAI_RPC_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!; // for Polygon signer
const BRIDGE_ETH_ADDRESS = process.env.BRIDGE_ETH_ADDRESS!;
const BRIDGE_POLY_ADDRESS = process.env.BRIDGE_POLY_ADDRESS!;

async function main() {
    // Set up providers
    const providerEth = new ethers.providers.JsonRpcProvider(GOERLI_RPC);
    const providerPoly = new ethers.providers.JsonRpcProvider(MUMBAI_RPC);
    const walletPoly = new ethers.Wallet(PRIVATE_KEY, providerPoly);

    // Instantiate contracts
    const bridgeEth = new ethers.Contract(BRIDGE_ETH_ADDRESS, BridgeEthJSON.abi, providerEth);
    const bridgePoly = new ethers.Contract(BRIDGE_POLY_ADDRESS, BridgePolygonJSON.abi, walletPoly);

    console.log("Relayer is listening for BridgeETH events...");

    // Listen for SynthBridged events on Ethereum
    bridgeEth.on("SynthBridged", async (user, token, amount, destChain, event) => {
        console.log(`Bridging event: user=${user}, token=${token}, amount=${amount}, destChain=${destChain}`);
        if (destChain.toNumber() === 80001) {
            // Call Polygon bridge to mint
            try {
                const tx = await bridgePoly.mintBridgedSynth(user, token, amount);
                await tx.wait();
                console.log(`Minted ${amount} of ${token} to ${user} on Polygon`);
            } catch (err) {
                console.error("Failed to mint on Polygon:", err);
            }
        }
    });
}

main().catch(console.error);
