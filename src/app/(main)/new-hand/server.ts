'use server'

import { Hand, HandSteps, Card, Evaluation, Action, PotAction, Round, Villain } from '@/lib/types'
// import { isAuthData } from '@/lib/types'
import { cookies } from 'next/headers'
import { FormRound, FormSchema, Schema } from './formSchema'

const decisions = ['folds', 'checks', 'calls', 'bets', 'raises to', 'bets all-in for', 'calls all-in for']

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

	let currentStep = 1

	// create steps
	const handStepsRounds = rounds.map(round => {
		const cards: Card[] = round.cards.cards.map((card, cardIndex) => ({
			step: currentStep + cardIndex,
			player: round.cards.player,
			value: card.value,
			suit: card.suit,
		}))

		currentStep += cards.length

		const evaluation: Evaluation = {
			step: currentStep,
			player: round.cards.player,
			value: round.cards.evaluation,
		}

		currentStep++

		const actions: Action[] = round.actions.map((action, actionIndex) => ({
			step: currentStep + actionIndex,
			player: action.player,
			decision: decisions.indexOf(action.decision),
			bet: action.bet,
		}))

		currentStep += actions.length

		const potActions: PotAction[] = round.potActions.map((potAction, potActionIndex) => ({
			step: currentStep + potActionIndex,
			player: potAction.player,
			potIndex: potAction.potIndex,
			bet: potAction.bet,
		}))

		currentStep += potActions.length

		return {
			cards,
			evaluation,
			actions,
			potActions,
		} as Round
	})

	const handStepsVillains = villains.map(villain => {
		const cards = villain.cards.map((card, cardIndex) => {
			return {
				step: currentStep + cardIndex,
				player: villain.player,
				value: card.value,
				suit: card.suit,
			} as Card
		})

		currentStep += cards.length

		const evaluation = {
			step: currentStep,
			player: villain.player,
			value: villain.evaluation,
		} as Evaluation

		currentStep++

		return {
			cards,
			evaluation,
		} as Villain
	})

	// create pots
	// for each pot, get the winner
	// if there is only one player left, they win
	// if there are multiple players left, the player with the highest evaluation wins
	// if there are multiple players with the same evaluation, the pot is split

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
