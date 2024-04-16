import { cookies } from 'next/headers'

export const useGetAuth = (): boolean => {
	let isAuth = false
	const authCookie = cookies().get('auth')?.value ?? ''
	if (authCookie !== '') {
		isAuth = !!JSON.parse(authCookie)?.userId
	}
	return isAuth
}
