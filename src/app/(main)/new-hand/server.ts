'use server'

import { Hand, HandSteps, Card, Evaluation, Action, PotAction, Round, Villain } from '@/lib/types'
// import { isAuthData } from '@/lib/types'
import { cookies } from 'next/headers'
import { FormSchema } from './formSchema'

export const analyze = async (prevState: any, formData: FormData) => {
	console.log(formData)
	const formDataObj = Object.fromEntries(formData)
	console.log(formDataObj)
	const parsed = FormSchema.safeParse(formDataObj)
	// console.log(parsed?.error)

	if (!parsed.success) {
		return {
			error: 'Form data is invalid',
		}
	}

	// const { data: parsedData } = parsed
	// const { name, gameStyle, playerCount, position, smallBlind, bigBlind, ante, bigBlindAnte, myStack, notes } =
	// 	parsedData
	// console.log(parsedData)

	// create handsteps object

	// create steps
	// iterate over formData.rounds and create Round objects
	// const round0 = parsed

	// create cards from card group
	// create actions from action group

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

	const res = await fetch(`${process.env.API_URL}/hand/analyze`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(handSteps),
	})

	if (res.status !== 200) {
		return {
			error: `Error: ${res.status} - ${res.statusText}`,
		}
	}

	const data = await res.json()

	const analysis = data.analysis

	// postHand(handSteps, analysis).catch(error => {
	// 	console.error(error)
	// })

	return analysis

	// check for analysis response type

	// if (!isAuthData(data)) {
	// 	return {
	// 		error: `Unknown error: ${JSON.stringify(data)}`,
	// 	}
	// }
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
