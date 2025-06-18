// src/components/WalletStatus.tsx
import React from 'react'
import { useKaiaWallet } from '../context/KaiaContext'

const WalletStatus: React.FC = () => {
  const { address } = useKaiaWallet()

  return (
    <div style={{ color: 'white', fontSize: '14px' }}>
      <div>👛 Wallet Address: {address || 'Not connected'}</div>
      <div>💰 Token Balance: 123.45 KAIA (mock)</div>
    </div>
  )
}

export default WalletStatus