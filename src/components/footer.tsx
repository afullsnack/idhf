import { cn } from "@/lib/utils";
import { useState } from "react";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { InstagramIcon } from "@/components/icons/instagram-icon";
import { XIcon } from "@/components/icons/x-icon";
import { YoutubeIcon } from "@/components/icons/youtube-icon";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Email, Location, PhoneCall } from "@hugeicons/core-free-icons";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "./ui/input-group";
import { Button } from "./ui/button";
import { Logo } from "./frontend-nav";
import { Separator } from "./ui/separator";
import { useSubscribeToNewsletter } from "@/hooks/use-subscribe-to-newsletter";

export function Footer() {
	return (
		<footer
			className={cn(
				"border-t",
				"dark:bg-[radial-gradient(35%_128px_at_50%_0%,--theme(--color-foreground/.08),transparent)]"
			)}
		>
			<div className="flex flex-col md:flex-row mx-auto w-full max-w-5xl gap-8 items-center justify-center border-b px-8 py-16">
				<div className="w-full md:flex-1 flex items-start justify-start gap-3 order-1 md:order-2">
					<Subscribe />
				</div>


				<div className="order-2 md:order-1 md:flex-2">
					<div className="flex items-center justify-start gap-3">
						<Logo />
						<div>
							<h5 className="text-2xl font-bold! m-0!">Idoma Hall of fame</h5>
							<span className="text-sm">Preserving Cultural Heritage</span>
						</div>
					</div>
					<p className="text-balance">
						A sanctuary of cultural pride, a repository of achievements, and a testament to the enduring spirit of the Idoma people. Celebrating excellence and preserving our rich heritage for future generations.
					</p>
					{/*<Separator className="my-3.5" />*/}
					<div className="flex flex-col gap-3 items-start justify-start mt-8">
						<a href="mailto:info@idomahalloffame.ng" className="flex items-center justify-center gap-2 no-underline!">
							<HugeiconsIcon icon={Email} strokeWidth={2} className="size-4" />
							<span className="text-sm">info@idomahalloffame.ng</span>
						</a>
						<a href="phone:+234(0)1234567890" className="flex items-center justify-center gap-2 no-underline!">
							<HugeiconsIcon icon={PhoneCall} strokeWidth={2} className="size-4" />
							<span className="text-sm">+234 (0) 123 456 7890</span>
						</a>
						<p className="flex items-center justify-center gap-2 no-underline! underline-offset-0">
							<HugeiconsIcon icon={Location} strokeWidth={2} className="size-4" />
							<span className="text-sm">Otukpo, Benue State, Nigeria</span>
						</p>
					</div>
				</div>
			</div>
			<div className="relative mx-auto w-full max-w-5xl px-4">
				<div className="relative grid grid-cols-1 border-x md:grid-cols-4 md:divide-x">
					<div>
						<SocialCard
							className="border-t-0"
							href="https://facebook.com/idomahalloffame"
							icon={<FacebookIcon />}
							title="Facebook"
						/>
						<LinksGroup
							links={[
								{ title: "Our story", href: "#" },
								{ title: "Mission & Values", href: "#" },
								{ title: "Board & Team", href: "#" },
								{ title: "Press Kit", href: "#" },
								// { title: "Blog", href: "#" },
							]}
							title="About Us"
						/>
					</div>
					<div>
						<SocialCard href="https://www.youtube.com/@IdomaHallOfFame" icon={<YoutubeIcon />} title="Youtube" />
						<LinksGroup
							links={[
								{ title: "Find Inductees", href: "#" },
								{ title: "By Year", href: "#" },
								{ title: "Categories", href: "#" },
								{ title: "Nomination Processes", href: "#" },
								// { title: "Cookie Policy", href: "#" },
							]}
							title="Inductees"
						/>
					</div>

					<div>
						<SocialCard href="https://x.com/idomahalloffame" icon={<XIcon />} title="Twitter" />
						<LinksGroup
							links={[
								{ title: "Physical Visit", href: "#" },
								{ title: "Buy Tickets", href: "#" },
								{ title: "Digital Archive", href: "#" },
								{ title: "FAQs", href: "#" },
							]}
							title="Museum"
						/>
					</div>
					<div>
						<SocialCard href="https://instagram.com/idomahalloffame" icon={<InstagramIcon />} title="Instagram" />
						<LinksGroup
							links={[
								{ title: "Donate", href: "#" },
								{ title: "Sponsor", href: "#" },
								{ title: "Volunteer", href: "#" },
								{ title: "Partners", href: "#" },
							]}
							title="Support"
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-center border-t p-3">
				<p className="text-muted-foreground text-xs">
					&copy; {new Date().getFullYear()} Idoma Hall of Fame, All rights reserved | Founded by Engr. Agaba Ikwue (FNSE)
				</p>
			</div>
		</footer>
	);
}

type LinksGroupProps = {
	title: string;
	links: { title: string; href: string }[];
};
function LinksGroup({ title, links }: LinksGroupProps) {
	return (
		<div className="p-2">
			<h3 className="mt-2 mb-3 font-light text-sm! text-muted-foreground uppercase tracking-wider">
				{title}
			</h3>
			<ul>
				{links.map((link) => (
					<li key={link.title}>
						<a
							className="text-muted-foreground text-sm hover:text-foreground"
							href={link.href}
						>
							{link.title}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

function SocialCard({
	title,
	href,
	className,
	icon,
}: React.ComponentProps<"a"> & {
	title: string;
	icon?: React.ReactNode;
}) {
	return (
		<a
			className={cn(
				"flex items-center justify-between border-y p-2 text-sm hover:bg-muted md:border-t-0 dark:hover:bg-muted/50",
				className
			)}
			href={href}
			target="_blank"
		>
			<span className="flex items-center gap-2 font-medium [&>svg]:size-3.5 [&>svg]:shrink-0">
				{icon}
				{title}
			</span>
			<HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2} className="size-4" />
		</a>
	);
}


function Subscribe() {
	const [email, setEmail] = useState("")
	const subscribe = useSubscribeToNewsletter()
	const success = subscribe.data?.ok === true
	const error =
		subscribe.data?.ok === false
			? subscribe.data.error
			: subscribe.error
				? "Something went wrong. Please try again."
				: null

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault()
		if (!email.trim() || subscribe.isPending) return

		const result = await subscribe.mutateAsync(email)
		if (result.ok) {
			setEmail("")
		}
	}

	return (
		<div className="grid gap-3">
			<h4 className="font-bold! text-2xl m-0! text-red-500">Stay connected</h4>
			<p className="text-balance max-w-sm leading-tight">Subscribe to our newsletter for updates on events, new inductees, and cultural programs.</p>
			{success ? (
				<p className="text-sm font-medium text-foreground" role="status">
					Thank you! Your subscription has been confirmed.
				</p>
			) : (
				<form onSubmit={handleSubmit} className="grid gap-2">
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
							<InputGroupButton variant="ghost" size="sm" type="submit" disabled={subscribe.isPending}>
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
			)}
		</div>
	)
}
