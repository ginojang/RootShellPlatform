// 예시 버튼 UI: 결제 시작용
// src/components/PaymentButton.tsx
import React from 'react'
import { usePayment } from '../context/PaymentContext'

const PaymentButton: React.FC = () => {
  const { startPayment, paymentStatus } = usePayment()

  return (
    <button onClick={startPayment} disabled={paymentStatus === 'started'}>
      {paymentStatus === 'started' ? 'Processing...' : 'Start Payment (Mock)'}
    </button>
  )
}

export default PaymentButton