import { useState } from "react";
import { ethers } from "ethers";
import CollateralManagerABI from "../abi/CollateralManager.json";

export default function Home() {
  const [provider, setProvider] = useState<ethers.providers.Web3Provider|undefined>();
  const [signer, setSigner] = useState<ethers.Signer|undefined>();
  const [addr, setAddr] = useState<string>("");
  const CM_ADDRESS = process.env.NEXT_PUBLIC_CM_ADDRESS!;

  // Connect MetaMask
  async function connectWallet() {
    if ((window as any).ethereum) {
      const prov = new ethers.providers.Web3Provider((window as any).ethereum);
      await prov.send("eth_requestAccounts", []);
      const signer = prov.getSigner();
      setProvider(prov);
      setSigner(signer);
      setAddr(await signer.getAddress());
    } else {
      alert("MetaMask not found");
    }
  }

  // Mint sUSD
  async function mintSUSD() {
    if (!signer) return;
    const cm = new ethers.Contract(CM_ADDRESS, CollateralManagerABI, signer);
    const amt = ethers.utils.parseUnits("100", 18); // example 100 sUSD
    await cm.mintSUSD(amt);
    alert("Minted 100 sUSD");
  }

  return (
    <div>
      <h1>Mint Synthetic (sUSD)</h1>
      {!addr && <button onClick={connectWallet}>Connect Wallet</button>}
      {addr && (
        <div>
          <p>Connected: {addr}</p>
          <button onClick={() => { /* deposit ETH transaction */ }}>Deposit 1 ETH Collateral</button>
          <button onClick={mintSUSD}>Mint 100 sUSD</button>
        </div>
      )}
    </div>
  );
}
