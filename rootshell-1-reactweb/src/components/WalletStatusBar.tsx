// src/components/WalletStatusBar.tsx
import { useKaiaWallet } from '../context/KaiaContext'

export default function WalletStatusBar() {
  const { isConnected, address, balance } = useKaiaWallet()

  if (!isConnected) return null

  return (
    <div style={{
      position: 'absolute',
      top: 8,
      right: 12,
      padding: '6px 12px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '8px',
      fontSize: '12px',
      color: '#fff',
      zIndex: 1000,
    }}>
      <div><strong>Address:</strong> {address?.slice(0, 6)}...{address?.slice(-4)}</div>
      <div><strong>Balance:</strong> {balance?.toFixed(2)} KAIA</div>
    </div>
  )
}
