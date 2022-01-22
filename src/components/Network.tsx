import React from "react"
import { ethers } from "ethers"

// function getNetwork(netId: number) {
//   switch (netId) {
//     case 1:
//       return "Mainnet"
//     case 3:
//       return "Ropsten"
//     case 4:
//       return "Rinkeby"
//     case 42:
//       return "Kovan"
//     case 5777:
//       return "KB Dev"
//     default:
//       return "Unknown"
//   }
// }

interface Props {
  net: ethers.providers.Network | null
}

const Network = ({ net }: Props) => {
  const name = net ? net.name : "Not Connected"
  return (
    <div className="Network" title="Network">
      <span className="Network-name">{ name }</span>
    </div>
  );
};

export default Network