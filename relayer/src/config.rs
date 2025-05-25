use std::env;

#[derive(Clone, Debug)]
pub struct Config {
    pub eth_rpc_url: String,
    pub polygon_rpc_url: String,
    pub private_key: String,
    pub source_bridge: String,
    pub dest_bridge: String,
    pub source_chain_id: u64,
    pub dest_chain_id: u64,
}

impl Config {
    pub fn from_env() -> anyhow::Result<Self> {
        Ok(Self {
            eth_rpc_url: env::var("ETHEREUM_RPC_URL")?,
            polygon_rpc_url: env::var("POLYGON_RPC_URL")?,
            private_key: env::var("PRIVATE_KEY")?,
            source_bridge: env::var("SOURCE_BRIDGE_ADDRESS")?,
            dest_bridge: env::var("DEST_BRIDGE_ADDRESS")?,
            source_chain_id: env::var("SOURCE_CHAIN_ID")?.parse()?,
            dest_chain_id: env::var("DEST_CHAIN_ID")?.parse()?,
        })
    }
}
