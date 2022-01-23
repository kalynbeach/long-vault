import React, { useState } from "react"
import { Button, Form } from "semantic-ui-react";
import { ethers } from "ethers"
import "../styles/components/LongVaultForm"

interface Props {}

interface CreateLongVaultParams {}

const LongVaultForm = () => {

  async function onSubmit() {}

  return (
    <div className="LongVault-form">
      <span className="LongVault-form-heading">LongVault Form</span>
      {/* Tabs: Create, Manage */}
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Admin Address</label>
          <Form.Input
            placeholder="LongVault admin address"
            type="text"
            value={signerAddress}
          />
        </Form.Field>
        <Form.Field>
          <label>Beneficiary Address</label>
          <Form.Input
            placeholder="LongVault beneficiary address"
            type="text"
            value={beneficiary}
            onChange={onBeneficiaryChange}
          />
        </Form.Field>
        <Button color="green" disabled={pending} loading={pending}>
          Create LongVault
        </Button>
      </Form>
    </div>
  )
}

export default LongVaultForm