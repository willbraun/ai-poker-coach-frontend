'use server'

import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const logout = async () => {
	cookies().delete('auth')
	redirect('/')
}

export default logout
