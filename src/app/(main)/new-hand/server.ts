'use server'

import { Hand, HandSteps, Card, Evaluation, Action, PotAction, Round, Villain, Pot } from '@/lib/types'
import { isAnalysisData } from '@/lib/types'
import { FormSchema } from './formSchema'
import { getAuthData } from '@/lib/server_utils'
import { revalidatePath } from 'next/cache'

const decisions = ['fold', 'check', 'call', 'bet', 'raise', 'callAllIn', 'betAllIn']

export const analyze = async (prevState: any, formData: FormData) => {
	const { accessToken } = getAuthData()

	const formDataObj = Object.fromEntries(formData)
	const formDataJson = {
		...formDataObj,
		pots: JSON.parse(formDataObj.pots as string),
		rounds: JSON.parse(formDataObj.rounds as string),
		villains: JSON.parse(formDataObj.villains as string),
	}
	const parsedForm = FormSchema.safeParse(formDataJson)

	if (!parsedForm.success) {
		return {
			error: `Error: ${parsedForm.error.issues.map(issue => issue.message ?? JSON.stringify(issue)).join('\n')}`,
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
		pots,
		rounds,
		villains,
	} = parsedForm.data

	let handStepsName = name
	if (name === '') {
		const latestEval = rounds
			.map(round => round.cards.evaluation)
			.filter(evaluation => evaluation !== '')
			.at(-1)
		handStepsName = latestEval ?? ''
	}

	let currentStep = 1

	const handStepsPots = pots.map((pot, potIndex) => {
		return {
			potIndex: potIndex,
			winner: pot.winner,
		} as Pot
	})

	const handStepsRounds = rounds
		.filter(round => round.actions.length > 0)
		.map(round => {
			const cards: Card[] = round.cards.cards.map((card, cardIndex) => ({
				step: currentStep + cardIndex,
				player: round.cards.player,
				value: card.value,
				suit: card.suit,
			}))

			currentStep += cards.length

			const evaluation: Evaluation = {
				step: currentStep,
				player: position,
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

	const handSteps = {
		name: handStepsName,
		gameStyle,
		playerCount,
		position,
		smallBlind,
		bigBlind,
		ante,
		bigBlindAnte,
		myStack,
		notes,
		pots: handStepsPots,
		rounds: handStepsRounds,
		villains: handStepsVillains,
	} as HandSteps

	const res = await fetch(`${process.env.API_URL}/hand/analyze`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(handSteps),
	})

	if (res.status === 400) {
		const data = await res.json()

		const errors: { [key: string]: string[] } = data.errors
		const error = Object.entries(errors)
			.map(([key, value]) => `${key}: ${value.join(', ')}`)
			.join('\n')

		return {
			error: `Error: ${error}`,
		}
	}

	if (res.status !== 200) {
		return {
			error: `Error analyzing hand: ${res.status} - ${res.statusText}`,
		}
	}

	const data = await res.json()

	if (!isAnalysisData(data)) {
		return {
			error: `Unknown error: ${JSON.stringify(data)}`,
		}
	}

	const postData = await postHand(handSteps, data.analysis)

	if (postData.error) {
		return {
			error: `Error: ${postData.error}`,
		}
	}

	revalidatePath('/', 'layout')

	return {
		analysis: data.analysis,
		handId: postData.id,
		error: '',
	}
}

export const postHand = async (handSteps: HandSteps, analysis: string) => {
	const { userId, accessToken } = getAuthData()

	const res = await fetch(`${process.env.API_URL}/hand`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			applicationUserId: userId,
			handSteps,
			analysis,
		}),
	})

	if (res.status !== 200) {
		return {
			id: '',
			applicationUserId: '',
			handSteps: {},
			analysis: '',
			createdTime: new Date(),
			error: `Error posting hand: ${res.status} - ${res.statusText}`,
		}
	}

	const data: Hand = await res.json()

	return {
		...data,
		error: '',
	}
}
