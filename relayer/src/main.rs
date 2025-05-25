mod config;
mod bridge;
mod ethereum;
mod polygon;
mod utils;

use crate::config::Config;
use crate::bridge::run_relayer;
use dotenv::dotenv;
use log::info;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    dotenv().ok();
    env_logger::init();

    let config = Config::from_env()?;
    info!("Mini-REAX Relayer starting with config: {:?}", config);

    run_relayer(config).await?;

    Ok(())
}
