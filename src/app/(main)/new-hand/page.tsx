'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { FormPot, FormPotAction, FormRound, FormSchema, Schema } from './formSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import CardGroupInput, { getDetails } from '@/components/CardGroupInput'
import { useEffect, useMemo, useState } from 'react'
import ActionInput from '@/components/ActionInput'
import { ActionSelector, AllPlayerStatus, PlayerStatus, validRound } from '@/lib/types'
import { handleNumberBlur, handleNumberChange, isZeroBet } from '@/lib/utils'
import TypographyH2 from '@/components/ui/typography/TypographyH2'
import { analyze } from './server'
import { useFormState, useFormStatus } from 'react-dom'
import { add } from 'date-fns'

const scrollToBottom = () => {
	setTimeout(() => {
		window.scrollTo({
			top: document.documentElement.scrollHeight,
			behavior: 'smooth',
		})
	}, 0)
}

const initialPot = {
	potIndex: 0,
	value: 0,
	winner: '',
}

const NewHand = () => {
	const form = useForm<Schema>({
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
			pots: [initialPot],
			rounds: [
				{
					cards: {
						player: 0,
						cards: [],
						evaluation: '',
						value: 0,
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
					],
					potActions: [],
					finalPots: [],
				},
				{
					cards: {
						player: 0,
						cards: [],
						evaluation: '',
						value: 0,
					},
					actions: [],
					potActions: [],
					finalPots: [],
				},
				{
					cards: {
						player: 0,
						cards: [],
						evaluation: '',
						value: 0,
					},
					actions: [],
					potActions: [],
					finalPots: [],
				},
				{
					cards: {
						player: 0,
						cards: [],
						evaluation: '',
						value: 0,
					},
					actions: [],
					potActions: [],
					finalPots: [],
				},
			],
			villains: [],
		},
	})

	const {
		control,
		getValues,
		setValue,
		formState: { errors },
		watch,
		trigger,
	} = form

	const initialState = {
		analysis: '',
		error: '',
	}

	const [state, formAction] = useFormState(analyze, initialState)

	const methods = useForm()

	const [currentRound, setCurrentRound] = useState(-1)
	const [playerStatusHistory, setPlayerStatusHistory] = useState<AllPlayerStatus[]>([])
	const playerStatus = playerStatusHistory.at(-1) ?? {}

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

	const {
		fields: villainFields,
		append: appendVillains,
		remove: removeVillains,
	} = useFieldArray({
		control,
		name: 'villains',
	})

	const startingAction = currentRound > 0 ? 0 : 2
	const playerCount = Number(watch('playerCount'))
	const position = Number(watch('position'))
	const smallBlind = watch('smallBlind')
	const bigBlind = watch('bigBlind')
	const currentEval = watch(`rounds.${currentRound}.cards.evaluation`)
	const currentActionIndex = watch(`rounds.${currentRound}.actions`)?.length - 1
	const currentAction = watch(`rounds.${currentRound}.actions.${currentActionIndex}`)
	const isBigBlindAction = currentRound === 0 && currentActionIndex === startingAction - 1
	const isActionShowing = currentAction && !isBigBlindAction && villainFields.length === 0
	const decisionComplete = ['fold', 'check'].includes(currentAction?.decision) || currentAction?.bet > 0
	const isCardGroupShowing = fieldArrays[currentRound]?.fields?.length === startingAction
	const pots = watch('pots')
	const rounds = watch('rounds')
	const villains = watch('villains')

	const activePlayers = Object.entries(playerStatus).filter(([_, status]) => status !== 'folded')
	const showSubmit = activePlayers.length === 1 || villainFields.length > 0
	const villainsCompleted =
		villains.length > 0 && villains.every(villain => villain.evaluation !== '' && villain.value > 0)

	const disableNext =
		currentRound === -1
			? !playerCount || !position || !smallBlind || !bigBlind
			: currentEval === '' ||
			  currentEval.includes('Invalid Hand') ||
			  currentEval.includes('Error') ||
			  (isActionShowing && !decisionComplete)

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
	}, [bigBlind, setValue])

	useEffect(() => {
		if (!playerCount) return

		const properties = Array.from({ length: playerCount }, _ => 'active')
		const initialStatus: AllPlayerStatus = Object.assign({}, ...properties.map((prop, i) => ({ [i + 1]: prop })), {
			2: 'current',
		})

		setPlayerStatusHistory([initialStatus])
	}, [playerCount])

	useEffect(() => {
		if (activePlayers.length === 1) {
			const winner = activePlayers[0][0]
			const newPots = pots.map(pot => ({ ...pot, winner }))
			setValue('pots', newPots)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activePlayers.length, setValue])

	const getPlayerPots = (player: number) => {
		const potsAllRounds: number[] = []
		rounds.forEach(round => {
			const pots = round.potActions
				.filter(potAction => potAction.player === player)
				.map(potAction => potAction.potIndex)
			potsAllRounds.push(...pots)
		})
		return Array.from(new Set(potsAllRounds))
	}

	useEffect(() => {
		if (villainsCompleted) {
			console.log('villainsCompleted')
			const evalMap = new Map<number, number[]>()
			evalMap.set(watch('rounds.3.cards.value'), [position])
			villains.forEach(villain => {
				if (evalMap.has(villain.value)) {
					const existing = evalMap.get(villain.value) ?? []
					evalMap.set(villain.value, [...existing, villain.player])
				} else {
					evalMap.set(villain.value, [villain.player])
				}
			})

			let potProgress = pots.map(pot => pot.potIndex)
			const potWinners: { [key: number]: number[] } = {}
			const sortedArray = Array.from(evalMap).sort((a, b) => b[0] - a[0])

			for (const [_, players] of sortedArray) {
				if (potProgress.length === 0) {
					break
				}

				players.forEach(player => {
					const playerPots = getPlayerPots(player)
					const remainingPots = playerPots.filter(pot => potProgress.includes(pot))

					remainingPots.forEach(potIndex => {
						if (potWinners[potIndex] === undefined) {
							potWinners[potIndex] = [player]
						} else {
							potWinners[potIndex].push(player)
						}
					})
				})

				const wonPots = Object.keys(potWinners).map(Number)
				potProgress = potProgress.filter(pot => !wonPots.includes(pot))
			}

			Object.entries(potWinners).forEach(([potIndex, winners]) => {
				const pot = pots.find(pot => pot.potIndex === Number(potIndex))
				if (pot) {
					setValue(`pots.${pot.potIndex}.winner`, winners.map(winner => winner.toString()).join(','))
				}
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [villainsCompleted, JSON.stringify(villains), watch])

	const currentRoundBetterCount = useMemo(() => {
		return (
			playerCount -
			fieldArrays
				.slice(0, currentRound)
				.flatMap(fa => fa.fields)
				.filter(action => ['fold', 'betAllIn', 'callAllIn'].includes(action.decision)).length
		)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [playerCount, currentRound])

	const addAction = async (round: validRound) => {
		const selector = `rounds.${round}.actions` as ActionSelector
		const actions = getValues(selector)
		const lastAction = actions[actions.length - 1]
		const currentPlayer = Number(Object.entries(playerStatus).find(([_, status]) => status === 'current')?.[0])
		if (!currentPlayer) return

		let nextPlayer = currentPlayer
		let nextStatus = {}

		if (actions.length === 0) {
			nextPlayer = Math.min(...activePlayers.map(([player]) => Number(player)))
			nextStatus = {
				...playerStatus,
				[currentPlayer]: 'active',
				[nextPlayer]: 'current',
			}
		} else {
			const valid = await trigger(`${selector}.${actions.length - 1}.bet`)
			if (!valid) return

			do {
				nextPlayer++
				if (nextPlayer > playerCount) {
					nextPlayer = 1
				}
			} while (playerStatus[nextPlayer] === 'folded')

			let updatedStatus = ''
			switch (lastAction.decision) {
				case 'fold':
					updatedStatus = 'folded'
					break
				case 'betAllIn':
				case 'callAllIn':
					updatedStatus = 'all-in'
					break
				default:
					updatedStatus = 'active'
			}

			nextStatus = {
				...playerStatus,
				[currentPlayer]: updatedStatus as PlayerStatus,
				[nextPlayer]: 'current',
			}
		}

		setPlayerStatusHistory([...playerStatusHistory, nextStatus])

		if (activePlayers.length === 2 && lastAction?.decision === 'fold') {
			return
		}

		fieldArrays[round].append({
			player: nextPlayer,
			decision: '',
			bet: 0,
		})
	}

	const getPotActions = (round: FormRound) => {
		const actions = round.actions

		const playerBets: { [player: number]: number } = {}
		actions
			.filter(action => action.decision !== 'fold')
			.forEach(action => {
				const { player, bet } = action
				if (playerBets[player] === undefined) {
					playerBets[player] = 0
				}
				playerBets[player] += Number(bet)
			})

		// if all bets are zero, no potActions
		const entries = Object.entries(playerBets)
		if (entries.every(([_, bet]) => bet === 0)) {
			return []
		}

		// if all aggregate bets are the same, potActions for one pot
		let potIndex = Math.max(...pots.map(pot => pot.potIndex))
		if (entries.every(([_, bet]) => bet === entries[0][1])) {
			return entries.map(
				([player, bet]) =>
					({
						potIndex,
						player: parseInt(player),
						bet,
					} as FormPotAction)
			)
		}

		// if not, potActions for side pots
		const sortedEntries = entries.toSorted((a, b) => a[1] - b[1])
		let entryProgress = [...sortedEntries]
		let result: FormPotAction[] = []

		while (entryProgress.length > 0) {
			const currentLowestBet = entryProgress[0][1]
			result.push(
				...entryProgress.map(
					([player, _]) =>
						({
							potIndex,
							player: parseInt(player),
							bet: currentLowestBet,
						} as FormPotAction)
				)
			)

			entryProgress = entryProgress
				.map(([player, bet]) => [player, bet - currentLowestBet] as [string, number])
				.filter(([_, bet]) => bet > 0)

			if (entryProgress.length === 0) {
				break
			}

			potIndex++
		}

		return result
	}

	const getNewPots = () => {
		const potActions = getPotActions(watch(`rounds.${currentRound}`))

		if (currentRound >= 0) {
			setValue(`rounds.${currentRound}.potActions`, potActions)
		}

		const betsByPot = potActions.reduce((acc, { potIndex, bet }) => {
			if (acc[potIndex] === undefined) {
				acc[potIndex] = 0
			}
			acc[potIndex] += bet
			return acc
		}, {} as { [potIndex: number]: number })

		const finalPots = [...pots]

		Object.entries(betsByPot).forEach(([potIndexString, addedValue]) => {
			const potIndex = Number(potIndexString)
			const pot = pots[potIndex]
			const value = pot?.value ?? 0
			const newPot = {
				potIndex,
				value: value + addedValue,
				winner: '',
			}

			if (potIndex >= finalPots.length) {
				finalPots.push(newPot)
			} else {
				finalPots[potIndex] = newPot
			}
		})

		setValue(`rounds.${currentRound}.finalPots`, finalPots)
		setValue('pots', finalPots)
	}

	const nextRound = () => {
		getNewPots()

		if (currentRound === 3) {
			const villainFormData = Object.entries(playerStatus)
				.filter(([player, status]) => status !== 'folded' && player !== position.toString())
				.map(([player]) => ({
					player: Number(player),
					cards: [],
					evaluation: '',
					value: 0,
				}))

			appendVillains(villainFormData)
			return
		}

		setCurrentRound(currentRound + 1)
	}

	const handleNext = () => {
		scrollToBottom()

		if (currentRound === -1) {
			setCurrentRound(0)
			return
		}

		const selector = `rounds.${currentRound}.actions` as ActionSelector
		const actions = getValues(selector)
		if (actions.length === startingAction) {
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

		const decisionCount = actions.slice(startingAction)

		if (playerBetSums.every((bet, _, arr) => bet === arr[0]) && decisionCount.length >= currentRoundBetterCount) {
			nextRound()
		} else {
			addAction(currentRound as validRound)
		}
	}

	const handleBack = () => {
		if (isActionShowing) {
			if (!showSubmit) {
				fieldArrays[currentRound].remove(-1)
			}

			if (playerStatusHistory.length === 1) return
			setPlayerStatusHistory(playerStatusHistory.slice(0, -1))
		} else if (isCardGroupShowing) {
			setValue(`rounds.${currentRound}.cards.cards`, [])
			setValue(`rounds.${currentRound}.cards.evaluation`, '')
			setValue(`rounds.${currentRound}.cards.value`, 0)

			if (currentRound > 0) {
				if (currentRound === 1) {
					setValue('pots', [initialPot])
				} else {
					setValue('pots', watch(`rounds.${currentRound - 2}.finalPots`))
				}
				setValue(`rounds.${currentRound - 1}.potActions`, [])
				setValue(`rounds.${currentRound - 1}.finalPots`, [])
			}

			setCurrentRound(currentRound - 1)
		} else if (villainFields.length > 0) {
			removeVillains()
		}
	}

	console.log(getValues())

	return (
		<main className='mt-24'>
			<div className='max-w-screen-sm mx-auto pb-16 px-4'>
				<TypographyH1 className='mb-8'>Add New Hand</TypographyH1>
				<FormProvider {...methods}>
					<Form {...form}>
						<form action={formAction} className='space-y-8'>
							<FormField
								control={control}
								name='name'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Title</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormDescription>
											Recommended - A short, descriptive title to help you remember the hand. For example, &quot;Big pot
											with aces&quot; or &quot;Bluff gone wrong vs aggressive player&quot;.
										</FormDescription>
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
												name={field.name}
												defaultValue={field.value.toString()}
												onValueChange={field.onChange}
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
										<FormLabel>
											Players dealt in this hand<span className='ml-2 text-pure-red'>*</span>
										</FormLabel>
										<input {...field} className='hidden' />
										<Select onValueChange={field.onChange} disabled={currentRound > -1}>
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
										<FormLabel>
											Your position relative to the small blind (1)<span className='ml-2 text-pure-red'>*</span>
										</FormLabel>
										<input {...field} className='hidden' />
										<Select onValueChange={field.onChange} disabled={currentRound > -1}>
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
									<FormItem className='w-1/2'>
										<FormLabel>
											Small Blind<span className='ml-2 text-pure-red'>*</span>
										</FormLabel>
										<input {...field} className='hidden' />
										<FormControl>
											<Input
												{...field}
												type='text'
												inputMode='numeric'
												onChange={e => handleNumberChange(e, field.onChange)}
												onBlur={e => handleNumberBlur(e, field.onChange)}
												disabled={currentRound > -1}
											/>
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
										<FormLabel>
											Big Blind<span className='ml-2 text-pure-red'>*</span>
										</FormLabel>
										<input {...field} className='hidden' />
										<FormControl className='w-1/2'>
											<Input
												{...field}
												type='text'
												inputMode='numeric'
												onChange={e => handleNumberChange(e, field.onChange)}
												onBlur={e => handleNumberBlur(e, field.onChange)}
												disabled={currentRound > -1}
											/>
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
										<input {...field} className='hidden' />
										<FormControl className='w-1/2'>
											<Input
												{...field}
												type='text'
												inputMode='numeric'
												onChange={e => handleNumberChange(e, field.onChange)}
												onBlur={e => handleNumberBlur(e, field.onChange)}
												disabled={currentRound > -1}
											/>
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
										<input {...field} className='hidden' />
										<FormControl className='w-1/2'>
											<Input
												{...field}
												type='text'
												inputMode='numeric'
												onChange={e => handleNumberChange(e, field.onChange)}
												onBlur={e => handleNumberBlur(e, field.onChange)}
												disabled={currentRound > -1}
											/>
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
										<input {...field} className='hidden' />
										<FormControl className='w-1/2'>
											<Input
												{...field}
												type='text'
												inputMode='numeric'
												onChange={e => handleNumberChange(e, field.onChange)}
												onBlur={e => handleNumberBlur(e, field.onChange)}
												disabled={currentRound > -1}
											/>
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
							<FormField
								control={control}
								name='pots'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<input {...field} value={JSON.stringify(field.value)} className='hidden' />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='rounds'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<input {...field} value={JSON.stringify(field.value)} className='hidden' />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={control}
								name='villains'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<input {...field} value={JSON.stringify(field.value)} className='hidden' />
										</FormControl>
									</FormItem>
								)}
							/>

							{currentRound >= 0 && (
								<>
									<TypographyH2>Hand Action</TypographyH2>

									<p>{`Player 1 bet ${smallBlind} as the small blind`}</p>
									<p>{`Player 2 bet ${bigBlind} as the big blind`}</p>
								</>
							)}

							{Array.from({ length: currentRound + 1 }, (_, i) => i).map((round, i) => {
								const startingActionMap = round === 0 ? 2 : 0
								const finalPots = watch(`rounds.${round}.finalPots`)
								return (
									<div key={i} className='flex flex-col gap-4'>
										<CardGroupInput
											groupSelector={`rounds.${round}.cards`}
											disabled={fieldArrays[round].fields.length !== startingActionMap}
										/>

										{fieldArrays[round].fields.slice(startingActionMap).map((action, index, arr) => (
											<ActionInput
												key={action.id}
												selector={`rounds.${round}.actions.${index + startingActionMap}`}
												player={action.player}
												disabled={
													round !== currentRound || index !== arr.length - 1 || villainFields.length > 0 || showSubmit
												}
											/>
										))}

										{activePlayers.length === 1 && (
											<p>{`Player ${activePlayers[0][0]} wins ${
												pots.reduce((acc, i) => acc + i.value, 0) +
												watch(`rounds.${round}.actions`).reduce((acc, i) => acc + Number(i.bet), 0)
											}`}</p>
										)}

										{finalPots.length > 0 &&
											finalPots.map((pot, i) => {
												const potName = i === 0 ? 'Main Pot' : `Side Pot ${i}`
												return <p key={i} className='text-lg'>{`${potName}: ${pot.value}`}</p>
											})}
									</div>
								)
							})}

							{villainFields.map((villain, i) => (
								<CardGroupInput key={villain.id} groupSelector={`villains.${i}`} player={villain.player} />
							))}

							{villainsCompleted && (
								<>
									<TypographyH2>Results</TypographyH2>
									{pots.map((pot, i) => {
										const winners = pot.winner
											.split(',')
											.map(winner => `Player ${winner}`)
											.join(', ')
										const verb = pot.winner.length > 1 ? 'split' : 'wins'
										const potName = i === 0 ? 'main pot' : `side pot ${i}`

										return <p key={i} className='text-lg'>{`${winners} ${verb} the ${potName}: ${pot.value}`}</p>
									})}
								</>
							)}

							<div className='flex gap-4'>
								<Button type='button' className='w-1/2 text-xl' onClick={handleBack} disabled={currentRound === -1}>
									Back
								</Button>
								{/* {showSubmit ? ( */}
								<Button type='submit' className='w-1/2 text-xl' disabled={!villainsCompleted}>
									Submit
								</Button>
								{/* ) : ( */}
								<Button type='button' className='w-1/2 text-xl' onClick={handleNext} disabled={disableNext}>
									Next
								</Button>
								{/* )} */}
							</div>

							{Object.keys(errors).length ? (
								<p className='text-red-500 mt-2'>Please resolve errors and try again</p>
							) : null}
							{state.error && <p className='text-red-500 mt-2'>{state.error}</p>}
						</form>
					</Form>
				</FormProvider>
			</div>
		</main>
	)
}

export default NewHand
