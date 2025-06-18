// useKaiaWallet.ts
import { useState } from 'react'

// 실제 provider가 없을 경우를 대비한 Mock
const mockProvider = {
  selectedAddress: '0xFAKE_WALLET_ADDRESS',
  request: async ({ method }: { method: string }) => {
    switch (method) {
      case 'kaia_requestAccounts':
        return ['0xFAKE_WALLET_ADDRESS']
      case 'personal_sign':
        return '0xFAKE_SIGNATURE'
      default:
        throw new Error(`Mocked method '${method}' not implemented.`)
    }
  },
}

export const useKaiaWallet = () => {
  const [address, setAddress] = useState<string | null>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  const connect = async () => {
    try {
      const provider = (window as any).provider || mockProvider
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

  return {
    connect,
    address,
    signature,
    isConnected,
  }
}
