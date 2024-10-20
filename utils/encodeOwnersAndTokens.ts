export const encodeOwnersAndTokens = (list: { owner: string; token: string }[]) => {
  let bytes = "0x"

  list.forEach(({ owner, token }) => {
    const ownerBytes = owner.startsWith("0x") ? owner.substring(2, 42) : owner
    const tokenBytes = token.startsWith("0x") ? token.substring(2, 42) : token
    bytes += `${ownerBytes}${tokenBytes}`
  })

  return bytes as `0x${string}`
}
