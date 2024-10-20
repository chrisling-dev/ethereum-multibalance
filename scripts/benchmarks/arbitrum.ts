import { createPublicClient, erc20Abi, http } from "viem"
import { arbitrum } from "viem/chains"
import { encodeOwnersAndTokens } from "../../utils/encodeOwnersAndTokens"
import { MultiBalanceAbi } from "../../abis/MultiBalance"

const CONTRACT_ADDRESS = "0x99a17464c036309473004e43DBeB9665cc52bBa3"
const HOLDER = "0x70d95587d40A2caf56bd97485aB3Eec10Bee6336"
const WETH = "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1"
const COUNT = 2000

const main = async () => {
  const calls: { owner: `0x${string}`; token: `0x${string}` }[] = new Array(COUNT).fill({
    owner: HOLDER,
    token: WETH,
  })
  const client = createPublicClient({ chain: arbitrum, transport: http() })

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
