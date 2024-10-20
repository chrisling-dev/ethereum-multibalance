// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

const MultiBalanceModule = buildModule("MultiBalanceModule", (m) => {
  const multibalance = m.contract("MultiBalance")
  return { multibalance }
})

export default MultiBalanceModule
