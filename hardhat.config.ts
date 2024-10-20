import type { HardhatUserConfig } from "hardhat/config"
import "@nomicfoundation/hardhat-toolbox-viem"
import "@nomicfoundation/hardhat-ethers"
import "hardhat-tracer"
import { config as dotEnvConfig } from "dotenv"
dotEnvConfig()

const DEPLOYER_KEY = process.env.DEPLOYER_KEY!

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  defaultNetwork: "hardhat",
  tracer: {
    enabled: true,
  },
  networks: {
    hardhat: {
      chainId: 1,
      forking: {
        url: "https://rpc.ankr.com/eth",
        blockNumber: 20989270,
      },
    },
    arbitrum: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/arbitrum",
    },
    avalanche: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/avalanche",
    },
    ethereum: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/eth",
    },
    base: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/base",
    },
    blast: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/blast",
    },
    bsc: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/bsc",
    },
    optimism: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/optimism",
    },
    polygon: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/polygon",
    },
  },
  gasReporter: {
    enabled: true,
  },
}

export default config
