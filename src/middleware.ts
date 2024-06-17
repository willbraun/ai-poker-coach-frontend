import { NextRequest } from 'next/server'
// import updateSession from server_utils

export async function middleware(request: NextRequest) {
	// return await updateSession(request)
	return console.log('middleware', new Date())
}
