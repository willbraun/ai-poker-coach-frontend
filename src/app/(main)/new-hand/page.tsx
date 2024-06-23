'use client'

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { FormPotAction, FormRound, FormSchema, Schema } from './formSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import CardGroupInput from '@/components/CardGroupInput'
import { FC, useEffect, useMemo, useState } from 'react'
import ActionInput from '@/components/ActionInput'
import { ActionSelector, PlayerStatus, SinglePlayerStatus } from '@/lib/types'
import { getPlayerBetSums, getPlayersBettingFull, handleNumberBlur, handleNumberChange } from '@/lib/utils'
import TypographyH2 from '@/components/ui/typography/TypographyH2'
import { analyze } from './server'
import { useFormState, useFormStatus } from 'react-dom'
import Analysis from '@/components/Analysis'
import Link from 'next/link'
import Image from 'next/image'
import pokerChip from '@/lib/images/icons/poker_chip.svg'

const scrollToTop = () => {
	setTimeout(() => {
		window.scrollTo({
			top: 0,
		})
	}, 0)
}

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

interface SubmitProps {
	setPending: (pending: boolean) => void
	disabled: boolean
}

const Submit: FC<SubmitProps> = ({ setPending, disabled }) => {
	const { pending } = useFormStatus()
	useEffect(() => {
		setPending(pending)
	}, [pending, setPending])

	return (
		<Button type='submit' className='w-1/2 text-xl' disabled={disabled || pending} onClick={scrollToBottom}>
			{pending ? 'Analyzing...' : 'Submit'}
		</Button>
	)
}

