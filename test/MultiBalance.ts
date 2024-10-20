import hre from "hardhat"
import { GetContractReturnType, PublicClient } from "viem"
import { expect } from "chai"
import { encodeOwnersAndTokens } from "../utils/encodeOwnersAndTokens"
import { MultiBalance$Type } from "../artifacts/contracts/MultiBalance.sol/MultiBalance"
import { MultiBalanceAbi } from "../abis/MultiBalance"

const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const HOLDER = "0xF04a5cC80B1E94C69B48f5ee68a08CD2F09A7c3E"
const WORMHOLD_BRIDGE = "0x3ee18B2214AFF97000D974cf647E7C347E8fa585"
const HOLDER_WETH_BALANCE = 642687859976611023227304n

const calls = [
  { owner: HOLDER, token: WETH }, // should return a valid balance
  { owner: HOLDER, token: HOLDER }, // when using address with 0 code as token, should not cause revert
  { owner: HOLDER, token: WORMHOLD_BRIDGE }, // when using an address with code but not balanceOf method, should not revert
]

describe("MultiBalance", function () {
  let multibalance: GetContractReturnType<MultiBalance$Type["abi"]>
  let client: PublicClient
  this.beforeAll(async () => {
    multibalance = await hre.viem.deployContract("MultiBalance")
    client = await hre.viem.getPublicClient()
  })

  describe("getBalances", async function () {
    it("should return a valid balance", async function () {
      const start = performance.now()
      const balances = await client.readContract({
        abi: MultiBalanceAbi,
        address: multibalance.address,
        functionName: "getBalances",
        args: [encodeOwnersAndTokens([calls[0]])],
      })
      expect(balances.length).to.eq(1)
      expect(balances[0]).to.eq(HOLDER_WETH_BALANCE)
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
      expect(balances.length).to.eq(1)
      expect(balances[0]).to.eq(0n)
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
      expect(balances.length).to.eq(1)
      expect(balances[0]).to.eq(0n)
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
      expect(balances.length).to.eq(3)
      expect(balances[0]).to.eq(HOLDER_WETH_BALANCE)
      expect(balances[1]).to.eq(0n)
      expect(balances[2]).to.eq(0n)
      console.log(`MultiBalance done in ${performance.now() - start}ms`)
    })
  })
})
