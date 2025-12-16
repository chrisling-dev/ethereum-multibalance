import assert from "node:assert/strict"
import { describe, it } from "node:test"

import { network } from "hardhat"

import { encodeOwnersAndTokens } from "../utils/encodeOwnersAndTokens"
import { MultiBalanceAbi } from "../abis/MultiBalance"

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const HOLDER = "0xF04a5cC80B1E94C69B48f5ee68a08CD2F09A7c3E"
const WORMHOLD_BRIDGE = "0x3ee18B2214AFF97000D974cf647E7C347E8fa585"
const MOODENG = "0x28561B8A2360F463011c16b6Cc0B0cbEF8dbBcad"
const HOLDER_WETH_BALANCE = 338986576497713324155872n

const calls = [
  { owner: HOLDER, token: WETH, balance: HOLDER_WETH_BALANCE }, // should return a valid balance
  { owner: HOLDER, token: MOODENG, balance: 10000000000000n }, // should return a valid balance
  { owner: HOLDER, token: HOLDER, balance: 0n }, // when using address with 0 code as token, should not cause revert
  { owner: HOLDER, token: WORMHOLD_BRIDGE, balance: 0n }, // when using an address with code but not balanceOf method, should not revert
]

describe("MultiBalance", async function () {
  console.log("Connecting to mainnet fork")
  const { viem } = await network.connect("mainnetFork")

  console.log("Getting public client")
  const client = await viem.getPublicClient()

  console.log("Deploying MultiBalance contract")
  const multibalance = await viem.deployContract("MultiBalance")
  console.log("MultiBalance contract deployed!")

  describe("getBalances", async function () {
    it("should return a valid balance", async function () {
      const start = performance.now()
      const balances = await client.readContract({
        abi: MultiBalanceAbi,
        address: multibalance.address,
        functionName: "getBalances",
        args: [encodeOwnersAndTokens([calls[0]])],
      })
      assert.equal(balances.length, 1)
      assert.equal(balances[0], calls[0].balance)
      console.log(`MultiBalance done in ${performance.now() - start}ms`)
    })

    it("should return a 0n when token address has 0 code", async function () {
      const start = performance.now()
      const balances = await client.readContract({
        abi: MultiBalanceAbi,
        address: multibalance.address,
        functionName: "getBalances",
        args: [encodeOwnersAndTokens([calls[1]])],
      })
      assert.equal(balances.length, 1)
      assert.equal(balances[0], calls[1].balance)
      console.log(`MultiBalance done in ${performance.now() - start}ms`)
    })

    it("should return a 0n when token address does not have balanceOf", async function () {
      const start = performance.now()
      const balances = await client.readContract({
        abi: MultiBalanceAbi,
        address: multibalance.address,
        functionName: "getBalances",
        args: [encodeOwnersAndTokens([calls[2]])],
      })
      assert.equal(balances.length, 1)
      assert.equal(balances[0], calls[2].balance)
      console.log(`MultiBalance done in ${performance.now() - start}ms`)
    })

    it("should return all balances correctly", async function () {
      const start = performance.now()
      const balances = await client.readContract({
        abi: MultiBalanceAbi,
        address: multibalance.address,
        functionName: "getBalances",
        args: [encodeOwnersAndTokens(calls)],
      })
      assert.equal(balances.length, 4)
      balances.forEach((balance, index) => {
        assert.equal(balance, calls[index].balance)
      })
      console.log(`MultiBalance done in ${performance.now() - start}ms`)
    })
  })
})
