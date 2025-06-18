// src/context/KaiaContext.tsx
import { createContext, useContext, useState, useEffect } from 'react'

type KaiaWalletContextType = {
  address: string | null
  signature: string | null
  isConnected: boolean
  connect: () => Promise<void>
}

const KaiaWalletContext = createContext<KaiaWalletContextType | undefined>(undefined)

export const KaiaWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connect = async () => {
    try {
      const provider = (window as any).provider || {
        selectedAddress: '0xFAKE_WALLET_ADDRESS',
        request: async ({ method, params }: any) => {
          if (method === 'kaia_requestAccounts') return ['0xFAKE_WALLET_ADDRESS']
          if (method === 'personal_sign') return '0xFAKE_SIGNATURE'
          throw new Error(`Unsupported method: ${method}`)
        },
      }

      const accounts = await provider.request({ method: 'kaia_requestAccounts' })
      const userAddress = accounts[0]
      const signed = await provider.request({
        method: 'personal_sign',
        params: ['Login to Club O2Jam', userAddress],
      })

      setAddress(userAddress)
      setSignature(signed)
      setIsConnected(true)

      console.log('[👛Wallet]✅ 지갑 연결됨:', userAddress)
    } catch (e) {
      console.error('[👛Wallet]❌ 지갑 연결 실패:', e)
    }
  }

  return (
    <KaiaWalletContext.Provider value={{ address, signature, isConnected, connect }}>
      {children}
    </KaiaWalletContext.Provider>
  )
}

export const useKaiaWallet = () => {
  const context = useContext(KaiaWalletContext)
  if (!context) throw new Error('useKaiaWallet must be used within a KaiaWalletProvider')
  return context
}
