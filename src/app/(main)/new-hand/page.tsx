'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import CardGroupInput from '@/components/CardGroupInput'
import { useEffect, useState } from 'react'
import ActionInput from '@/components/ActionInput'
import { ActionSelector, PlayerStatus, validRound } from '@/lib/types'
import { isZeroBet } from '@/lib/utils'

const atMostTwoDigitsAfterDecimal = (value: number) => {
	const stringValue = value.toString()
	const decimalIndex = stringValue.indexOf('.')

	if (decimalIndex === -1) {
		return true
	}

	const digitsAfterDecimal = stringValue.substring(decimalIndex + 1)

	return digitsAfterDecimal.length <= 2
}

const zodNumber = z.coerce
	.number()
	.gte(0)
	.refine(atMostTwoDigitsAfterDecimal, { message: 'Cannot have more than 2 digits after the decimal' })

const zodCardGroup = z.object({
	player: z.number().gte(0).lte(12),
	cards: z.array(
		z.object({
			value: z.enum(['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']),
			suit: z.enum(['C', 'D', 'H', 'S']),
		})
	),
	evaluation: z.string(),
})

const zodAction = z.object({
	player: z.number().gte(0).lte(12),
	decision: z.enum(['', 'fold', 'check', 'call', 'bet', 'raise', 'callAllIn', 'betAllIn']),
	bet: zodNumber,
})

const zodRound = z.object({
	cards: zodCardGroup,
	actions: z.array(zodAction),
})

export type FormRound = z.infer<typeof zodRound>

const FormSchema = z.object({
	name: z.string(),
	gameStyle: z.coerce.number().gte(0).lte(1),
	playerCount: z.coerce.number().gte(2).lte(12),
	position: z.coerce.number().gte(1).lte(12),
	smallBlind: zodNumber,
	bigBlind: zodNumber,
	ante: zodNumber,
	bigBlindAnte: zodNumber,
	myStack: zodNumber,
	notes: z.string().optional(),
	rounds: z.array(zodRound),
	villains: z.array(zodCardGroup),
})

