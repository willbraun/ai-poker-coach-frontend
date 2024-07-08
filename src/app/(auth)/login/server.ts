'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { isAuthData } from '@/lib/types'

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

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customLogin`, {
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
			userId: data.userId,
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
			expires: new Date(Date.now() + data.expiresIn * 1000),
		}),
		{
			maxAge: 60 * 60 * 24 * 7,
		},
	)
	redirect('/')
}
