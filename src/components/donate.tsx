'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from '@/components/ui/field'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  ArrowUpRightIcon,
  ChartLineIcon,
  CheckIcon,
  CodeIcon,
  DatabaseIcon,
  LockIcon,
  RepeatIcon,
  SettingsIcon,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import PaystackButton from './PaystackButton'

const animVariant: Variants = {
  initial: { opacity: 0, y: 10, filter: 'blur(4px)', scale: 0.98 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    scale: 1,
    transition: {
      delay: i * 0.03,
      type: 'spring',
      damping: 22,
      stiffness: 280,
    },
  }),
  exit: {
    opacity: 0,
    y: -10,
    filter: 'blur(4px)',
    scale: 0.98,
    transition: { duration: 0.14 },
  },
}

type FeatureToggle = {
  id: string
  label: string
  icon?: React.ReactNode
  price: number
  enabled: boolean
}

const defaultFeatures: FeatureToggle[] = [
  {
    id: 'analytics',
    label: 'Analytics engine',
    icon: <ChartLineIcon className="size-4" />,
    price: 15,
    enabled: true,
  },
  {
    id: 'api',
    label: 'API gateway',
    icon: <CodeIcon className="size-4" />,
    price: 20,
    enabled: true,
  },
  {
    id: 'storage',
    label: 'Cloud storage (100 GB)',
    icon: <DatabaseIcon className="size-4" />,
    price: 10,
    enabled: false,
  },
  {
    id: 'automation',
    label: 'Workflow automation',
    icon: <RepeatIcon className="size-4" />,
    price: 25,
    enabled: false,
  },
  {
    id: 'security',
    label: 'Advanced security',
    icon: <LockIcon className="size-4" />,
    price: 30,
    enabled: false,
  },
  {
    id: 'custom',
    label: 'Custom integrations',
    icon: <SettingsIcon className="size-4" />,
    price: 20,
    enabled: false,
  },
]

const includedFeatures = [
  'Unlimited team members',
  'Core dashboard access',
  'Email support',
  '5 GB base storage',
]

