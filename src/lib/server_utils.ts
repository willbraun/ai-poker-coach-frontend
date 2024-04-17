import { cookies } from 'next/headers'

export const getAuth = (): boolean => {
	const authCookie = cookies().get('auth')?.value ?? ''
	if (!authCookie) {
		return false
	}

	return !!JSON.parse(authCookie)?.userId
}
