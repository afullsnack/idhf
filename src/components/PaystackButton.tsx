// app/components/PaystackButton.tsx
'use client'

import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import { ArrowUpRightIcon } from 'lucide-react'
import DonationModal from './donation-success-modal'

interface IPaystackButtonProps {
  inputAmount: number
  customerEmail: string
}
export default function PaystackButton({ inputAmount, customerEmail }: IPaystackButtonProps) {
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)
  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false)
  const [isDonationSuccessful, setIsDonationSuccessful] = useState(false)

  // Poll until the CDN has attached PaystackPop to window
  useEffect(() => {
    if (typeof window !== 'undefined' && window.PaystackPop) {
      setReady(true)
      return
    }
    const id = setInterval(() => {
      if (typeof window !== 'undefined' && window.PaystackPop) {
        setReady(true)
        clearInterval(id)
      }
    }, 200)
    return () => clearInterval(id)
  }, [])

  const payWithPaystack = () => {
    if (typeof window === 'undefined' || !window.PaystackPop) {
      alert('Paystack has not loaded yet. Try again in a moment.')
      return
    }

    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PK!,
      email: customerEmail,
      amount: inputAmount * 100, // convert naira to kobo
      currency: 'NGN',
      ref: 'ref_' + Math.floor(Math.random() * 1_000_000_000 + 1),
      onClose: () => {
        alert("Closing payment modal, means you'll restart the process, proceed?")
      },
      callback: (response) => {
        setLoading(true)
        fetch(`/api/paystack/verify?reference=${encodeURIComponent(response.reference)}`)
          .then((res) => res.json().catch(() => null))
          .then((data) => {
            setIsDonationSuccessful(data?.status === 'success')
            setLoading(false)
            setIsDonationModalOpen(true)
          })
      },
    })

    handler.openIframe()
  }

  return (
    <>
      <div>
        <Button
          onClick={payWithPaystack}
          disabled={loading || !ready}
          size="lg"
          className="w-full text-white"
        >
          Proceed to make donation
          <ArrowUpRightIcon />
        </Button>
      </div>
      <DonationModal
        isSuccess={isDonationSuccessful}
        openModal={isDonationModalOpen}
        onOpenChange={setIsDonationModalOpen}
      />
    </>
  )
}