const NewHand = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: '',
			gameStyle: 0,
			playerCount: 0,
			position: 0,
			smallBlind: 0,
			bigBlind: 0,
			ante: 0,
			bigBlindAnte: 0,
			myStack: 0,
			notes: '',
			rounds: [
				{
					cards: {
						player: 0,
						cards: [],
						evaluation: '',
					},
					actions: [
						{
							player: 1,
							decision: 'bet',
							bet: 0,
						},
						{
							player: 2,
							decision: 'bet',
							bet: 0,
						},
						{
							player: 3,
							decision: '',
							bet: 0,
						},
					],
				},
				{
					cards: {
						player: 0,
						cards: [],
						evaluation: '',
					},
					actions: [],
				},
				{
					cards: {
						player: 0,
						cards: [],
						evaluation: '',
					},
					actions: [],
				},
				{
					cards: {
						player: 0,
						cards: [],
						evaluation: '',
					},
					actions: [],
				},
			],
			villains: [],
		},
	})

	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		formState: { errors },
		watch,
		trigger,
	} = form

	const [currentRound, setCurrentRound] = useState(0)
	const [playerStatus, setPlayerStatus] = useState<{ [key: number]: PlayerStatus }>({})
	const [startingPlayers, setStartingPlayers] = useState<number[]>([])
	const [nextDisabled, setNextDisabled] = useState(false)
	const [showSubmit, setShowSubmit] = useState(false)

	const round0ActionsFA = useFieldArray({
		control,
		name: 'rounds.0.actions',
	})

	const round1ActionsFA = useFieldArray({
		control,
		name: 'rounds.1.actions',
	})

	const round2ActionsFA = useFieldArray({
		control,
		name: 'rounds.2.actions',
	})

	const round3ActionsFA = useFieldArray({
		control,
		name: 'rounds.3.actions',
	})

	const fieldArrays = [round0ActionsFA, round1ActionsFA, round2ActionsFA, round3ActionsFA]

	const methods = useForm()

	const smallBlind = watch('smallBlind')
	const bigBlind = watch('bigBlind')
	const playerCount = Number(watch('playerCount'))
	const position = Number(watch('position'))

	const positionLabels = new Map<number, string>([
		[1, 'small blind'],
		[2, 'big blind'],
	])

	if (playerCount > 2) {
		positionLabels.set(playerCount, 'button')
	}
	if (playerCount > 3) {
		positionLabels.set(playerCount - 1, 'cutoff')
	}

	useEffect(() => {
		setValue('rounds.0.cards.player', position)
		setValue('rounds.1.cards.player', position)
		setValue('rounds.2.cards.player', position)
		setValue('rounds.3.cards.player', position)
	}, [position, setValue])

	useEffect(() => {
		setValue('rounds.0.actions.0.bet', smallBlind ?? 0)
	}, [smallBlind, setValue])

	useEffect(() => {
		setValue('rounds.0.actions.1.bet', bigBlind ?? 0)

		const underTheGun = playerCount === 2 ? 1 : 3
		setValue('rounds.0.actions.2.player', underTheGun)

		const properties = Array.from({ length: playerCount }, _ => 'active')
		const initialStatus = Object.assign({}, ...properties.map((prop, i) => ({ [i + 1]: prop })))
		setPlayerStatus({ ...initialStatus, [underTheGun]: 'current' })
		setStartingPlayers([playerCount])
	}, [bigBlind, playerCount, setValue])

	const scrollToBottom = () => {
		setTimeout(() => {
			window.scrollTo({
				top: document.documentElement.scrollHeight,
				behavior: 'smooth',
			})
		}, 0)
	}

	const getActivePlayers = () => Object.entries(playerStatus).filter(([_, status]) => status !== 'folded')

	const addAction = async (round: validRound) => {
		const selector = `rounds.${round}.actions` as ActionSelector
		const actions = getValues(selector)
		const currentPlayer = Number(Object.entries(playerStatus).find(([_, status]) => status === 'current')?.[0])
		if (!currentPlayer) return

		let nextPlayer = currentPlayer

		if (actions.length === 0) {
			const activePlayers = getActivePlayers()
			nextPlayer = Math.min(...activePlayers.map(([player]) => Number(player)))

			setPlayerStatus({
				...playerStatus,
				[currentPlayer]: 'active',
				[nextPlayer]: 'current',
			})
		} else {
			const lastAction = actions[actions.length - 1]
			const valid = await trigger(`${selector}.${actions.length - 1}.bet`)
			if (!valid) return

			do {
				nextPlayer++
				if (nextPlayer > playerCount) {
					nextPlayer = 1
				}
			} while (playerStatus[nextPlayer] === 'folded')

			let newStatus = ''
			switch (lastAction.decision) {
				case 'fold':
					newStatus = 'folded'
					break
				case 'betAllIn':
				case 'callAllIn':
					newStatus = 'all-in'
					break
				default:
					newStatus = 'active'
			}

			setPlayerStatus({
				...playerStatus,
				[currentPlayer]: newStatus as PlayerStatus,
				[nextPlayer]: 'current',
			})
		}

		fieldArrays[round].append({
			player: nextPlayer,
			decision: '',
			bet: 0,
		})

		scrollToBottom()
	}

	const nextRound = () => {
		if (currentRound === 3) {
			return
		}
		const nextRound = currentRound + 1
		const activePlayerCount = getActivePlayers().length

		setStartingPlayers([...startingPlayers, activePlayerCount])
		setCurrentRound(nextRound)
		scrollToBottom()
	}

	const handleNext = () => {
		const selector = `rounds.${currentRound}.actions` as ActionSelector
		const actions = getValues(selector)
		if (actions.length === 0) {
			addAction(currentRound as validRound)
			return
		}

		const bettingPlayers = Object.entries(playerStatus)
			.filter(([_, status]) => ['active', 'current'].includes(status))
			.map(([player]) => Number(player))

		const playerBetSums = bettingPlayers.map(player => {
			return actions
				.filter(action => action.player === player)
				.map(action => Number(action.bet))
				.reduce((a, b) => a + b, 0)
		})

		const decisionCount = actions.slice(currentRound === 0 ? 2 : 0)

		if (playerBetSums.every((bet, _, arr) => bet === arr[0]) && decisionCount.length >= startingPlayers[currentRound]) {
			nextRound()
		} else {
			addAction(currentRound as validRound)
		}
	}

	const isNextDisabled = (selector: ActionSelector) => {
		const actions = getValues(selector)
		const lastAction = actions.at(-1)
		if (!lastAction?.decision) {
			return true
		}

		if (isZeroBet(lastAction.decision)) {
			return false
		} else {
			return Number(lastAction?.bet) === 0
		}
	}

	return (
		<main className='mt-24'>
			<div className='max-w-screen-sm mx-auto pb-16 px-4'>
				<TypographyH1 className='mb-8'>Add New Hand</TypographyH1>
				<FormProvider {...methods}>
					<Form {...form}>
						<form onSubmit={handleSubmit(data => console.log(data))} className='space-y-8'>
							<FormField
								control={control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='gameStyle'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Game Style</FormLabel>
										<FormControl>
											<RadioGroup
												onValueChange={field.onChange}
												defaultValue={field.value.toString()}
												className='flex flex-col space-y-1'
											>
												<FormItem className='flex items-center space-x-3 space-y-0'>
													<FormControl>
														<RadioGroupItem value='0' />
													</FormControl>
													<p className='font-normal'>Tournament</p>
												</FormItem>
												<FormItem className='flex items-center space-x-3 space-y-0'>
													<FormControl>
														<RadioGroupItem value='1' />
													</FormControl>
													<p className='font-normal'>Cash Game</p>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='playerCount'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Players dealt in this hand</FormLabel>
										<Select onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className='w-1/2'>
													<SelectValue placeholder='Select a number' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value='2'>2</SelectItem>
												<SelectItem value='3'>3</SelectItem>
												<SelectItem value='4'>4</SelectItem>
												<SelectItem value='5'>5</SelectItem>
												<SelectItem value='6'>6</SelectItem>
												<SelectItem value='7'>7</SelectItem>
												<SelectItem value='8'>8</SelectItem>
												<SelectItem value='9'>9</SelectItem>
												<SelectItem value='10'>10</SelectItem>
												<SelectItem value='11'>11</SelectItem>
												<SelectItem value='12'>12</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='position'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Your position relative to the small blind (1)</FormLabel>
										<Select onValueChange={field.onChange}>
											<FormControl>
												<SelectTrigger className='w-1/2'>
													<SelectValue placeholder='Select a number' />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{Array.from({ length: playerCount }).map((_, i) => {
													const position = i + 1
													const label = positionLabels.get(position)
													return (
														<SelectItem key={`position_choice_${position}`} value={position.toString()}>
															{position}
															{label && ` (${label})`}
														</SelectItem>
													)
												})}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='smallBlind'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Small Blind</FormLabel>
										<FormControl className='w-1/2'>
											<Input {...field} type='number' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='bigBlind'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Big Blind</FormLabel>
										<FormControl className='w-1/2'>
											<Input {...field} type='number' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='ante'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Ante</FormLabel>
										<FormControl className='w-1/2'>
											<Input {...field} type='number' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='bigBlindAnte'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Big Blind Ante</FormLabel>
										<FormControl className='w-1/2'>
											<Input {...field} type='number' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='myStack'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Your stack size at the beginning of the hand</FormLabel>
										<FormControl className='w-1/2'>
											<Input {...field} type='number' />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='notes'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Notes</FormLabel>
										<FormControl>
											<Textarea {...field} />
										</FormControl>
										<FormDescription>
											Additional information outside of the hard facts to provide to the AI model. Include player
											styles, history, or simply set the stage for the hand.{' '}
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							{Array.from({ length: currentRound + 1 }, (_, i) => i).map((round, i) => {
								const startingAction = round === 0 ? 2 : 0
								return (
									<div key={i} className='flex flex-col gap-4'>
										<CardGroupInput groupSelector={`rounds.${round}.cards`} />

										{round === 0 && (
											<>
												<p>{`Player 1 bet ${smallBlind} as the small blind`}</p>
												<p>{`Player 2 bet ${bigBlind} as the big blind`}</p>
											</>
										)}

										{fieldArrays[round].fields.slice(startingAction).map((action, index) => (
											<ActionInput
												key={action.id}
												selector={`rounds.${round}.actions.${index + startingAction}`}
												player={action.player}
											/>
										))}
									</div>
								)
							})}
							<Button type='button' className='mt-8 w-full' onClick={handleNext} disabled={nextDisabled}>
								Next
							</Button>

							{showSubmit && (
								<Button type='submit' className='w-full text-xl mt-32'>
									Submit
								</Button>
							)}
							{Object.keys(errors).length ? (
								<p className='text-red-500 mt-2'>Please resolve errors and try again</p>
							) : null}
						</form>
					</Form>
				</FormProvider>
			</div>
		</main>
	)
}

export default NewHand
