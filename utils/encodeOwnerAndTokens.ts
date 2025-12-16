export const encodeOwnerAndTokens = (owner: string, tokens: string[]) => {
  let bytes = "0x"

  const ownerBytes = owner.startsWith("0x") ? owner.substring(2, 42) : owner
  bytes += ownerBytes

  tokens.forEach((token) => {
    const tokenBytes = token.startsWith("0x") ? token.substring(2, 42) : token
    bytes += tokenBytes
  })

  return bytes as `0x${string}`
}
