'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/lib/store'

const GetAuth = () => {
	const pathname = usePathname()
	const { setAuth } = useAuthStore()

	useEffect(() => {
		const cookie = Cookies.get('auth') ?? '{}'
		setAuth(!!JSON.parse(cookie)?.token)
	}, [pathname, setAuth])

	return <></>
}

export default GetAuth
