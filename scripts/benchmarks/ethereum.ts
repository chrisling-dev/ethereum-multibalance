import { createPublicClient, erc20Abi, http } from "viem"
import { base } from "viem/chains"
import { encodeOwnersAndTokens } from "../../utils/encodeOwnersAndTokens"
import { MultiBalanceAbi } from "../../abis/MultiBalance"

const CONTRACT_ADDRESS = "0x99a17464c036309473004e43DBeB9665cc52bBa3"
const HOLDER = "0xF04a5cC80B1E94C69B48f5ee68a08CD2F09A7c3E"
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
const COUNT = 2000

const main = async () => {
  const calls: { owner: `0x${string}`; token: `0x${string}` }[] = new Array(COUNT).fill({
    owner: HOLDER,
    token: WETH,
  })
  const client = createPublicClient({ chain: base, transport: http() })

  const calldata = encodeOwnersAndTokens(calls)
  const multibalance = client.readContract({
    abi: MultiBalanceAbi,
    functionName: "getBalances",
    args: [calldata],
    address: CONTRACT_ADDRESS,
  })
  console.log("--------------------------------------------------")
  console.log("| MultiBalance | Fetching Balances...")
  const multiBalanceStart = performance.now()
  const balances = await multibalance
  console.log(
    `| MultiBalance | ${balances.length} in ${(performance.now() - multiBalanceStart).toFixed(
      4
    )}ms | ${(calldata.length - 2) / 2} bytes`
  )
  console.log("--------------------------------------------------")

  const contracts = calls.map((c) => ({
    abi: erc20Abi,
    address: c.token,
    functionName: "balanceOf",
    args: [c.owner],
  }))
  console.log("--------------------------------------------------")
  console.log("| Multicall | Fetching Balances...")
  const multicallStart = performance.now()
  const res = await client.multicall({
    contracts,
  })
  console.log(`| MultiCall | ${res.length} in ${performance.now() - multicallStart}ms`)
}

main()
