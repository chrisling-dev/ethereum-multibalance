// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

/// Query multiple balances efficiently
contract MultiBalance {
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
}
