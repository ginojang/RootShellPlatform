// src/context/KaiaContext.tsx
import { createContext, useContext, useState } from 'react'

type KaiaWalletContextType = {
  address: string | null
  signature: string | null
  isConnected: boolean
  balance: number | null         // 💰 잔액 추가
  connect: () => Promise<void>
  refreshBalance: () => void   // 🔄 추가
}

const KaiaWalletContext = createContext<KaiaWalletContextType | undefined>(undefined)

export const KaiaWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [balance, setBalance] = useState<number | null>(null)   // 💰 상태 추가

    const mockFetchBalance = () => {
    // 🔄 이 부분은 실제 API로 교체 가능
    const randomBalance = parseFloat((Math.random() * 1000).toFixed(3))
    setBalance(randomBalance)
    console.log('[👛Wallet]🔄 잔액 리프레시됨 (Mock):', randomBalance)
  }

  const refreshBalance = () => {
    mockFetchBalance()
  }

  const connect = async () => {
    try {
      const provider = (window as any).provider || {
        selectedAddress: '0xFAKE_WALLET_ADDRESS',
        request: async ({ method/*, params*/ }: any) => {
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

      // 💰 잔액은 임시 mock 처리
      const mockBalance = 123.456
      setBalance(mockBalance)

      console.log('[👛Wallet]✅ 지갑 연결됨:', userAddress)
      console.log('[👛Wallet]💰 잔액(MOCK):', mockBalance)
    } catch (e) {
      console.error('[👛Wallet]❌ 지갑 연결 실패:', e)
    }
  }

  return (
    <KaiaWalletContext.Provider value={{ address, signature, isConnected, balance, connect, refreshBalance }}>
      {children}
    </KaiaWalletContext.Provider>
  )
}

export const useKaiaWallet = () => {
  const context = useContext(KaiaWalletContext)
  if (!context) throw new Error('useKaiaWallet must be used within a KaiaWalletProvider')
  return context
}
