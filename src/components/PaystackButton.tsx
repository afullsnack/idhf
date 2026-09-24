// app/components/PaystackButton.tsx
'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { ArrowUpRightIcon } from 'lucide-react'

interface IPaystackButtonProps {
  inputAmount: number
  customerEmail: string
}
export default function PaystackButton({ inputAmount, customerEmail }: IPaystackButtonProps) {
  const [loading, setLoading] = useState(false)

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
        alert('Payment window closed.')
      },
			callback: (response) => {
				console.log(`Prelim response:-`, {response})
        // Runs on your page after a successful charge — verify on the server
        setLoading(true)
        fetch(`/api/paystack/verify?reference=${response.reference}`)
          .then((res) => res.json())
					.then((data) => {
						console.log(`Data response`, { data })

            if (data.status === 'success') {
              alert('Payment verified! Reference: ' + response.reference)
            } else {
              alert('Payment could not be verified.')
            }
          })
          .finally(() => setLoading(false))
      },
    })

    handler.openIframe()
  }

  return (
    <div>
      <Button onClick={payWithPaystack} disabled={loading} size="lg" className="w-full text-white">
        Proceed to make donation
        <ArrowUpRightIcon />
      </Button>
    </div>
  )
}
