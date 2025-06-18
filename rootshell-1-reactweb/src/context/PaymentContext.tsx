// src/context/PaymentContext.tsx
import React from 'react'
import { createContext, useContext, useState } from 'react'

interface PaymentContextProps {
  isPaying: boolean
  paymentStatus: 'idle' | 'started' | 'completed'
  startPayment: () => void
}

const PaymentContext = createContext<PaymentContextProps | undefined>(undefined)

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'started' | 'completed'>('idle')
  const [isPaying, setIsPaying] = useState(false)

  const startPayment = () => {
    setIsPaying(true)
    setPaymentStatus('started')
    setTimeout(() => {
      setPaymentStatus('completed')
      setIsPaying(false)
    }, 2000) // Mock delay
  }

  return (
    <PaymentContext.Provider value={{ isPaying, paymentStatus, startPayment }}>
      {children}
    </PaymentContext.Provider>
  )
}

export const usePayment = () => {
  const context = useContext(PaymentContext)
  if (!context) throw new Error('usePayment must be used within a PaymentProvider')
  return context
} 






