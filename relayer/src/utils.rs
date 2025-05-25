pub fn parse_address(addr: &str) -> anyhow::Result<ethers::types::Address> {
    use ethers::types::Address;
    addr.parse::<Address>().map_err(|e| anyhow::anyhow!("Invalid address: {}", e))
}