export function Donate() {
	const [totalPrice, setTotalPrice] = useState(5000)
  const [currentTab, setCurrentTab] = useState('monthly')

	const priceChars = totalPrice.toLocaleString().toString().split('')

	useEffect(() => {
		if (currentTab === "one-time") {
			setTotalPrice(10000)
		}
	}, [currentTab, setTotalPrice])

  return (
    <section aria-label="Donation" className="mx-auto w-full max-w-4xl">
      <div className="flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-4xl font-bold! tracking-tight text-foreground sm:text-5xl m-0!">
            Ways to support
          </h2>
          <p className="max-w-2xl text-lg text-muted-foreground">
            Choose the support option that works best for you and your organization
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4">
          <div className="flex flex-col gap-6 rounded-4xl bg-muted p-5 sm:p-8">
						<Tabs defaultValue="account" className="w-full" value={currentTab} onValueChange={(value, event) => {
							console.log(`Value changed and updated`, { value });
							setCurrentTab(value)
            }}>
              <TabsList className="w-full overflow-x-auto md:overflow-visible">
                <TabsTrigger className="min-w-max md:min-w-0 selection:text-red-500" value="monthly">
                  Monthly Donation
                </TabsTrigger>
                <TabsTrigger className="min-w-max md:min-w-0" value="one-time">
                  One-Time Donation
                </TabsTrigger>
                <TabsTrigger className="min-w-max md:min-w-0" value="cooperate" disabled>
                  Cooperate Sponsor
                </TabsTrigger>
              </TabsList>
              <TabsContent value="monthly">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-medium text-foreground">
                    Provide ongoing support with a monthly contribution that helps sustain our
                    programs and initiatives.
                  </h3>
                  <p className="text-sm text-muted-foreground">Selected plan amount</p>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-semibold tracking-tight text-foreground">₦</span>
                    <AnimatePresence mode="popLayout">
                      {priceChars.map((char, idx) => (
                        <motion.span
                          key={`${totalPrice}-${char}-${idx}`}
                          variants={animVariant}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          custom={idx}
                          className="inline-block text-7xl font-semibold tracking-tight text-foreground"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    <span key="period" className="text-xl text-muted-foreground">
                      /month
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-6 my-6">
                  <MonthlyDonateAmountPicker
                    amounts={[5000, 10000, 25000]}
                    onAmountChange={(amount) => {
                      setTotalPrice(amount)
                      console.log(`Selected amount`, { amount })
                    }}
                  />
                </div>
                <PaystackButton inputAmount={totalPrice} customerEmail='knightjimmy@gmail.com' />
              </TabsContent>
              <TabsContent value="one-time">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-medium text-foreground">
                    Make a single contribution to support specific projects or general operations.
                  </h3>
                  <p className="text-sm text-muted-foreground">Selected plan amount</p>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-semibold tracking-tight text-foreground">₦</span>
                    <AnimatePresence mode="popLayout">
                      {priceChars.map((char, idx) => (
                        <motion.span
                          key={`${totalPrice}-${char}-${idx}`}
                          variants={animVariant}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          custom={idx}
                          className="inline-block text-7xl font-semibold tracking-tight text-foreground"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    <span key="period" className="text-xl text-muted-foreground">
                      /month
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-6 my-6">
                  <MonthlyDonateAmountPicker
                    amounts={[10000, 50000, 100000]}
                    onAmountChange={(amount) => {
                      setTotalPrice(amount)
                      console.log(`Selected amount`, { amount })
                    }}
                  />
                </div>
                <PaystackButton inputAmount={totalPrice} customerEmail='knightjimmy@gmail.com' />
              </TabsContent>
              <TabsContent value="cooperate">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-medium text-foreground">
                    Make a single contribution to support specific projects or general operations.
                  </h3>
                  <p className="text-sm text-muted-foreground">Selected plan amount</p>
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-7xl font-semibold tracking-tight text-foreground">₦</span>
                    <AnimatePresence mode="popLayout">
                      {priceChars.map((char, idx) => (
                        <motion.span
                          key={`${totalPrice}-${char}-${idx}`}
                          variants={animVariant}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          custom={idx}
                          className="inline-block text-7xl font-semibold tracking-tight text-foreground"
                        >
                          {char}
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    <span key="period" className="text-xl text-muted-foreground">
                      /month
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-3 py-6 my-6">
                  <MonthlyDonateAmountPicker
                    amounts={[10000, 50000, 100000]}
                    onAmountChange={(amount) => {
                      setTotalPrice(amount)
                      console.log(`Selected amount`, { amount })
                    }}
                  />
                </div>
                <PaystackButton inputAmount={totalPrice} customerEmail='knightjimmy@gmail.com' />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  )
}

interface IDonateAmountPockerProps {
  amounts: number[]
  onAmountChange: (amount: number) => void
}
function MonthlyDonateAmountPicker({ amounts, onAmountChange }: IDonateAmountPockerProps) {
  const [customAmount, setCustomAmount] = useState(0)

  useEffect(() => {
    if (customAmount > 0) {
      onAmountChange(customAmount)
    }
  }, [customAmount, onAmountChange])

  return (
    <RadioGroup
      defaultValue={amounts[0].toString()}
      className="max-w-sm"
      onValueChange={(value) => {
        if (value === 'custom') {
          console.log(`Custom value`, { value })
          return
        }
        onAmountChange(Number(value))
        console.log(`Value control`, { value })
      }}
    >
      {amounts.map((amount) => (
        <FieldLabel key={amount} htmlFor={amount.toString()}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>₦{amount.toLocaleString()}</FieldTitle>
              {/*<FieldDescription>For individuals and small teams.</FieldDescription>*/}
            </FieldContent>
            <RadioGroupItem value={amount.toString()} id={amount.toString()} />
          </Field>
        </FieldLabel>
      ))}
      <FieldLabel htmlFor="custom">
        <Field orientation="horizontal">
          <FieldContent>
            <FieldTitle>Custom</FieldTitle>
            <Input
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.valueAsNumber)}
              placeholder="Enter custom amount"
              type="number"
            />
          </FieldContent>
          <RadioGroupItem value="custom" id="custom" />
        </Field>
      </FieldLabel>
    </RadioGroup>
  )
}

export default Donate
