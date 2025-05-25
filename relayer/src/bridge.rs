use crate::config::Config;
use crate::ethereum::eth_provider;
use crate::polygon::polygon_provider;
use crate::utils::parse_address;
use ethers::abi::Abi;
use ethers::contract::{Contract, EthEvent};
use ethers::types::{U256, H256, Address};
use ethers::signers::Signer;
use std::fs;
use log::info;
use futures::StreamExt;

#[derive(Debug, Clone, EthEvent)]
#[ethevent(name = "TokensLocked", abi = "TokensLocked(address,uint256,address,uint256,bytes32)")]
pub struct TokensLockedEvent {
    #[ethevent(indexed)]
    pub sender: Address,
    pub amount: U256,
    pub recipient: Address,
    pub nonce: U256,
    pub transaction_id: H256,
}

pub async fn run_relayer(config: Config) -> anyhow::Result<()> {
    // Load ABI
    let abi_str = fs::read_to_string("src/contracts/token_bridge_abi.json")?;
    let bridge_abi: Abi = serde_json::from_str(&abi_str)?;

    // Providers and wallets
    let (eth_provider, _eth_wallet) = eth_provider(&config.eth_rpc_url, &config.private_key, config.source_chain_id).await?;
    let (polygon_provider, polygon_wallet) = polygon_provider(&config.polygon_rpc_url, &config.private_key, config.dest_chain_id).await?;

    // Contract addresses
    let source_bridge_addr = parse_address(&config.source_bridge)?;
    let dest_bridge_addr = parse_address(&config.dest_bridge)?;

    // Contracts
    let source_bridge = Contract::new(source_bridge_addr, bridge_abi.clone(), eth_provider.clone());
    let dest_bridge = Contract::new(dest_bridge_addr, bridge_abi.clone(), polygon_provider.clone());

    // Create event filter first, then stream
    let event_filter = source_bridge.event::<TokensLockedEvent>().from_block(0u64);
    let mut event_stream = event_filter.stream().await?;

    info!("Listening for TokensLocked events on source bridge...");

    while let Some(Ok(event)) = event_stream.next().await {
        info!("TokensLocked event: {:?}", event);

        // Relay to destination chain
        let unlock_call = dest_bridge
            .method::<_, ()>(
                "unlockTokens",
                (
                    event.recipient,
                    event.amount,
                    config.source_chain_id,
                    event.nonce,
                    event.transaction_id,
                ),
            )?
            .from(polygon_wallet.address());

        let pending_tx = unlock_call.send().await?;
        let receipt = pending_tx.await?;
        
        if let Some(receipt) = receipt {
            info!("UnlockTokens tx sent: {:?}", receipt.transaction_hash);
        } else {
            info!("UnlockTokens tx sent but no receipt");
        }
    }

    Ok(())
}
