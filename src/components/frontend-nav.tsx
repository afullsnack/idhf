'use client'

import { Container, Main, Section } from './craft'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from './ui/navigation-menu'
import { Button } from './ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { HugeiconsIcon } from '@hugeicons/react'
import { ArrowRight01Icon, Menu01Icon } from '@hugeicons/core-free-icons'
import type { MouseEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const mainNavList = [
  {
    title: 'Inductees',
    href: '/inductees',
  },
  {
    title: 'Experience',
    href: '/experience',
  },
  {
    title: 'Events & Programs',
    href: '/events',
  },
  {
    title: 'Resources',
    href: '/resources',
  },
  {
    title: 'Blog',
    href: '/blog',
  },
]

export default function MainNavigation() {
  return (
    <Section className="m-0! p-0! flex! items-center! justify-center! w-full max-h-14">
      <Container className="m-0! px-0! p-0! flex items-center justify-between md:justify-center gap-12 mx-0! w-full h-full">
        <Logo />
        <header className="hidden max-w-max md:block">
          <NavigationMenu>
            <NavigationMenuList>
              {mainNavList.map((item) => (
                <MenuItem key={item.href} href={item.href} title={item.title} />
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </header>

        <div className="ml-4 hidden items-center gap-2 md:flex">
          <Button
            className="text-white! animate-none sm:animate-bounce"
            render={<Link href="/donation" className="text-white no-underline!" />}
            variant="default"
          >
            Donate
          </Button>
          <LoginButton />
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open menu"
                className="mr-2 text-foreground md:hidden"
              />
            }
          >
            <HugeiconsIcon icon={Menu01Icon} strokeWidth={2} />
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-3 flex flex-col">
              {mainNavList.map((item) => (
                <SheetClose
                  key={item.href}
                  render={
                    <Link
                      href={item.href}
                      className="rounded-2xl px-3 py-3.5 text-base font-medium text-foreground transition-colors no-underline hover:bg-muted dark:hover:bg-muted/50"
                    />
                  }
                >
                  {item.title}
                </SheetClose>
              ))}
            </nav>
            <SheetFooter className="border-t">
              <Button size="lg" className="w-full" render={<Link href="/donation" />}>
                Donate
                <span data-icon="inline-end">
                  <HugeiconsIcon icon={ArrowRight01Icon} strokeWidth={2.25} />
                </span>
              </Button>
              <LoginButton className="w-full" size="lg" />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Container>
    </Section>
  )
}

const adminRoute = '/admin'
const adminLoginRoute = '/admin/login'

interface ILoginButtonProps {
  className?: string
  size?: 'default' | 'lg'
}

function LoginButton({ className, size }: ILoginButtonProps) {
  const router = useRouter()

  const handleClick = async (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return
    }

    event.preventDefault()

    try {
      const response = await fetch('/api/users/me', {
        cache: 'no-store',
        credentials: 'include',
      })
      const result = response.ok ? ((await response.json()) as { user?: unknown }) : null

      router.replace(result?.user ? adminRoute : adminLoginRoute)
    } catch {
      router.replace(adminLoginRoute)
    }
  }

  return (
    <Button
      className={className}
      size={size}
      variant="outline"
      render={
        <Link
          href={adminLoginRoute}
          className="no-underline!"
          onClick={handleClick}
        />
      }
    >
      Login
    </Button>
  )
}

interface ILogoProps {}
export function Logo() {
  return (
    <Link href="/">
      <img src="/logo.png" className="size-16 object-contain" />
    </Link>
  )
}

interface IMenuItemProps {
  linkClassName?: string
  href: string
  title: string
}
const styles = navigationMenuTriggerStyle()
function MenuItem({ linkClassName, href, title }: IMenuItemProps) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink
        render={<Link href={href} className="no-underline" />}
        href={href}
        className={styles}
      >
        {title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  )
}
