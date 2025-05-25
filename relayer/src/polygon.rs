use ethers::providers::{Provider, Http};
use ethers::signers::{LocalWallet, Signer};
use std::sync::Arc;

pub async fn polygon_provider(rpc_url: &str, private_key: &str, chain_id: u64) -> anyhow::Result<(Arc<Provider<Http>>, LocalWallet)> {
    let provider = Provider::<Http>::try_from(rpc_url)?;
    let wallet: LocalWallet = private_key.parse::<LocalWallet>()?.with_chain_id(chain_id);
    Ok((Arc::new(provider), wallet))
}
