# Ethereum MultiBalance

Fast and efficient way to query a long list of ERC20 token balances using assembly

## Problem

Querying multiple ERC20 token balances for various addresses is a common task in many blockchain applications, such as wallets, portfolio trackers, and DeFi protocols. However, traditional methods of querying these balances can be slow and inefficient, especially when dealing with a large number of tokens or addresses. This process often requires multiple separate calls to different token contracts, leading to slow query time and potentially rate limits.

## Solution: MultiBalance

MultiBalance is a smart contract designed to solve this problem by providing a fast and gas-efficient way to query multiple ERC20 token balances in a single call.

### How MultiBalance works

1. **Compact input**: By using assembly, the contract only requires you to pass in the owner and token address for each balance you're trying to query. This requires precisely 40 bytes of calldata per balance query (20 bytes for the owner address and 20 bytes for the token address).

2. **Batched queries**: MultiBalance allows you to query multiple token balances for multiple addresses in a single transaction, significantly reducing the number of separate calls needed.

As an example, to query WETH balance for 3 addresses would require only 124 bytes in your calldata, 4 bytes selector and 120 bytes for packed encoded owner addresses and tokena addresses.

## Benefits

- **Reduced API calls**: Minimize the number of RPC calls required to fetch multiple token balances.
- **Improved performance**: Reduced network latency due to at least 40% smaller calldata size compared to using multicall.
- **Simplified integration**: Use a single contract address across multiple networks for consistent integration in multi-chain applications.

## Network Support

The MultiBalance contract is deployed on the following networks:

| Chain     | Chain ID | Address                                    |
| --------- | -------- | ------------------------------------------ |
| Mainnet   | 1        | 0x99a17464c036309473004e43DBeB9665cc52bBa3 |
| Optimism  | 10       | 0x99a17464c036309473004e43DBeB9665cc52bBa3 |
| BSC       | 56       | 0x99a17464c036309473004e43DBeB9665cc52bBa3 |
| Matic     | 137      | 0x99a17464c036309473004e43DBeB9665cc52bBa3 |
| Base      | 8453     | 0x99a17464c036309473004e43DBeB9665cc52bBa3 |
| Arbitrum  | 42161    | 0x99a17464c036309473004e43DBeB9665cc52bBa3 |
| Avalanche | 43114    | 0x99a17464c036309473004e43DBeB9665cc52bBa3 |
| Blast     | 8157     | 0x99a17464c036309473004e43DBeB9665cc52bBa3 |

## Usage

See test file to understand how `encodeOwnersAndTokens` function encodes a long list of owner and token address into calldata.
