export { getIPClass }

function getIPClass({ ip }: { ip: string }) {
  const [firstOctet] = ip.split('.').map(Number) as [number]

  if (firstOctet < 128) {
    return 'A'
  }
  if (firstOctet < 192) {
    return 'B'
  }
  if (firstOctet < 224) {
    return 'C'
  }
  if (firstOctet < 240) {
    return 'D'
  }
  if (firstOctet < 256) {
    return 'E'
  }

  return undefined
}
