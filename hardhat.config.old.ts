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
        url: "https://mainnet.infura.io/v3/9608e89a06714d19a6c462313852b9e8",
        blockNumber: 24018948,
      },
    },
    arbitrum: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/arbitrum/e77e7fc35e49d464e255cce6e52bafc834c3e4259c1728e6631d22391633000d",
    },
    avalanche: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/avalanche/e77e7fc35e49d464e255cce6e52bafc834c3e4259c1728e6631d22391633000d",
    },
    ethereum: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/eth/e77e7fc35e49d464e255cce6e52bafc834c3e4259c1728e6631d22391633000d",
    },
    base: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/base/e77e7fc35e49d464e255cce6e52bafc834c3e4259c1728e6631d22391633000d",
    },
    blast: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/blast/e77e7fc35e49d464e255cce6e52bafc834c3e4259c1728e6631d22391633000d",
    },
    bsc: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/bsc/e77e7fc35e49d464e255cce6e52bafc834c3e4259c1728e6631d22391633000d",
    },
    optimism: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/optimism/e77e7fc35e49d464e255cce6e52bafc834c3e4259c1728e6631d22391633000d",
    },
    polygon: {
      accounts: [DEPLOYER_KEY],
      url: "https://rpc.ankr.com/polygon/e77e7fc35e49d464e255cce6e52bafc834c3e4259c1728e6631d22391633000d",
    },
  },
  gasReporter: {
    enabled: true,
  },
}

export default config
