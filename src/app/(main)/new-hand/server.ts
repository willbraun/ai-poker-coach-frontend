'use server'

import { Hand, HandSteps } from '@/lib/types'
// import { isAuthData } from '@/lib/types'
import { cookies } from 'next/headers'

export const analyze = async (prevState: any, formData: FormData) => {
	const title = formData.get('title') ?? ''
	console.log(title)
	// pull off other fields

	return

	// create handSteps object
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

	postHand(handSteps, analysis).catch(error => {
		console.error(error)
	})

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
