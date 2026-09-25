import Link from 'next/link'
import type { ServerProps } from 'payload'

export default function LoginSignupLink({ searchParams }: ServerProps) {
  const accountCreated = searchParams?.signup === 'success'

  return (
    <div className="login__signup">
      {accountCreated && (
        <p className="login__signup-success">Your account is ready. Log in to continue.</p>
      )}
      <p>
        New here? <Link href="/admin/sign-up">Create an account</Link>
      </p>
    </div>
  )
}
