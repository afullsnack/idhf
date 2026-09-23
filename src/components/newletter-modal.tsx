import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { getJoinedStorage, updateJoinedStorage } from "@/lib/newsletter-modal";
import { useSubscribeToNewsletter } from "@/hooks/use-subscribe-to-newsletter";

interface INewsLetterModalProps {
	onSubscribe?: (email: string) => void
}

function getErrorMessage(subscribe: ReturnType<typeof useSubscribeToNewsletter>): string | null {
	if (subscribe.data?.ok === false) return subscribe.data.error
	if (subscribe.error) return "Something went wrong. Please try again."
	return null
}

export default function NewsLetterModal({ onSubscribe }: INewsLetterModalProps) {
	const [open, setOpen] = useState(false)
	const [email, setEmail] = useState("")
	const subscribe = useSubscribeToNewsletter()
	const error = getErrorMessage(subscribe)

	useEffect(() => {
		const joinedState = getJoinedStorage()
		if (joinedState === "no") {
			setOpen(true)
		}
	}, [])

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!email.trim() || subscribe.isPending) return

		const result = await subscribe.mutateAsync(email)
		if (result.ok) {
			onSubscribe?.(result.email)
			updateJoinedStorage("yes")
			setEmail("")
			setOpen(false)
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogContent>
				<DialogHeader>
					<img src="/logo.png" className="object-contain size-12" />
					<DialogTitle className="text-2xl font-semibold">Join the Newsletter</DialogTitle>
					<DialogDescription className="text-lg">
						Subscribe to our newsletter for updates on events, new inductees, and cultural programs.
					</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit} className="flex flex-col w-full gap-3 max-w-xl">
					<InputGroup>
						<InputGroupInput
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email"
							disabled={subscribe.isPending}
							aria-label="Email address"
							autoComplete="email"
							required
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupButton variant="ghost" size="sm" type="submit" className="text-red-400" disabled={subscribe.isPending}>
								{subscribe.isPending ? "Subscribing…" : "Subscribe"}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
					{error && (
						<p className="text-xs text-destructive" role="alert">
							{error}
						</p>
					)}
				</form>
			</DialogContent>
		</Dialog>
	)
}
