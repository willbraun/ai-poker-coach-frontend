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
import { ActionSelector, PlayerStatus } from '@/lib/types'

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
	decision: z.number().gte(0).lte(6),
	bet: zodNumber,
})

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
	round0Cards: zodCardGroup,
	round0Actions: z.array(zodAction),
	round1Cards: zodCardGroup,
	round1Actions: z.array(zodAction),
	round2Cards: zodCardGroup,
	round2Actions: z.array(zodAction),
	round3Cards: zodCardGroup,
	round3Actions: z.array(zodAction),
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
			round0Cards: {
				player: 0,
				cards: [],
				evaluation: '',
			},
			round0Actions: [
				{
					player: 1,
					decision: 3,
					bet: 0,
				},
				{
					player: 2,
					decision: 3,
					bet: 0,
				},
				{
					player: 3,
					decision: 0,
					bet: 0,
				},
			],
			round1Cards: {
				player: 0,
				cards: [],
				evaluation: '',
			},
			round1Actions: [],
			round2Cards: {
				player: 0,
				cards: [],
				evaluation: '',
			},
			round2Actions: [],
			round3Cards: {
				player: 0,
				cards: [],
				evaluation: '',
			},
			round3Actions: [],
			villains: [],
		},
	})

	const [playerStatus, setPlayerStatus] = useState<{ [key: number]: PlayerStatus }>({})

	const {
		control,
		handleSubmit,
		getValues,
		setValue,
		getFieldState,
		formState: { errors },
		watch,
	} = form

	const round0ActionsFA = useFieldArray({
		control,
		name: 'round0Actions',
	})

	const round1ActionsFA = useFieldArray({
		control,
		name: 'round1Actions',
	})

	const round2ActionsFA = useFieldArray({
		control,
		name: 'round2Actions',
	})

	const round3ActionsFA = useFieldArray({
		control,
		name: 'round3Actions',
	})

	const fieldArrayMap = {
		round0Actions: round0ActionsFA,
		round1Actions: round1ActionsFA,
		round2Actions: round2ActionsFA,
		round3Actions: round3ActionsFA,
	}

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
		setValue('round0Cards.player', position)
		setValue('round1Cards.player', position)
		setValue('round2Cards.player', position)
		setValue('round3Cards.player', position)
	}, [position, setValue])

	useEffect(() => {
		setValue('round0Actions.0.bet', smallBlind ?? 0)
	}, [smallBlind, setValue])

	useEffect(() => {
		setValue('round0Actions.1.bet', bigBlind ?? 0)

		const underTheGun = playerCount === 2 ? 1 : 3
		setValue('round0Actions.2.player', underTheGun)
	}, [bigBlind, playerCount, setValue])

	const addAction = (selector: ActionSelector) => {
		const actions = fieldArrayMap[selector].fields
		const lastAction = actions.at(-1)
		if (!lastAction) return

		let nextPlayer = lastAction.player
		do {
			nextPlayer++
			if (nextPlayer > playerCount) {
				nextPlayer = 1
			}
		} while (playerStatus[nextPlayer] === 'folded')

		fieldArrayMap[selector].append({
			player: nextPlayer,
			decision: 0,
			bet: 0,
		})

		setPlayerStatus({
			...playerStatus,
			[lastAction.player]: lastAction.decision === 0 ? 'folded' : 'active',
			[nextPlayer]: 'current',
		})
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

							<CardGroupInput groupSelector={'round0Cards'} />

							<p>{`Player 1 bet ${smallBlind} as the small blind`}</p>
							<p>{`Player 2 bet ${bigBlind} as the big blind`}</p>

							{fieldArrayMap['round0Actions'].fields.slice(2).map((action, index) => (
								<ActionInput key={action.id} selector={`round0Actions.${index + 2}`} player={action.player} />
							))}

							<Button type='button' onClick={() => addAction('round0Actions')}>
								Next Action
							</Button>
							<Button type='button' onClick={() => console.log(getValues())}>
								console.log()
							</Button>

							<Button type='submit' className='w-full text-xl'>
								Submit
							</Button>
						</form>
						{Object.keys(errors).length ? (
							<p className='text-red-500 mt-2'>Please resolve errors and try again</p>
						) : null}
					</Form>
				</FormProvider>
			</div>
		</main>
	)
}

export default NewHand
