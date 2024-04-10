'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { isAuthData } from '@/lib/types'

interface RegisterResponseError {
	type: string
	title: string
	status: number
	errors: {
		[key: string]: string[]
	}
}

const isRegisterResponseError = (value: any): value is RegisterResponseError => {
	return (
		Object.keys(value).length === 4 &&
		typeof value.type === 'string' &&
		typeof value.title === 'string' &&
		typeof value.status === 'number' &&
		typeof value.errors === 'object' &&
		!Array.isArray(value.errors) &&
		Object.values(value.errors).every(Array.isArray)
	)
}

const getRegisterError = (data: RegisterResponseError): string => {
	return Object.values(data.errors)
		.flatMap(line => `• ${line}`)
		.join('\n')
}

export const createAccount = async (prevState: any, formData: FormData) => {
	const email = formData.get('email') ?? ''
	const password = formData.get('password') ?? ''
	let clientError = ''

	if (!email) {
		clientError = 'Please enter your email\n'
	}

	if (!password) {
		clientError += 'Please enter your password'
	}

	if (clientError) {
		return {
			error: clientError,
		}
	}

	const res = await fetch('http://localhost:5159/customRegister', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			password,
		}),
	})

	const data = await res.json()

	if (typeof data === 'string') {
		return {
			error: data,
		}
	}

	if (isRegisterResponseError(data) && data.status !== 200) {
		return {
			error: `Error: ${data.status} - ${data.title}\n${getRegisterError(data)}`,
		}
	}

	if (!isAuthData(data)) {
		return {
			error: `Unknown error: ${JSON.stringify(data)}`,
		}
	}

	cookies().set(
		'auth',
		JSON.stringify({
			user: data.userId,
			token: data.accessToken,
		}),
		{
			maxAge: 60 * 60 * 24 * 7,
		}
	)

	redirect('/')
}
