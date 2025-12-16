import { configVariable, defineConfig } from "hardhat/config"
import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem"
import { config as dotEnvConfig } from "dotenv"
dotEnvConfig()

// const DEPLOYER_KEY = process.env.DEPLOYER_KEY!

export default defineConfig({
  solidity: {
    version: "0.8.27",
  },
  plugins: [hardhatToolboxViemPlugin],
  networks: {
    mainnetFork: {
      type: "edr-simulated",
      forking: {
        url: configVariable("INFURA_API_KEY", "https://mainnet.infura.io/v3/{variable}"),
        blockNumber: 24018948,
      },
    },
    mainnet: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    arbitrum: {
      type: "http",
      chainType: "generic",
      url: configVariable("INFURA_API_KEY", "https://arbitrum-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    linea: {
      type: "http",
      chainType: "generic",
      url: configVariable("INFURA_API_KEY", "https://linea-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    polygon: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://polygon-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    base: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://base-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    blast: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://blast-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    optimism: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://optimism-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    avalanche: {
      type: "http",
      chainType: "l1",
      url: "https://api.avax.network/ext/bc/C/rpc",
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    zksync: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://zksync-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    bsc: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://bsc-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    mantle: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://mantle-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    monad: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://monad-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    unichain: {
      type: "http",
      chainType: "l1",
      url: configVariable("INFURA_API_KEY", "https://unichain-mainnet.infura.io/v3/{variable}"),
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    hyperevm: {
      type: "http",
      chainType: "l1",
      url: "https://rpc.hyperliquid.xyz/evm",
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    plasma: {
      type: "http",
      chainType: "l1",
      url: "https://rpc.plasma.to",
      accounts: [configVariable("DEPLOYER_KEY")],
    },
    berachain: {
      type: "http",
      chainType: "l1",
      url: "https://rpc.berachain.com",
      accounts: [configVariable("DEPLOYER_KEY")],
    },
  },
})
