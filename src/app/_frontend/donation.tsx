import { Container, Main, Section } from '@/components/craft'
import Pricing from '@/components/pricing'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_frontend/donation')({
  component: RouteComponent,
})

function RouteComponent() {
	if (false) {
		return (
			<Pricing />
		)
	}

  return (
    <Section className='flex items-center justify-center'>
      <Container className="">
        <Pricing />
      </Container>
    </Section>
  )
}
