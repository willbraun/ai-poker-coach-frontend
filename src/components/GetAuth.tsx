'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/lib/store'
import { AuthData } from '@/lib/types'

const GetAuth = () => {
	const pathname = usePathname()
	const { setUserId } = useAuthStore()

	useEffect(() => {
		const cookie = Cookies.get('auth') ?? '{}'
		const parsed: AuthData = JSON.parse(cookie)
		if (parsed.accessToken) {
			setUserId(parsed.userId)
		}
	}, [pathname, setUserId])

	return <></>
}

export default GetAuth
