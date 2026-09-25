'use client'

import {
  ConfirmPasswordField,
  EmailField,
  Form,
  FormSubmit,
  PasswordField,
  TextField,
  useConfig,
  useTranslation,
} from '@payloadcms/ui'
import { email, formatAdminURL } from 'payload/shared'
import Link from 'next/link'
import AdminLogo from '../graphics/Logo'

export default function SignUp() {
  const { config } = useConfig()
  const { t } = useTranslation()
  const userSlug = config.admin.user
  const loginRoute = formatAdminURL({
    adminRoute: config.routes.admin,
    path: config.admin.routes?.login || '/login',
  })
  const action = formatAdminURL({
    apiRoute: config.routes.api,
    path: `/${userSlug}`,
  })

  return (
    <main className="sign-up">
      <div className="sign-up__brand">
        <AdminLogo />
      </div>
      <h1>Create your account</h1>
      <p>Join the Idoma Hall of Fame community.</p>
      <Form
        action={action}
        method="POST"
        redirect={`${loginRoute}?signup=success`}
        validationOperation="create"
        disableSuccessStatus
        onSubmit={(_fields, data) => {
          delete data['confirm-password']
        }}
      >
        <TextField
          field={{
            name: 'name',
            type: 'text',
            label: 'Full name',
            required: true,
          }}
          path="name"
        />
        <EmailField
          field={{
            name: 'email',
            type: 'email',
            label: 'Email address',
            required: true,
          }}
          path="email"
          validate={email}
        />
        <PasswordField
          field={{
            name: 'password',
            type: 'text',
            label: t('authentication:newPassword'),
            required: true,
          }}
          path="password"
        />
        <ConfirmPasswordField />
        <FormSubmit>Create account</FormSubmit>
      </Form>
      <p className="sign-up__footer">
        Already have an account? <Link href={loginRoute}>Log in</Link>
      </p>
    </main>
  )
}
