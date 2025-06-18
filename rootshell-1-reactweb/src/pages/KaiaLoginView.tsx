// src/pages/KaiaLoginView.tsx
import toast from 'react-hot-toast'
import { useKaiaWallet } from '../context/KaiaContext'
import { usePayment } from '../context/PaymentContext'
import { useEffect } from 'react'


type Props = {
  onStartUnity: () => void
}

export default function KaiaLoginView({ onStartUnity }: Props) {
  const { connect, isConnected, address } = useKaiaWallet()

  const { paymentStatus } = usePayment()
  const { refreshBalance } = useKaiaWallet()

    useEffect(() => {
    if (paymentStatus === 'completed') {
    const amount = 100  // 💰 실제 결제 금액 (Mock)

    toast.success(`₩${amount.toLocaleString()} 결제가 완료되었습니다.`)
    refreshBalance()
    }
    }, [paymentStatus])


  return (
    <main style={{ color: '#fff', textAlign: 'center', marginTop: '4rem' }}>
      {!isConnected ? (
        <>
          <h1>👛 KAIA 지갑 연결이 필요합니다</h1>
          <button
            onClick={connect}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              backgroundColor: '#333',
              color: '#fff',
              border: '1px solid #666',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            지갑 연결하기
          </button>
        </>
      ) : (
        <>
          <h2>✅ 연결된 지갑: {address}</h2>
          <button
            onClick={onStartUnity}
            style={{
              marginTop: '1.5rem',
              padding: '0.8rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: '#00cc88',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            ▶️ 오투잼 프루츠 시작 
          </button>
        </>
      )}
    </main>
  )
}
