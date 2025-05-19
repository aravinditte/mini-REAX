# Dockerfile
FROM node:18

# Install build tools for Circom
RUN apt-get update && \
    apt-get install -y git cmake build-essential libgmp-dev libboost-all-dev libsodium-dev libssl-dev curl

# Install Rust (needed for Circom)
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Build Circom from source
RUN git clone https://github.com/iden3/circom.git /circom && \
    cd /circom && \
    cargo build --release

# Install SnarkJS globally
RUN npm install -g snarkjs

# Set working directory
WORKDIR /app
# Copy package files if using local Node backend
COPY package*.json ./
RUN npm install
COPY . .
