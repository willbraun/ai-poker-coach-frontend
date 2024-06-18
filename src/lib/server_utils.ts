import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const getAuthData = () => {
	const authCookie = cookies().get('auth')?.value
	if (!authCookie) {
		return
	}

	return JSON.parse(authCookie)
}

export const getAuth = (): boolean => {
	const authData = getAuthData()
	return !!authData?.userId
}

export const updateSession = async (request: NextRequest) => {
	const authCookie = request.cookies.get('auth')?.value
	if (!authCookie) {
		return
	}

	const parsed = JSON.parse(authCookie)
	const userId = parsed?.userId
	const refreshToken = parsed?.refreshToken

	const refreshRes = await fetch(`${process.env.API_URL}/refresh`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ refreshToken }),
	})

	if (refreshRes.status !== 200) {
		console.error(`Error refreshing token: ${refreshRes.status} - ${refreshRes.statusText}`)
		return
	}

	const data = await refreshRes.json()

	const res = NextResponse.next()
	res.cookies.set(
		'auth',
		JSON.stringify({
			userId,
			accessToken: data.accessToken,
			refreshToken: data.refreshToken,
			expires: new Date(Date.now() + data.expiresIn * 1000),
		}),
		{
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 7,
		}
	)

	return res
}
