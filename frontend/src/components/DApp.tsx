import React, { ReactNode, useState, useEffect, createContext, useContext } from "react"
import Head from "next/head"
import { ethers } from "ethers"

import LongVaultArtifact from "../contracts/LongVault.json"
import implementationAddress from "../contracts/implementation-address.json"

import LongVaultFactoryArtifact from "../contracts/LongVaultFactory.json"
import factoryAddress from "../contracts/factory-address.json"

// Import presentational components
// ...

const HARDHAT_NETWORK_ID = ""
const ERROR_CODE_TX_REJECTED_BY_USER = 4001

export type EthNetwork = ethers.providers.Network;
export type EthProvider = ethers.providers.Web3Provider;
export type EthSigner = ethers.providers.JsonRpcSigner;

interface Props {
  children?: ReactNode,
  title?: string
}

interface State {
  network: EthNetwork | null
  provider: EthProvider | null
  signer: EthSigner | null
  implementationAddress?: string
  factoryAddress?: string
  admin?: string
  beneficiary?: string
  networkError: Error | null
  txError: Error | null
}

const initialState: State = {
  network: null,
  provider: null,
  signer: null,
  implementationAddress: undefined,
  factoryAddress: undefined,
  admin: undefined,
  beneficiary: undefined,
  networkError: null,
  txError: null,
}

const DAppContext = createContext({
  state: initialState,
  // TODO: Add any 'global' methods
})

const DApp = ({ children, title = "LongVault" }: Props) => {
  const { state } = useContext(DAppContext)

  // TODO: Bring over hooks and update as needed
  // useEffect(() => {}, [])

  return (
    <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <div>
      {children}
    </div>
    {/* LongVaultHeader */}
  </div>
  )
}

export default DApp

