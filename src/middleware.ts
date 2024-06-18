import { NextRequest } from 'next/server'
import { updateSession } from './lib/server_utils'

export async function middleware(request: NextRequest) {
	const authCookie = request.cookies.get('auth')?.value
	if (!authCookie) {
		return
	}

	const parsed = JSON.parse(authCookie)
	const expires = new Date(parsed.expires)
	const tenMins = 1000 * 60 * 10

	if (expires.getTime() - Date.now() > tenMins) {
		return
	}

	return await updateSession(request)
}
