import { useState } from "react";
import { ethers } from "ethers";
import BridgeEthABI from "../abi/BridgeETH.json";

export default function Bridge() {
  const [signer, setSigner] = useState<ethers.Signer|undefined>();
  const [chainId, setChainId] = useState<number>(0);
  const BRIDGE_ETH_ADDRESS = process.env.NEXT_PUBLIC_BRIDGE_ETH_ADDRESS!;

  async function connect() {
    if ((window as any).ethereum) {
      const prov = new ethers.providers.Web3Provider((window as any).ethereum);
      await prov.send("eth_requestAccounts", []);
      setSigner(prov.getSigner());
      const network = await prov.getNetwork();
      setChainId(network.chainId);
    }
  }

  async function bridge() {
    if (!signer) return;
    const bridge = new ethers.Contract(BRIDGE_ETH_ADDRESS, BridgeEthABI, signer);
    const amount = ethers.utils.parseUnits("50", 18);
    await bridge.bridgeToPolygon(process.env.NEXT_PUBLIC_TOKEN_ADDRESS!, amount);
    alert("Bridge transaction sent");
  }

  return (
    <div>
      <h1>Bridge Synth to Polygon</h1>
      {!signer && <button onClick={connect}>Connect Wallet</button>}
      {signer && chainId === 5 && (  // ensure Goerli
        <button onClick={bridge}>Bridge 50 Tokens</button>
      )}
      {chainId !== 5 && <p>Switch to Goerli network.</p>}
    </div>
  );
}