const NewHand: FC = () => {
	useEffect(() => {
		scrollToTop()
	}, [])

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
		handId: '',
		error: '',
	}

	const [state, formAction] = useFormState(analyze, initialState)
	const [pending, setPending] = useState(false)

	const methods = useForm()

	const [currentRound, setCurrentRound] = useState(-1)
	const [playerStatusHistory, setPlayerStatusHistory] = useState<PlayerStatus[]>([])
	const [playerStatus, setPlayerStatus] = useState<PlayerStatus>({})

	useEffect(() => {
		setPlayerStatus(playerStatusHistory.at(-1) ?? {})
	}, [playerStatusHistory])

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

	const { append: appendVillains, remove: removeVillains } = useFieldArray({
		control,
		name: 'villains',
	})

	const startingAction = currentRound > 0 ? 0 : 2
	const playerCount = Number(watch('playerCount'))
	const position = Number(watch('position'))
	const smallBlind = Number(watch('smallBlind'))
	const bigBlind = Number(watch('bigBlind'))
	const ante = Number(watch('ante'))
	const bigBlindAnte = Number(watch('bigBlindAnte'))
	const pots = watch('pots')
	const rounds = watch('rounds')
	const villains = watch('villains')
	const currentEval = watch(`rounds.${currentRound}.cards.evaluation`)
	const currentActionIndex = watch(`rounds.${currentRound}.actions`)?.length - 1
	const currentAction = watch(`rounds.${currentRound}.actions.${currentActionIndex}`)
	const isBigBlindAction = currentRound === 0 && currentActionIndex === startingAction - 1
	const isActionShowing = currentAction && !isBigBlindAction && villains.length === 0
	const decisionComplete = ['fold', 'check'].includes(currentAction?.decision) || currentAction?.bet > 0
	const isCardGroupShowing = fieldArrays[currentRound]?.fields?.length === startingAction

	const getActivePlayers = (status: PlayerStatus) => {
		return Object.entries(status)
			.filter(([_, status]) => status !== 'folded')
			.map(([player]) => Number(player))
	}

	const activePlayers = getActivePlayers(playerStatus)
	const villainsCompleted =
		villains.length > 0 && villains.every(villain => villain.evaluation !== '' && villain.value > 0)
	const showSubmit = activePlayers.length === 1 || villainsCompleted

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
	}, [position, setValue])

	useEffect(() => {
		setValue('rounds.0.actions.0.bet', smallBlind ?? 0)
	}, [smallBlind, setValue])

	useEffect(() => {
		setValue('rounds.0.actions.1.bet', bigBlind ?? 0)
	}, [bigBlind, setValue])

	useEffect(() => {
		setValue('pots.0.value', ante * playerCount + bigBlindAnte ?? 0)
	}, [ante, bigBlindAnte, playerCount, setValue])

	useEffect(() => {
		if (!playerCount) return

		const properties = Array.from({ length: playerCount }, _ => 'active')
		const initialStatus: PlayerStatus = Object.assign({}, ...properties.map((prop, i) => ({ [i + 1]: prop })), {
			2: 'current',
		})

		setPlayerStatusHistory([initialStatus])
	}, [playerCount])

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

	const setPotWinners = () => {
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

	useEffect(() => {
		if (villainsCompleted) {
			setPotWinners()
			scrollToBottom()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [villainsCompleted])

	const currentRoundStartingBetterCount =
		playerCount -
		rounds
			.slice(0, currentRound)
			.flatMap(round => round.actions)
			.filter(action => ['fold', 'betAllIn', 'callAllIn'].includes(action.decision)).length

	useEffect(() => {
		if (state.analysis) {
			scrollToBottom()
		}
	}, [state.analysis])

	const getCurrentPlayer = () => {
		return Number(Object.entries(playerStatus).find(([_, status]) => status === 'current')?.[0])
	}

	const getNextPlayer = () => {
		const currentPlayer = getCurrentPlayer()
		let nextPlayer = currentPlayer
		do {
			nextPlayer++
			if (nextPlayer > playerCount) {
				nextPlayer = 1
			}
		} while (['folded', 'all-in'].includes(playerStatus[nextPlayer]))

		return nextPlayer
	}

	const getNextPlayerStatus = (nextPlayer: number): PlayerStatus => {
		const currentPlayer = getCurrentPlayer()
		let updatedStatus = ''
		if (!currentAction) {
			return {
				...playerStatus,
				[currentPlayer]: 'active',
				[nextPlayer]: 'current',
			}
		}

		switch (currentAction.decision) {
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

		return {
			...playerStatus,
			[currentPlayer]: updatedStatus as SinglePlayerStatus,
			[nextPlayer]: 'current',
		}
	}

	const appendAction = async (player: number) => {
		fieldArrays[currentRound].append({
			player,
			decision: '',
			bet: 0,
		})
	}

	const getPotActions = (round: FormRound) => {
		const actions = round.actions
		const foldedPlayers = actions.filter(action => action.decision === 'fold').map(action => action.player)

		const playerBets: { [player: number]: number } = {}
		actions
			.filter(action => !foldedPlayers.includes(action.player))
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

		// if all aggregate bets for non-folded players are the same, potActions for one pot
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

	const handleNext = async () => {
		scrollToBottom()

		if (currentRound === -1) {
			setCurrentRound(0)
			return
		}

		const selector = `rounds.${currentRound}.actions` as ActionSelector
		const actions = getValues(selector)

		let nextPlayer = getNextPlayer()
		let nextStatus = getNextPlayerStatus(nextPlayer)

		const nextActivePlayers = getActivePlayers(nextStatus)
		if (nextActivePlayers.length === 1) {
			const winner = nextActivePlayers[0]
			const newPots = pots.map(pot => ({ ...pot, winner: winner.toString() }))
			setValue('pots', newPots)
			setPlayerStatusHistory([...playerStatusHistory, nextStatus])
			return
		}

		if (actions.length === 0) {
			const nextBettingPlayers = Object.entries(nextStatus)
				.filter(([_, status]) => ['active', 'current'].includes(status))
				.map(([player]) => Number(player))

			if (nextBettingPlayers.length < 2) {
				setPlayerStatusHistory([...playerStatusHistory, nextStatus])
				nextRound()
				return
			}

			nextPlayer = Math.min(...nextBettingPlayers)
			nextStatus = getNextPlayerStatus(nextPlayer)
			setPlayerStatusHistory([...playerStatusHistory, nextStatus])
			appendAction(nextPlayer)
			return
		}

		const valid = await trigger(`${selector}.${actions.length - 1}.bet`)
		if (!valid) return

		const playersBettingFull = getPlayersBettingFull(actions)
		const playerBetSums = getPlayerBetSums(playersBettingFull, actions)
		const decisionCount = actions.slice(startingAction)

		if (
			playerBetSums.every((bet, _, arr) => bet === arr[0]) &&
			decisionCount.length >= currentRoundStartingBetterCount
		) {
			nextRound()
		} else {
			appendAction(nextPlayer)
		}
		setPlayerStatusHistory([...playerStatusHistory, nextStatus])
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
					setValue('pots', [{ ...initialPot, value: ante * playerCount + bigBlindAnte ?? 0 }])
				} else {
					setValue('pots', watch(`rounds.${currentRound - 2}.finalPots`))
				}
				setValue(`rounds.${currentRound - 1}.potActions`, [])
				setValue(`rounds.${currentRound - 1}.finalPots`, [])
			}

			setCurrentRound(currentRound - 1)
		} else if (villains.length > 0) {
			setValue('pots', watch(`rounds.${currentRound - 1}.finalPots`))
			setValue(`rounds.${currentRound}.potActions`, [])
			setValue(`rounds.${currentRound}.finalPots`, [])
			removeVillains()
		}

		state.error = ''
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
													<p className='font-normal'>Cash Game</p>
												</FormItem>
												<FormItem className='flex items-center space-x-3 space-y-0'>
													<FormControl>
														<RadioGroupItem value='1' />
													</FormControl>
													<p className='font-normal'>Tournament</p>
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
										<input {...field} type='hidden' />
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
										<input {...field} type='hidden' />
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
										<input {...field} type='hidden' />
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
										<input {...field} type='hidden' />
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
										<input {...field} type='hidden' />
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
										<input {...field} type='hidden' />
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
										<input {...field} type='hidden' />
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
											<input {...field} type='hidden' value={JSON.stringify(pots)} />
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
											<input {...field} type='hidden' value={JSON.stringify(rounds)} />
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
											<input {...field} type='hidden' value={JSON.stringify(villains)} />
										</FormControl>
									</FormItem>
								)}
							/>

							{currentRound >= 0 && (
								<>
									<TypographyH2>Hand Action</TypographyH2>

									{ante > 0 ? <p>{`All players bet ante of ${ante}`}</p> : null}
									{bigBlindAnte > 0 ? <p>{`Player 2 bets big blind ante of ${bigBlindAnte}`}</p> : null}

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
											disabled={
												fieldArrays[round].fields.length !== startingActionMap ||
												round !== currentRound ||
												villains.length > 0
											}
										/>

										{fieldArrays[round].fields.slice(startingActionMap).map((action, index, arr) => (
											<ActionInput
												key={action.id}
												selector={`rounds.${round}.actions.${index + startingActionMap}`}
												player={action.player}
												disabled={
													round !== currentRound || index !== arr.length - 1 || villains.length > 0 || showSubmit
												}
											/>
										))}

										{activePlayers.length === 1 && (
											<p className='text-lg'>{`Player ${activePlayers[0]} wins ${
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

							{villains.map((villain, i) => (
								<CardGroupInput
									key={i}
									groupSelector={`villains.${i}`}
									player={villain.player}
									disabled={!!state.analysis}
								/>
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
								<Button
									type='button'
									className='w-1/2 text-xl'
									onClick={handleBack}
									disabled={currentRound === -1 || !!state.analysis}
								>
									Back
								</Button>
								{showSubmit ? (
									<Submit
										setPending={setPending}
										disabled={activePlayers.length === 1 ? false : !villainsCompleted || !!state.analysis}
									/>
								) : (
									<Button type='button' className='w-1/2 text-xl' onClick={handleNext} disabled={disableNext}>
										Next
									</Button>
								)}
							</div>

							{pending && (
								<div className='animate-scalePulse mx-auto w-full'>
									<Image src={pokerChip} alt='loading' width={150} height={150} className='animate-slowSpin mx-auto ' />
								</div>
							)}
							{state.analysis && <Analysis className='animate-fadeIn' analysis={state.analysis} />}
							{state.handId && (
								<Button asChild variant='success' className='animate-fadeIn w-full text-xl p-8'>
									<Link href={`/hand/${state.handId}`}>Hand added successfully! 🎉 Click here to view</Link>
								</Button>
							)}

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
