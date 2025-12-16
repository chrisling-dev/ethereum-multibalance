// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

/// Query multiple balances efficiently
contract MultiBalanceV2 {
    /**
     * @dev Retrieves a list of ERC20 token balances for owner-token pairs
     * @param payload Encoded list of owners and ERC20. Each entry is encoded as ownerAddress|contractAddress
     * @return balances Array of token balances corresponding to the payload
     */
    function getBalances(bytes memory payload) public view returns (uint256[] memory) {
        require(payload.length % 40 == 0, "Invalid payload length");
        uint256 numPairs = payload.length / 40;
        uint256[] memory balances = new uint256[](numPairs);

        for (uint256 i = 0; i < numPairs; i++) {
            address ownerAddress;
            address tokenAddress;
            
            assembly {
                // payload is used as memory pointer of the calldata here
                // since calldata is a bytes array, the first word (32 bytes) is the size of array
                // we add 20 bytes to memory pointer so that the first mload gives us 12 unused bytes + 20 bytes of the address
                let entryStart := add(add(payload, 20), mul(i, 40))
                // we only want the last 20 bytes for the address
                ownerAddress := and(mload(entryStart), 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
                // same as ownerAddress except we add another 20 bytes to offset ownerAddress
                tokenAddress := and(mload(add(entryStart, 20)), 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
            }
            
            // Use staticcall to get the ERC20 balance
            (bool success, bytes memory data) = tokenAddress.staticcall(
                abi.encodeWithSignature("balanceOf(address)", ownerAddress)
            );

            // If the call was successful and returned data, decode it. Otherwise, use 0.
            if (success && data.length >= 32) {
                balances[i] = abi.decode(data, (uint256));
            } else {
                balances[i] = 0;
            }
        }

        return balances;
    }

    /**
     * @dev Retrieves a list of ERC20 token balances for a given owner
     * @param payload First 20 bytes should be owner address, every next 20 bytes should be contract address of an ERC20 token
     * @return balances Array of token balances corresponding to the payload
     */
    function getBalancesForOwner(bytes memory payload) public view returns (uint256[] memory) {
        // payload should be at least 40 bytes (20 bytes for owner address + 20 bytes for first token address)
        require(payload.length % 20 == 0 && payload.length >= 40, "Invalid payload length");
        uint256 numTokens = (payload.length - 20) / 20;
        uint256[] memory balances = new uint256[](numTokens);
        
        // extract owner address from the first 20 bytes of the payload
        address ownerAddress;
        assembly {
            // `payload` points to the length word; actual data starts at `payload + 32`
            // owner is the first 20 bytes of data; it occupies the high-order 20 bytes of the first word
            // by adding 20 bytes to payload, we get 12 unused bytes + 20 bytes of the address and we mask the rest to get the address
            ownerAddress := and(mload(add(payload, 20)), 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
        }

        // iterate over each token address and get the balance
        for (uint256 i = 0; i < numTokens; i++) {
            address tokenAddress;
            assembly {
                // token i is at offset 20 + i * 20 from the start of data
                let dataStart := add(payload, 20)
                let tokenPtr := add(dataStart, add(20, mul(i, 20)))
                // we only want the last 20 bytes for the address
                tokenAddress := and(mload(tokenPtr), 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
            }

            // Use staticcall to get the ERC20 balance
            (bool success, bytes memory data) = tokenAddress.staticcall(
                abi.encodeWithSignature("balanceOf(address)", ownerAddress)
            );

            // If the call was successful and returned data, decode it. Otherwise, use 0.
            if (success && data.length >= 32) {
                balances[i] = abi.decode(data, (uint256));
            } else {
                balances[i] = 0;
            }
        }

        return balances;
    }
}
