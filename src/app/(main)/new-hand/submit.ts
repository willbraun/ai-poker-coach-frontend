import { Hand, HandSteps, Card, Evaluation, Action, PotAction, Round, Villain, Pot } from '@/lib/types'
import { FormSchema, Schema } from './formSchema'
import { getAuthDataClient } from '@/lib/utils'

interface AnalysisData {
	analysis: string
}

const isAnalysisData = (value: any): value is AnalysisData => {
	return Object.keys(value).length === 1 && typeof value.analysis === 'string'
}

interface AnalyzeResponse {
	analysis: string
	handId: string
	error: string
}

const decisions = ['fold', 'check', 'call', 'bet', 'raise', 'callAllIn', 'betAllIn']

export const analyze = async (formValues: Schema): Promise<AnalyzeResponse> => {
	const { accessToken } = getAuthDataClient()

	const parsedForm = FormSchema.safeParse(formValues)
	if (!parsedForm.success) {
		return {
			analysis: '',
			handId: '',
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
	} = formValues

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

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hand/analyze`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Origin: 'https://ai-poker-coach.netlify.app',
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
			analysis: '',
			handId: '',
			error: `Error: ${error}`,
		}
	}

	if (res.status !== 200) {
		return {
			analysis: '',
			handId: '',
			error: `Error analyzing hand: ${res.status} - ${res.statusText}`,
		}
	}

	const data = await res.json()

	if (!isAnalysisData(data)) {
		return {
			analysis: '',
			handId: '',
			error: `Unknown error: ${JSON.stringify(data)}`,
		}
	}

	const postData = await postHand(handSteps, data.analysis)

	if (postData.error) {
		return {
			analysis: '',
			handId: '',
			error: `Error: ${postData.error}`,
		}
	}

	return {
		analysis: data.analysis,
		handId: postData.id,
		error: '',
	}
}

const postHand = async (handSteps: HandSteps, analysis: string) => {
	const { userId, accessToken } = getAuthDataClient()

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hand`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
			Origin: 'https://ai-poker-coach.netlify.app',
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
