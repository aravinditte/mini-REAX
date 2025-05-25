/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  env: {
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_RPC_URL: process.env.NEXT_PUBLIC_RPC_URL,
    NEXT_PUBLIC_BRIDGE_ADDRESS: process.env.NEXT_PUBLIC_BRIDGE_ADDRESS,
    NEXT_PUBLIC_SUSD_ADDRESS: process.env.NEXT_PUBLIC_SUSD_ADDRESS,
  },
}

module.exports = nextConfig
