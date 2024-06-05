'use server'

import { Hand, HandSteps, Card, Evaluation, Action, PotAction, Round, Villain } from '@/lib/types'
// import { isAuthData } from '@/lib/types'
import { cookies } from 'next/headers'
import { FormRound, FormSchema, Schema } from './formSchema'

export const analyze = async (prevState: any, formData: FormData) => {
	const formDataObj = Object.fromEntries(formData)
	const formDataJson = {
		...formDataObj,
		rounds: JSON.parse(formDataObj.rounds as string),
		villains: JSON.parse(formDataObj.villains as string),
	}
	const parsed = FormSchema.safeParse(formDataJson)

	if (!parsed.success) {
		return {
			error: `Error: ${parsed.error.issues.map(issue => issue.message).join('\n')}`,
		}
	}

	const {
		name,
		gameStyle,
		playerCount,
		position,
		smallBlind,
		bigBlind,
		ante,
		bigBlindAnte,
		myStack,
		notes,
		rounds,
		villains,
	} = parsed.data

	const pots = [
		{
			potIndex: 0,
			winner: '',
		},
	]

	let currentStep = 0
	let currentPotIndex = 0

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
				playerBets[player] += bet
			})

		// if all aggregate bets are the same, one pot
		const entries = Object.entries(playerBets)
		if (entries.every(([_, bet]) => bet === entries[0][1])) {
			return entries.map(
				([player, bet]) =>
					({
						potIndex: currentPotIndex,
						player: parseInt(player),
						bet,
					} as PotAction)
			)
		}

		// if not, create potActions for side pots
		const sortedEntries = entries.toSorted((a, b) => a[1] - b[1])
		let entryProgress = [...sortedEntries]
		let result: PotAction[] = []

		while (entryProgress.length > 0) {
			const currentLowestBet = entryProgress[0][1]
			result.push(
				...entryProgress.map(
					([player, _]) =>
						({
							step: currentStep,
							potIndex: currentPotIndex,
							player: parseInt(player),
							bet: currentLowestBet,
						} as PotAction)
				)
			)
			entryProgress = entryProgress
				.map(([player, bet]) => [player, bet - currentLowestBet] as [string, number])
				.filter(([_, bet]) => bet > 0)
			currentPotIndex++
		}

		return result
	}

	// create steps
	// iterate over formData.rounds and create Round objects

	// create cards from card group
	// create actions from action group
	// create potActions from round actions

	// create villains
	// iterate over formData.villains and create Villain objects

	// create rounds

	// create pots

	// const handSteps = {
	// 	name,
	// 	gameStyle,
	// 	playerCount,
	// 	position,
	// 	smallBlind,
	// 	bigBlind,
	// 	ante,
	// 	bigBlindAnte,
	// 	myStack,
	// 	notes,
	// 	pots: [],
	// 	rounds: [],
	// 	villains: [],
	// } as HandSteps

	const handSteps = {} as HandSteps

	// const res = await fetch(`${process.env.API_URL}/hand/analyze`, {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// 	body: JSON.stringify(handSteps),
	// })

	// if (res.status !== 200) {
	// 	return {
	// 		error: `Error: ${res.status} - ${res.statusText}`,
	// 	}
	// }

	// const data = await res.json()

	// check for analysis response type

	// if (!isAuthData(data)) {
	// 	return {
	// 		error: `Unknown error: ${JSON.stringify(data)}`,
	// 	}
	// }

	// const analysis = data.analysis
	const analysis = 'analysis'

	// postHand(handSteps, analysis).catch(error => {
	// 	console.error(error)
	// })

	return {
		analysis: analysis,
		error: '',
	}
}

export const postHand = async (handSteps: HandSteps, analysis: string) => {
	const authCookie = cookies().get('auth')?.value ?? '{}'
	const applicationUserId = JSON.parse(authCookie)?.userId

	const res = await fetch(`${process.env.API_URL}/hand`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			applicationUserId,
			handSteps,
			analysis,
		}),
	})

	if (res.status !== 200) {
		return {
			error: `Error: ${res.status} - ${res.statusText}`,
		}
	}

	const data = await res.json()

	return data
}
