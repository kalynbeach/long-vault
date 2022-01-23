/**
 * Return a truncated version of an ethereum address (public key) 
 * @param address 
 * @returns A truncated ethereum address string
 */
 function truncatedAddress(address: string): string {
  const start = address.slice(0, 5);
  const end = address.slice(-3);
  const sep = `...`;
  return `${start}${sep}${end}`;
}

export default truncatedAddress;