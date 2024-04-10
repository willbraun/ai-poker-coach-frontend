'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const login = async (prevState: any, formData: FormData) => {
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

	const res = await fetch('http://localhost:5159/customLogin', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email,
			password,
		}),
	})

	if (res.status === 401) {
		return {
			error: `Error: Incorrect email or password`,
		}
	}

	if (res.status !== 200) {
		return {
			error: `Error: ${res.status} - ${res.statusText}`,
		}
	}

	const data = await res.json()

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
