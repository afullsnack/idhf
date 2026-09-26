'use client'

import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog'

interface IDonationModalProps {
  isSuccess: boolean
  openModal: boolean
  onOpenChange: (open: boolean) => void
}

export default function DonationModal({
  isSuccess,
  openModal,
  onOpenChange,
}: IDonationModalProps) {
  return (
    <Dialog open={openModal} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <img src="/logo.png" alt="Idoma Hall of Fame" className="object-contain size-12" />
          {isSuccess ? (
            <>
              <DialogTitle className="text-2xl font-semibold">
                Thank You for Your Donation! ❤️
              </DialogTitle>
              <DialogDescription className="text-[18px]">
                Your generous donation to the Idoma Hall of Fame is deeply appreciated. Thank you
                for supporting our mission to celebrate, preserve, and promote the rich heritage and
                achievements of the Idoma people.
              </DialogDescription>
              <Badge variant="secondary">Your contribution makes a difference.</Badge>
            </>
          ) : (
            <>
              <DialogTitle className="text-2xl font-semibold">
                We’re Sorry, Something Went Wrong
              </DialogTitle>
              <DialogDescription className="text-[18px]">
                We couldn’t complete your donation to the Idoma Hall of Fame.
                <br />
                <b>What to do next:</b>
                <br />
                <ol>
                  <li>Check your internet connection and try the donation again.</li>
                  <li>
                    If you were charged, please don’t retry. Contact our support team so we can
                    verify your payment.
                  </li>
                  <li>If you weren’t charged, you can safely restart the donation process.</li>
                </ol>
              </DialogDescription>
              <Badge>Thank you for your patience and for supporting the Idoma Hall of Fame.</Badge>
            </>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
