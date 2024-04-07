'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

export const login = async (prevState: any, formData: FormData) => {
	const requestBody = {
		email: formData.get('email'),
		password: formData.get('password'),
	}

	try {
		const res = await fetch('http://localhost:5159/customLogin', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(requestBody),
		})

		const data = await res.json()
		cookies().set('auth', JSON.stringify({ user: data.userId, token: data.accessToken }))
		redirect('/')
	} catch (e) {
		return { error: `Error: ${e}`, token: '' }
	}
}
