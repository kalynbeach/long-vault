import type { NextPage } from "next"
import Link from "next/link"
import DApp from "../components/DApp"
import LongVaultForm from "../components/LongVaultForm"
import truncatedAddress from "../utils/truncatedAddress"

// TODO: Set up LongVaultFactory Context
// - Pass contract data to DApp layout for pages as state

interface Props {}

const DashboardPage: NextPage = () => {
  return (
    <DApp>
      <div className="Dashboard">
      <div className="Dashboard-header">
        <h2>Dashboard</h2>
        <span
          className="Dashboard-factory-address"
          title={`LongVaultFactory contract address (${state.address})`}>
          { state.address ? truncatedAddress(state.address) : "null" }
        </span>
      </div>
      <div className="Dashboard-main">
        <LongVaultForm />
        {/* <span>* Create new LongVault</span><br/> */}
        {/* <span>* Manage existing LongVault</span> */}
        <div className="Dashboard-existing-vaults">
          <h3>Existing LongVaults: { state.allLongVaults.length }</h3><br/>
          { existingVaults }
        </div>
      </div>
    </div>
    </DApp>
  )
}