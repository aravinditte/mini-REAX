import { useState } from "react";
import { ethers } from "ethers";
import AMMPoolABI from "../abi/AMMPool.json";

export default function Trade() {
  const [signer, setSigner] = useState<ethers.Signer|undefined>();
  const POOL_ADDRESS = process.env.NEXT_PUBLIC_AMM_ADDRESS!;
  
  async function connect() {
    if ((window as any).ethereum) {
      const prov = new ethers.providers.Web3Provider((window as any).ethereum);
      await prov.send("eth_requestAccounts", []);
      setSigner(prov.getSigner());
    }
  }

  async function swap() {
    if (!signer) return;
    const pool = new ethers.Contract(POOL_ADDRESS, AMMPoolABI, signer);
    const amountIn = ethers.utils.parseUnits("1", 18);
    // Example: swap 1 token0 for token1
    await pool.swap(process.env.NEXT_PUBLIC_TOKEN0_ADDRESS, amountIn);
    alert("Swap executed");
  }

  return (
    <div>
      <h1>Swap on AMM</h1>
      {!signer && <button onClick={connect}>Connect Wallet</button>}
      {signer && (
        <>
          <p>Swapping 1 Token0 for Token1</p>
          <button onClick={swap}>Swap</button>
        </>
      )}
    </div>
  );
}
