import React from "react"
import { ethers } from "ethers"
import Network from "./Network"
import truncatedAddress from "../utils/truncatedAddress"
import "../styles/components/LongVaultHeader"

interface Props {
  signerAddress: string | null;
  network: ethers.providers.Network | null;
}

const LongVaultHeader = ({ signerAddress, network }: Props) => {
  return (
    <header className="LongVaultHeader">
      <h1>LongVault</h1>
      { signerAddress && network ? (
        <div className="LongVaultHeader-info">
          <Network net={network} />
          <span
            className="LongVaultHeader-signer"
            title={`Active signer (${signerAddress})`}>
            { truncatedAddress(signerAddress) }
          </span>
        </div>
      ) : (
        <div className="LongVaultHeader-info">
          <Network net={null} />
          <span
            className="LongVaultHeader-signer"
            title={`Active signer (${signerAddress})`}>
            null
          </span>
        </div>
      ) }
    </header>
  )
}

export default LongVaultHeader